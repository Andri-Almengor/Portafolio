import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import { ConfirmModal } from '../../components/ConfirmModal.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Icon } from '../../components/Icon.jsx';
import { LoadingState } from '../../components/LoadingState.jsx';
import { Toast } from '../../components/Toast.jsx';

export function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState({ message: '', tone: 'success' });
  const [loading, setLoading] = useState(true);

  async function load() { const data = await apiFetch('/api/admin/projects'); setProjects(data.projects || []); }
  useEffect(() => { let active = true; load().catch((error) => { if (active) setNotice({ message: error.message, tone: 'error' }); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return projects.filter((project) => {
      const queryMatches = !text || [project.title, project.slug, ...(project.technologies || [])].join(' ').toLowerCase().includes(text);
      const statusMatches = statusFilter === 'all' || (statusFilter === 'published' ? project.published : !project.published);
      return queryMatches && statusMatches;
    });
  }, [projects, query, statusFilter]);

  async function updateProject(project, patch) {
    try {
      await apiFetch(`/api/admin/projects/${project.id}`, { method: 'PUT', body: JSON.stringify({ title: project.title, slug: project.slug, summary: project.summary, description: project.description, technologies: project.technologies || [], demoUrl: project.demoUrl || '', repoUrl: project.repoUrl || '', featured: project.featured, published: project.published, ...patch }) });
      await load();
      setNotice({ message: 'Proyecto actualizado.', tone: 'success' });
    } catch (error) { setNotice({ message: error.message, tone: 'error' }); }
  }

  async function removeProject() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await apiFetch(`/api/admin/projects/${deleteTarget.id}`, { method: 'DELETE' }); setDeleteTarget(null); await load(); setNotice({ message: 'Proyecto eliminado correctamente.', tone: 'success' }); }
    catch (error) { setNotice({ message: error.message, tone: 'error' }); }
    finally { setDeleting(false); }
  }

  if (loading) return <LoadingState label="Cargando proyectos..." />;

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 md:p-8"><div className="mx-auto max-w-[1280px]">
      <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><h1 className="font-headline text-headline-lg">Proyectos</h1><p className="mt-1 text-on-surface-variant">Administra los trabajos publicados y sus imágenes.</p></div><Link className="flex w-fit items-center gap-2 rounded-xl bg-primary-container px-5 py-2.5 font-label text-label-sm font-bold text-on-primary-container active:scale-95" to="/admin/projects/new"><Icon>add</Icon> Nuevo proyecto</Link></header>
      <section className="mb-6 flex flex-col gap-4 rounded-xl border border-outline-variant/10 bg-surface-container-low p-4 md:flex-row md:items-center"><label className="relative flex-1"><span className="sr-only">Buscar proyectos</span><Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</Icon><input className="form-control h-11 pl-10 pr-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar proyectos..." /></label><select className="form-control h-11 px-4 md:w-52" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Todos los estados</option><option value="published">Publicado</option><option value="draft">Borrador</option></select><span className="font-label text-xs text-on-surface-variant">Mostrando <strong className="text-primary">{filtered.length}</strong> de {projects.length}</span></section>
      {!filtered.length ? <EmptyState icon="folder_open" title="No hay proyectos para mostrar" description="Crea un nuevo proyecto o cambia los filtros de búsqueda." action={<Link className="rounded-lg bg-primary-container px-5 py-2.5 font-bold text-on-primary-container" to="/admin/projects/new">Crear proyecto</Link>} /> : <section className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low"><div className="custom-scrollbar overflow-x-auto"><table className="w-full min-w-[980px] border-collapse text-left"><thead><tr className="border-b border-outline-variant/10 bg-surface-container-lowest/50">{['Miniatura', 'Proyecto', 'Tecnologías', 'Estado', 'Destacado', 'Actualizado', 'Acciones'].map((heading) => <th className="px-5 py-4 font-label text-xs uppercase tracking-wider text-on-surface-variant" key={heading}>{heading}</th>)}</tr></thead><tbody className="divide-y divide-outline-variant/10">{filtered.map((project) => <tr className="group hover:bg-surface-container-high/30" key={project.id}><td className="px-5 py-4"><div className="h-11 w-20 overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-variant/30">{project.imageUrl ? <img className="h-full w-full object-cover" src={project.imageUrl} alt="" /> : <div className="page-grid flex h-full items-center justify-center text-primary"><Icon>terminal</Icon></div>}</div></td><td className="max-w-[260px] px-5 py-4"><p className="truncate font-bold">{project.title}</p><p className="mt-1 truncate font-code text-xs text-on-surface-variant">/projects/{project.slug}</p></td><td className="px-5 py-4"><div className="flex max-w-[260px] flex-wrap gap-1.5">{(project.technologies || []).slice(0, 4).map((technology) => <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary" key={technology}>{technology}</span>)}</div></td><td className="px-5 py-4"><button className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${project.published ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-outline-variant/20 bg-surface-variant/30 text-on-surface-variant'}`} type="button" onClick={() => updateProject(project, { published: !project.published })}><span className={`h-1.5 w-1.5 rounded-full ${project.published ? 'bg-emerald-400' : 'bg-on-surface-variant'}`} />{project.published ? 'Publicado' : 'Borrador'}</button></td><td className="px-5 py-4 text-center"><button className={`p-2 ${project.featured ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`} type="button" onClick={() => updateProject(project, { featured: !project.featured })} aria-label={project.featured ? 'Quitar de destacados' : 'Marcar como destacado'}><Icon filled={project.featured}>star</Icon></button></td><td className="px-5 py-4 text-sm text-on-surface-variant">{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('es-CR') : '—'}</td><td className="px-5 py-4"><div className="flex justify-end gap-1">{project.published && <a className="p-2 text-on-surface-variant hover:text-primary" href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" aria-label="Ver proyecto"><Icon className="text-xl">visibility</Icon></a>}<Link className="p-2 text-on-surface-variant hover:text-primary" to={`/admin/projects/${project.id}/edit`} state={{ project }} aria-label="Editar proyecto"><Icon className="text-xl">edit</Icon></Link><button className="p-2 text-on-surface-variant hover:text-error" type="button" onClick={() => setDeleteTarget(project)} aria-label="Eliminar proyecto"><Icon className="text-xl">delete</Icon></button></div></td></tr>)}</tbody></table></div></section>}
    </div><ConfirmModal open={Boolean(deleteTarget)} title="Eliminar proyecto" description={`Esta acción eliminará “${deleteTarget?.title || ''}” y su imagen asociada. No se puede deshacer.`} onCancel={() => setDeleteTarget(null)} onConfirm={removeProject} busy={deleting} /><Toast message={notice.message} tone={notice.tone} onClose={() => setNotice({ message: '', tone: 'success' })} /></div>
  );
}
