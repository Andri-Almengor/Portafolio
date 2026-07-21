import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import { Icon } from '../../components/Icon.jsx';
import { LoadingState } from '../../components/LoadingState.jsx';
import { Toast } from '../../components/Toast.jsx';

const emptyProject = {
  id: '',
  title: '',
  slug: '',
  summary: '',
  problem: '',
  objective: '',
  solution: '',
  integration: '',
  description: '',
  challenges: '',
  results: '',
  technologies: [],
  demoUrl: '',
  repoUrl: '',
  featured: false,
  published: false,
  imageUrl: ''
};

const tabs = [
  ['info', 'info', 'Información principal'],
  ['links', 'link', 'Enlaces'],
  ['images', 'image', 'Imagen'],
  ['content', 'description', 'Contenido detallado']
];

const detailedFields = [
  {
    name: 'problem',
    label: 'El problema',
    placeholder: 'Explica la necesidad, limitación o proceso que dio origen al proyecto.'
  },
  {
    name: 'objective',
    label: 'Objetivo',
    placeholder: 'Describe qué debía lograr la solución y cuál era el alcance esperado.'
  },
  {
    name: 'solution',
    label: 'Arquitectura funcional',
    placeholder: 'Explica los módulos, flujos, actores y componentes principales de la solución.'
  },
  {
    name: 'integration',
    label: 'Integración',
    placeholder: 'Detalla las APIs, servicios, bases de datos, automatizaciones o plataformas conectadas.'
  },
  {
    name: 'description',
    label: 'Descripción técnica',
    placeholder: 'Describe la implementación, lógica, seguridad, almacenamiento y decisiones técnicas.'
  },
  {
    name: 'challenges',
    label: 'Retos técnicos',
    placeholder: 'Indica los principales problemas técnicos encontrados y cómo fueron resueltos.'
  },
  {
    name: 'results',
    label: 'Resultado',
    placeholder: 'Resume los beneficios obtenidos, mejoras medibles y estado final del proyecto.'
  }
];

function TextAreaField({ field, value, onChange }) {
  const isDescription = field.name === 'description';
  return (
    <label className="block">
      <span className="mb-2 block font-label text-label-sm text-on-surface-variant">
        {field.label}
      </span>
      <textarea
        className="form-control min-h-[150px] resize-y p-4"
        name={field.name}
        value={value || ''}
        onChange={onChange}
        required={isDescription}
        minLength={isDescription ? 10 : undefined}
        maxLength="4000"
        placeholder={field.placeholder}
      />
    </label>
  );
}

export function AdminProjectEditorPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState({ ...emptyProject, ...(location.state?.project || {}) });
  const [techInput, setTechInput] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(location.state?.project?.imageUrl || '');
  const [activeTab, setActiveTab] = useState('info');
  const [notice, setNotice] = useState({ message: '', tone: 'success' });
  const [loading, setLoading] = useState(Boolean(id && !location.state?.project));
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!id || location.state?.project) return;
    let active = true;

    apiFetch('/api/admin/projects')
      .then((data) => {
        const found = (data.projects || []).find((item) => item.id === id);
        if (!found) throw new Error('Proyecto no encontrado.');
        if (active) {
          setProject({ ...emptyProject, ...found });
          setPreviewUrl(found.imageUrl || '');
        }
      })
      .catch((error) => {
        if (active) setNotice({ message: error.message, tone: 'error' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, location.state]);

  useEffect(() => {
    if (!image) return undefined;
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const generatedSlug = useMemo(
    () => project.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    [project.title]
  );

  function update(event) {
    const { name, value, checked, type } = event.target;
    setProject((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function addTechnology() {
    const value = techInput.trim();
    if (!value || project.technologies.includes(value)) return;
    setProject((current) => ({
      ...current,
      technologies: [...current.technologies, value]
    }));
    setTechInput('');
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setNotice({ message: '', tone: 'success' });

    try {
      const body = {
        title: project.title,
        slug: project.slug || generatedSlug,
        summary: project.summary,
        problem: project.problem || '',
        objective: project.objective || '',
        solution: project.solution || '',
        integration: project.integration || '',
        description: project.description,
        challenges: project.challenges || '',
        results: project.results || '',
        technologies: project.technologies,
        demoUrl: project.demoUrl || '',
        repoUrl: project.repoUrl || '',
        featured: project.featured,
        published: project.published
      };

      const data = await apiFetch(
        isEditing ? `/api/admin/projects/${id}` : '/api/admin/projects',
        {
          method: isEditing ? 'PUT' : 'POST',
          body: JSON.stringify(body)
        }
      );

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        await apiFetch(`/api/admin/projects/${data.project.id}/image`, {
          method: 'POST',
          body: formData
        });
      }

      setNotice({ message: 'Proyecto guardado correctamente.', tone: 'success' });
      setTimeout(() => navigate('/admin/projects', { replace: true }), 700);
    } catch (error) {
      setNotice({ message: error.message, tone: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Cargando editor de proyecto..." />;

  return (
    <div className="min-h-[calc(100vh-64px)] pb-24">
      <header className="border-b border-outline-variant/10 bg-surface-container-low/40 px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              className="mb-2 inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary"
              to="/admin/projects"
            >
              <Icon className="text-lg">arrow_back</Icon> Volver a proyectos
            </Link>
            <h1 className="font-headline text-headline-md">
              {isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              className="rounded-lg border border-outline-variant/20 px-4 py-2 text-on-surface-variant hover:border-primary/40 hover:text-primary"
              type="button"
              onClick={() => navigate('/admin/projects')}
            >
              Cancelar
            </button>
            <button
              className="flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2 font-bold text-on-primary-container disabled:opacity-60"
              type="submit"
              form="project-editor-form"
              disabled={saving}
            >
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary-container/30 border-t-on-primary-container" />
              ) : (
                <Icon className="text-lg">save</Icon>
              )}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="custom-scrollbar mb-8 flex gap-6 overflow-x-auto border-b border-outline-variant/10">
          {tabs.map(([key, icon, label]) => (
            <button
              className={`flex flex-shrink-0 items-center gap-2 border-b-2 px-2 pb-4 font-label text-label-sm transition-colors ${activeTab === key ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}
              type="button"
              key={key}
              onClick={() => setActiveTab(key)}
            >
              <Icon className="text-lg">{icon}</Icon>
              {label}
            </button>
          ))}
        </div>

        <form className="space-y-8" id="project-editor-form" onSubmit={save}>
          {activeTab === 'info' && (
            <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="space-y-6 md:col-span-8">
                <div className="interactive-card rounded-xl border border-outline-variant/10 bg-surface-container-low p-6">
                  <label className="block">
                    <span className="mb-2 block font-label text-label-sm text-on-surface-variant">Título del proyecto</span>
                    <input
                      className="form-control p-3"
                      name="title"
                      value={project.title}
                      onChange={update}
                      required
                      minLength="2"
                      maxLength="120"
                      placeholder="Sistema de gestión de mantenimientos"
                    />
                  </label>

                  <label className="mt-5 block">
                    <span className="mb-2 block font-label text-label-sm text-on-surface-variant">URL Slug</span>
                    <div className="flex">
                      <span className="hidden items-center rounded-l-lg border border-r-0 border-outline-variant/20 bg-surface-variant/30 px-3 text-sm text-on-surface-variant sm:flex">
                        /projects/
                      </span>
                      <input
                        className="form-control rounded-l-lg p-3 sm:rounded-l-none"
                        name="slug"
                        value={project.slug}
                        onChange={update}
                        pattern="[a-z0-9-]*"
                        maxLength="140"
                        placeholder={generatedSlug || 'mi-proyecto'}
                      />
                    </div>
                  </label>

                  <label className="mt-5 block">
                    <span className="mb-2 block font-label text-label-sm text-on-surface-variant">Resumen breve</span>
                    <textarea
                      className="form-control resize-y p-3"
                      rows="4"
                      name="summary"
                      value={project.summary}
                      onChange={update}
                      required
                      minLength="10"
                      maxLength="350"
                      placeholder="Descripción corta para la tarjeta del proyecto."
                    />
                  </label>
                </div>

                <div className="interactive-card rounded-xl border border-outline-variant/10 bg-surface-container-low p-6">
                  <span className="mb-4 block font-label text-label-sm text-on-surface-variant">Tecnologías utilizadas</span>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                        key={technology}
                      >
                        {technology}
                        <button
                          type="button"
                          className="hover:text-white"
                          onClick={() => setProject((current) => ({
                            ...current,
                            technologies: current.technologies.filter((item) => item !== technology)
                          }))}
                          aria-label={`Eliminar ${technology}`}
                        >
                          <Icon className="text-sm">close</Icon>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="form-control p-3"
                      value={techInput}
                      onChange={(event) => setTechInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addTechnology();
                        }
                      }}
                      maxLength="50"
                      placeholder="Ej. React"
                    />
                    <button
                      className="rounded-lg border border-outline-variant/20 px-4 text-on-surface-variant hover:border-primary/40 hover:text-primary"
                      type="button"
                      onClick={addTechnology}
                    >
                      <Icon>add</Icon>
                    </button>
                  </div>
                </div>
              </div>

              <aside className="space-y-6 md:col-span-4">
                <div className="interactive-card rounded-xl border border-outline-variant/10 bg-surface-container-low p-6">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between rounded-lg bg-surface-variant/20 p-3">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="text-primary">verified</Icon> Proyecto destacado
                      </span>
                      <input
                        className="h-5 w-5 accent-[#7c3aed]"
                        type="checkbox"
                        name="featured"
                        checked={project.featured}
                        onChange={update}
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-lg bg-surface-variant/20 p-3">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Icon>visibility</Icon> Publicado
                      </span>
                      <input
                        className="h-5 w-5 accent-[#7c3aed]"
                        type="checkbox"
                        name="published"
                        checked={project.published}
                        onChange={update}
                      />
                    </label>
                  </div>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
                    <Icon className="text-lg">tips_and_updates</Icon> Recomendación
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                    Completa la pestaña Contenido detallado para que cada sección técnica aparezca correctamente en la página pública del proyecto.
                  </p>
                </div>
              </aside>
            </section>
          )}

          {activeTab === 'links' && (
            <section className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-label text-label-sm text-on-surface-variant">URL de demo en vivo</span>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">language</Icon>
                    <input
                      className="form-control p-3 pl-10"
                      name="demoUrl"
                      type="url"
                      value={project.demoUrl}
                      onChange={update}
                      placeholder="https://demo.example.com"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block font-label text-label-sm text-on-surface-variant">Repositorio GitHub</span>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">code</Icon>
                    <input
                      className="form-control p-3 pl-10"
                      name="repoUrl"
                      type="url"
                      value={project.repoUrl}
                      onChange={update}
                      placeholder="https://github.com/usuario/repositorio"
                    />
                  </div>
                </label>
              </div>
            </section>
          )}

          {activeTab === 'images' && (
            <section className="space-y-6">
              <label className="interactive-card flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low p-8 text-center hover:border-primary/50 md:p-12">
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setImage(event.target.files?.[0] || null)}
                />
                <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-variant/30 text-primary">
                  <Icon className="text-3xl">cloud_upload</Icon>
                </span>
                <h2 className="font-headline text-headline-md">Sube la imagen principal</h2>
                <p className="mt-2 max-w-md text-on-surface-variant">
                  JPG, PNG o WEBP. El backend la validará, redimensionará y guardará en Google Drive.
                </p>
                <span className="mt-5 rounded-lg border border-outline-variant/20 bg-surface-container-high px-6 py-2 font-bold">
                  Seleccionar archivo
                </span>
              </label>
              {previewUrl && (
                <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low">
                  <img className="aspect-video w-full object-cover" src={previewUrl} alt="Vista previa del proyecto" />
                </div>
              )}
            </section>
          )}

          {activeTab === 'content' && (
            <section className="space-y-6 rounded-xl border border-outline-variant/10 bg-surface-container-low p-6 md:p-8">
              <div>
                <h2 className="font-headline text-headline-md">Contenido técnico del proyecto</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Cada campo se mostrará como una sección independiente en la página pública.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {detailedFields.map((field) => (
                  <div
                    className={field.name === 'description' ? 'md:col-span-2' : ''}
                    key={field.name}
                  >
                    <TextAreaField field={field} value={project[field.name]} onChange={update} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </form>
      </main>

      <Toast
        message={notice.message}
        tone={notice.tone}
        onClose={() => setNotice({ message: '', tone: 'success' })}
      />
    </div>
  );
}
