import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

const emptySection = { id: '', key: '', title: '', contentJson: '{\n  \n}', sortOrder: 0, visible: true };
const emptyProject = {
  id: '', title: '', slug: '', summary: '', description: '', technologies: '',
  demoUrl: '', repoUrl: '', featured: false, published: false, image: null
};

export function AdminPage() {
  const { admin, logout } = useAuth();
  const [sections, setSections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [sectionForm, setSectionForm] = useState(emptySection);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [message, setMessage] = useState('');

  async function load() {
    try {
      const [sectionData, projectData, contactData] = await Promise.all([
        apiFetch('/api/admin/sections'),
        apiFetch('/api/admin/projects'),
        apiFetch('/api/admin/contacts')
      ]);
      setSections(sectionData.sections);
      setProjects(projectData.projects);
      setContacts(contactData.contacts);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveSection(event) {
    event.preventDefault();
    setMessage('');
    try {
      const body = {
        key: sectionForm.key,
        title: sectionForm.title,
        content: JSON.parse(sectionForm.contentJson),
        sortOrder: Number(sectionForm.sortOrder),
        visible: sectionForm.visible
      };
      await apiFetch(sectionForm.id ? `/api/admin/sections/${sectionForm.id}` : '/api/admin/sections', {
        method: sectionForm.id ? 'PUT' : 'POST', body: JSON.stringify(body)
      });
      setSectionForm(emptySection);
      setMessage('Sección guardada.');
      await load();
    } catch (error) { setMessage(error.message); }
  }

  async function saveProject(event) {
    event.preventDefault();
    setMessage('');
    try {
      const body = {
        title: projectForm.title,
        slug: projectForm.slug,
        summary: projectForm.summary,
        description: projectForm.description,
        technologies: projectForm.technologies.split(',').map((value) => value.trim()).filter(Boolean),
        demoUrl: projectForm.demoUrl,
        repoUrl: projectForm.repoUrl,
        featured: projectForm.featured,
        published: projectForm.published
      };
      const data = await apiFetch(projectForm.id ? `/api/admin/projects/${projectForm.id}` : '/api/admin/projects', {
        method: projectForm.id ? 'PUT' : 'POST', body: JSON.stringify(body)
      });
      if (projectForm.image) {
        const formData = new FormData();
        formData.append('image', projectForm.image);
        await apiFetch(`/api/admin/projects/${data.project.id}/image`, { method: 'POST', body: formData });
      }
      setProjectForm(emptyProject);
      setMessage('Proyecto guardado.');
      await load();
    } catch (error) { setMessage(error.message); }
  }

  async function remove(path, label) {
    if (!window.confirm(`¿Eliminar ${label}?`)) return;
    try { await apiFetch(path, { method: 'DELETE' }); await load(); }
    catch (error) { setMessage(error.message); }
  }

  return (
    <section>
      <h1>Panel de administración</h1>
      <p>Sesión: {admin.name} ({admin.email})</p>
      <button onClick={logout}>Cerrar sesión</button>
      {message && <p role="status">{message}</p>}

      <hr />
      <h2>Secciones del portafolio</h2>
      <form onSubmit={saveSection}>
        <p><label>Clave<br /><input value={sectionForm.key} onChange={(e) => setSectionForm({ ...sectionForm, key: e.target.value })} required pattern="[a-z0-9-]+" /></label></p>
        <p><label>Título<br /><input value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} required /></label></p>
        <p><label>Orden<br /><input type="number" value={sectionForm.sortOrder} onChange={(e) => setSectionForm({ ...sectionForm, sortOrder: e.target.value })} /></label></p>
        <p><label><input type="checkbox" checked={sectionForm.visible} onChange={(e) => setSectionForm({ ...sectionForm, visible: e.target.checked })} /> Visible</label></p>
        <p><label>Contenido JSON<br /><textarea rows="14" cols="90" value={sectionForm.contentJson} onChange={(e) => setSectionForm({ ...sectionForm, contentJson: e.target.value })} required /></label></p>
        <button>{sectionForm.id ? 'Actualizar' : 'Crear'} sección</button>{' '}
        <button type="button" onClick={() => setSectionForm(emptySection)}>Limpiar</button>
      </form>
      {sections.map((section) => (
        <article key={section.id}>
          <h3>{section.title} ({section.key})</h3>
          <button onClick={() => setSectionForm({ ...section, contentJson: JSON.stringify(section.content, null, 2) })}>Editar</button>{' '}
          <button onClick={() => remove(`/api/admin/sections/${section.id}`, `la sección ${section.title}`)}>Eliminar</button>
        </article>
      ))}

      <hr />
      <h2>Proyectos</h2>
      <form onSubmit={saveProject}>
        <p><label>Título<br /><input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required /></label></p>
        <p><label>Slug opcional<br /><input value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} /></label></p>
        <p><label>Resumen<br /><textarea value={projectForm.summary} onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })} required /></label></p>
        <p><label>Descripción<br /><textarea rows="8" cols="90" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required /></label></p>
        <p><label>Tecnologías separadas por coma<br /><input value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} /></label></p>
        <p><label>URL desplegada<br /><input type="url" value={projectForm.demoUrl} onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })} /></label></p>
        <p><label>URL repositorio<br /><input type="url" value={projectForm.repoUrl} onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })} /></label></p>
        <p><label>Imagen JPG/PNG/WEBP<br /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setProjectForm({ ...projectForm, image: e.target.files?.[0] || null })} /></label></p>
        <p><label><input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} /> Destacado</label></p>
        <p><label><input type="checkbox" checked={projectForm.published} onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })} /> Publicado</label></p>
        <button>{projectForm.id ? 'Actualizar' : 'Crear'} proyecto</button>{' '}
        <button type="button" onClick={() => setProjectForm(emptyProject)}>Limpiar</button>
      </form>
      {projects.map((project) => (
        <article key={project.id}>
          <h3>{project.title}</h3><p>{project.summary}</p><p>Publicado: {project.published ? 'Sí' : 'No'}</p>
          <button onClick={() => setProjectForm({ ...project, technologies: project.technologies.join(', '), image: null })}>Editar</button>{' '}
          <button onClick={() => remove(`/api/admin/projects/${project.id}`, `el proyecto ${project.title}`)}>Eliminar</button>
        </article>
      ))}

      <hr />
      <h2>Mensajes de contacto</h2>
      {contacts.map((contact) => (
        <article key={contact.id}>
          <h3>{contact.subject}</h3><p>{contact.name} — {contact.email} — {contact.phone}</p><p>{contact.message}</p>
          <label>Estado <select value={contact.status} onChange={async (e) => { await apiFetch(`/api/admin/contacts/${contact.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: e.target.value }) }); await load(); }}><option value="new">Nuevo</option><option value="read">Leído</option><option value="replied">Respondido</option><option value="archived">Archivado</option></select></label>
        </article>
      ))}
    </section>
  );
}
