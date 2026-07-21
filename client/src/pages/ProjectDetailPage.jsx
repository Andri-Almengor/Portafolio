import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { Icon } from '../components/Icon.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [others, setOthers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([apiFetch(`/api/public/projects/${encodeURIComponent(slug)}`), apiFetch('/api/public/projects')])
      .then(([projectData, projectsData]) => {
        if (!active) return;
        setProject(projectData.project);
        setOthers((projectsData.projects || []).filter((item) => item.slug !== slug).slice(0, 3));
      })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [slug]);

  if (error) return <div className="min-h-screen px-4 pb-20 pt-32"><div className="mx-auto max-w-3xl rounded-xl border border-error/20 bg-error/5 p-8 text-center"><Icon className="mb-3 text-4xl text-error">error</Icon><h1 className="font-headline text-headline-md">No fue posible cargar el proyecto</h1><p className="mt-2 text-on-surface-variant">{error}</p><Link className="mt-6 inline-flex rounded-lg bg-primary-container px-5 py-2.5 font-semibold text-on-primary-container" to="/projects">Volver a proyectos</Link></div></div>;
  if (!project) return <LoadingState label="Cargando proyecto..." />;

  return (
    <div className="min-h-screen bg-[#08080A] pb-section-gap pt-20">
      <header className="mx-auto max-w-[1280px] px-4 pb-8 pt-16 md:px-container-margin">
        <nav className="mb-8 flex flex-wrap items-center gap-2 font-label text-label-sm text-on-surface-variant"><Link className="hover:text-primary" to="/">Inicio</Link><Icon className="text-sm">chevron_right</Icon><Link className="hover:text-primary" to="/projects">Proyectos</Link><Icon className="text-sm">chevron_right</Icon><span className="text-primary">{project.title}</span></nav>
        <div className="mb-8 flex flex-wrap gap-2">{(project.technologies || []).map((technology) => <span className="skill-chip rounded-lg px-3 py-1 font-label text-xs" key={technology}>{technology}</span>)}</div>
        <h1 className="max-w-5xl font-headline text-headline-xl-mobile md:text-headline-xl">{project.title}</h1>
        <p className="mt-6 max-w-3xl text-body-lg text-on-surface-variant">{project.summary}</p>
        <div className="inner-stroke-primary purple-glow relative mt-12 aspect-video overflow-hidden rounded-xl bg-surface-container-lowest">{project.imageUrl ? <img className="h-full w-full object-cover" src={project.imageUrl} alt={`Imagen principal de ${project.title}`} /> : <div className="page-grid hero-radial flex h-full items-center justify-center"><Icon className="text-7xl text-primary">terminal</Icon></div>}</div>
      </header>

      <section className="mx-auto mt-16 grid max-w-[1280px] grid-cols-1 gap-12 px-4 md:px-container-margin lg:grid-cols-12">
        <div className="space-y-16 lg:col-span-8">
          <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div><h2 className="mb-5 flex items-center gap-2 font-headline text-headline-md text-primary"><Icon>report_problem</Icon> El problema</h2><p className="whitespace-pre-line leading-relaxed text-on-surface-variant">{project.problem || project.description}</p></div>
            <div><h2 className="mb-5 flex items-center gap-2 font-headline text-headline-md text-primary"><Icon>track_changes</Icon> Objetivo</h2><p className="whitespace-pre-line leading-relaxed text-on-surface-variant">{project.objective || 'Crear una solución funcional, mantenible y orientada a mejorar el proceso operativo relacionado con este proyecto.'}</p></div>
          </section>
          <section>
            <h2 className="mb-7 font-headline text-headline-md text-primary">Solución implementada</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <article className="inner-stroke-primary interactive-card tonal-layer-2 rounded-xl p-8 md:col-span-2"><h3 className="font-headline text-headline-md">Arquitectura funcional</h3><p className="mt-4 whitespace-pre-line text-on-surface-variant">{project.solution || project.description}</p></article>
              <article className="inner-stroke-primary interactive-card tonal-layer-2 flex flex-col items-center justify-center rounded-xl p-8 text-center"><Icon className="mb-4 text-5xl text-primary">speed</Icon><span className="font-headline text-3xl font-bold text-on-surface">Operativa</span><span className="mt-2 font-label text-xs uppercase tracking-wider text-on-surface-variant">Solución implementada</span></article>
              <article className="inner-stroke-primary interactive-card tonal-layer-2 rounded-xl p-8"><Icon className="mb-4 text-primary">cloud_sync</Icon><h3 className="font-bold">Integración</h3><p className="mt-2 text-sm text-on-surface-variant">Conexión organizada entre interfaz, servicios, almacenamiento y procesos automatizados.</p></article>
              <article className="inner-stroke-primary interactive-card tonal-layer-2 rounded-xl p-8 md:col-span-2"><h3 className="font-bold">Tecnologías utilizadas</h3><div className="mt-4 flex flex-wrap gap-2">{(project.technologies || []).map((technology) => <span className="skill-chip rounded-lg px-3 py-1 text-sm" key={technology}>{technology}</span>)}</div></article>
            </div>
          </section>
          <section className="space-y-8"><div><h2 className="mb-5 font-headline text-headline-md text-primary">Descripción técnica</h2><div className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-8"><p className="whitespace-pre-line leading-relaxed text-on-surface-variant">{project.description}</p></div></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2"><article className="border-l-2 border-primary/30 bg-surface-container-low/50 p-6"><h3 className="flex items-center gap-2 font-bold"><Icon className="text-primary">psychology</Icon> Retos técnicos</h3><p className="mt-3 text-sm text-on-surface-variant">{project.challenges || 'Diseñar una solución clara, segura y fácil de mantener, integrando diferentes fuentes de datos y procesos.'}</p></article><article className="border-l-2 border-primary/30 bg-surface-container-low/50 p-6"><h3 className="flex items-center gap-2 font-bold"><Icon className="text-primary">verified</Icon> Resultado</h3><p className="mt-3 text-sm text-on-surface-variant">{project.results || 'Centralización de información, reducción de tareas manuales y mejor seguimiento del proceso.'}</p></article></div></section>
        </div>
        <aside className="lg:col-span-4"><div className="inner-stroke-primary tonal-layer-2 sticky top-28 rounded-xl p-8"><h2 className="font-headline text-headline-md">Detalles del proyecto</h2><dl className="mt-8 space-y-6"><div><dt className="font-label text-xs uppercase tracking-wider text-on-surface-variant">Rol</dt><dd className="mt-1 font-bold">Desarrollo e implementación</dd></div><div><dt className="font-label text-xs uppercase tracking-wider text-on-surface-variant">Tipo de proyecto</dt><dd className="mt-1 font-bold">Solución de software</dd></div><div><dt className="font-label text-xs uppercase tracking-wider text-on-surface-variant">Estado</dt><dd className="mt-2 flex items-center gap-2 font-bold"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Publicado</dd></div></dl><div className="mt-9 flex flex-col gap-4">{project.demoUrl && <a className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-3 font-bold text-on-primary-container" href={project.demoUrl} target="_blank" rel="noreferrer"><Icon>launch</Icon> Ver demo</a>}{project.repoUrl && <a className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 py-3 font-bold text-primary hover:bg-primary/10" href={project.repoUrl} target="_blank" rel="noreferrer"><Icon>code</Icon> Repositorio GitHub</a>}</div></div></aside>
      </section>
      {others.length > 0 && <section className="mx-auto mt-section-gap max-w-[1280px] px-4 md:px-container-margin"><div className="mb-10 flex items-end justify-between"><div><h2 className="font-headline text-headline-lg">Explorar más trabajos</h2><p className="mt-2 text-on-surface-variant">Otros proyectos publicados</p></div><Link className="hidden items-center gap-2 font-bold text-primary sm:flex" to="/projects">Ver todos <Icon>arrow_forward</Icon></Link></div><div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{others.map((item) => <ProjectCard compact project={item} key={item.id} />)}</div></section>}
    </div>
  );
}
