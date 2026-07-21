import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import { Icon } from '../../components/Icon.jsx';
import { LoadingState } from '../../components/LoadingState.jsx';

function SummaryCard({ icon, label, value, detail, tone = 'primary' }) {
  const toneClass = tone === 'tertiary' ? 'text-tertiary bg-tertiary/10' : tone === 'secondary' ? 'text-secondary bg-secondary/10' : 'text-primary bg-primary/10';
  return <article className="interactive-card tonal-layer-2 rounded-xl border border-outline-variant/10 p-6"><div className="mb-4 flex items-start justify-between"><div className={`rounded-lg p-2 ${toneClass}`}><Icon filled>{icon}</Icon></div>{detail && <span className="rounded bg-primary/10 px-2 py-1 font-code text-[10px] text-primary">{detail}</span>}</div><p className="font-label text-label-sm text-on-surface-variant">{label}</p><p className="mt-1 font-headline text-headline-md">{value}</p></article>;
}

export function AdminDashboardPage() {
  const [data, setData] = useState({ sections: [], projects: [], contacts: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([apiFetch('/api/admin/sections'), apiFetch('/api/admin/projects'), apiFetch('/api/admin/contacts')])
      .then(([sections, projects, contacts]) => { if (active) setData({ sections: sections.sections || [], projects: projects.projects || [], contacts: contacts.contacts || [] }); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <LoadingState label="Cargando panel administrativo..." />;
  const unread = data.contacts.filter((contact) => contact.status === 'new').length;
  const published = data.projects.filter((project) => project.published).length;
  const featured = data.projects.filter((project) => project.featured).length;
  const visibleSections = data.sections.filter((section) => section.visible).length;

  return (
    <div className="custom-scrollbar min-h-[calc(100vh-64px)] p-4 md:p-8">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="font-headline text-headline-lg">Resumen del sistema</h1><p className="mt-1 text-on-surface-variant">Estado actual del contenido y actividad del portafolio.</p></div><Link className="flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-label text-label-sm font-bold text-on-primary active:scale-95" to="/admin/projects/new"><Icon>add</Icon> Nuevo proyecto</Link></header>
        {error && <p className="rounded-xl border border-error/20 bg-error/5 p-4 text-error" role="alert">{error}</p>}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard icon="folder" label="Total de proyectos" value={data.projects.length} detail={`${published} publicados`} /><SummaryCard icon="star" label="Proyectos destacados" value={featured} tone="tertiary" /><SummaryCard icon="chat_bubble" label="Mensajes recibidos" value={data.contacts.length} detail={`${unread} nuevos`} tone="secondary" /><SummaryCard icon="visibility" label="Secciones visibles" value={visibleSections} detail={`de ${data.sections.length}`} /></section>
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <article className="purple-glow tonal-layer-2 relative min-h-[360px] overflow-hidden rounded-xl border border-outline-variant/10 p-7 lg:col-span-2"><div className="relative z-10"><h2 className="font-headline text-headline-md">Actividad del portafolio</h2><p className="mt-1 text-sm text-on-surface-variant">Representación de proyectos publicados y mensajes recibidos.</p></div><div className="relative z-10 mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">{[['Proyectos', data.projects.length], ['Publicados', published], ['Mensajes', data.contacts.length], ['Pendientes', unread]].map(([label, value]) => <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-5 text-center" key={label}><p className="font-headline text-3xl font-bold text-primary">{value}</p><p className="mt-2 text-xs uppercase tracking-wider text-on-surface-variant">{label}</p></div>)}</div><div className="absolute bottom-0 left-0 right-0 h-32 opacity-70"><svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 140" aria-hidden="true"><defs><linearGradient id="dashboardArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></linearGradient></defs><path d="M0,120 C100,100 160,125 230,80 C310,28 380,100 460,50 C540,5 620,70 800,18 L800,140 L0,140 Z" fill="url(#dashboardArea)" /><path d="M0,120 C100,100 160,125 230,80 C310,28 380,100 460,50 C540,5 620,70 800,18" fill="none" stroke="#d2bbff" strokeWidth="3" /></svg></div></article>
          <aside className="space-y-4"><h2 className="px-1 font-label text-xs uppercase tracking-widest text-on-surface-variant">Acciones rápidas</h2>{[['/admin/projects/new', 'add_circle', 'Nuevo proyecto', 'Agregar trabajo al portafolio'], ['/admin/sections', 'person_edit', 'Editar portafolio', 'Actualizar secciones públicas'], ['/admin/messages', 'mark_email_unread', 'Ver mensajes', `${unread} mensajes nuevos`]].map(([to, icon, title, subtitle]) => <Link className="group flex w-full items-center justify-between rounded-xl border border-outline-variant/10 bg-surface-container-low p-4 hover:bg-surface-variant/20" to={to} key={to}><span className="flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon>{icon}</Icon></span><span><span className="block font-label text-sm font-bold">{title}</span><span className="block text-xs text-on-surface-variant">{subtitle}</span></span></span><Icon className="text-on-surface-variant transition-transform group-hover:translate-x-1">chevron_right</Icon></Link>)}<div className="inner-stroke-primary rounded-xl border border-primary/20 bg-surface-container-lowest p-6"><div className="mb-3 flex items-center gap-2 text-primary"><Icon className="text-lg">security</Icon><span className="font-label text-sm font-bold">Estado del sistema</span></div><div className="space-y-3 text-xs"><div className="flex justify-between"><span className="text-on-surface-variant">API</span><span className="font-code text-emerald-400">OPERATIVA</span></div><div className="h-1 overflow-hidden rounded-full bg-surface-variant/40"><div className="h-full w-full bg-primary" /></div><div className="flex justify-between"><span className="text-on-surface-variant">Autenticación</span><span className="font-code text-primary">PROTEGIDA</span></div></div></div></aside>
        </section>
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <article className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low"><div className="flex items-center justify-between border-b border-outline-variant/10 p-6"><h2 className="font-headline text-headline-md">Mensajes recientes</h2><Link className="font-label text-xs text-primary hover:underline" to="/admin/messages">Ver todos</Link></div><div className="divide-y divide-outline-variant/10">{data.contacts.slice(0, 4).map((contact) => <div className="p-4" key={contact.id}><div className="flex justify-between gap-3"><span className="font-bold">{contact.name}</span><span className="text-xs text-on-surface-variant">{new Date(contact.createdAt).toLocaleDateString('es-CR')}</span></div><p className="mt-1 text-sm font-semibold text-primary">{contact.subject}</p><p className="mt-1 line-clamp-1 text-sm text-on-surface-variant">{contact.message}</p></div>)}{!data.contacts.length && <p className="p-6 text-on-surface-variant">No hay mensajes todavía.</p>}</div></article>
          <article className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low"><div className="flex items-center justify-between border-b border-outline-variant/10 p-6"><h2 className="font-headline text-headline-md">Proyectos recientes</h2><Link className="font-label text-xs text-primary hover:underline" to="/admin/projects">Administrar</Link></div><div className="divide-y divide-outline-variant/10">{data.projects.slice(0, 4).map((project) => <div className="flex items-center justify-between gap-4 p-4" key={project.id}><div className="min-w-0"><p className="truncate font-bold">{project.title}</p><p className="mt-1 truncate font-code text-xs text-on-surface-variant">/{project.slug}</p></div><span className={`rounded-full border px-3 py-1 text-xs ${project.published ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-outline-variant/20 bg-surface-variant/30 text-on-surface-variant'}`}>{project.published ? 'Publicado' : 'Borrador'}</span></div>)}{!data.projects.length && <p className="p-6 text-on-surface-variant">No hay proyectos todavía.</p>}</div></article>
        </section>
      </div>
    </div>
  );
}
