import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { EmptyState } from '../components/EmptyState.jsx';
import { Icon } from '../components/Icon.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [technology, setTechnology] = useState('');
  const [sort, setSort] = useState('featured');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch('/api/public/projects')
      .then((data) => { if (active) setProjects(data.projects || []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const technologies = useMemo(() => [...new Set(projects.flatMap((project) => project.technologies || []))].sort((a, b) => a.localeCompare(b)), [projects]);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = projects.filter((project) => {
      const searchText = [project.title, project.summary, ...(project.technologies || [])].join(' ').toLowerCase();
      return (!normalizedQuery || searchText.includes(normalizedQuery)) && (!technology || (project.technologies || []).includes(technology));
    });
    return result.sort((a, b) => {
      if (sort === 'oldest') return String(a.createdAt).localeCompare(String(b.createdAt));
      if (sort === 'recent') return String(b.createdAt).localeCompare(String(a.createdAt));
      return Number(b.featured) - Number(a.featured) || String(b.createdAt).localeCompare(String(a.createdAt));
    });
  }, [projects, query, technology, sort]);

  if (loading) return <LoadingState label="Cargando proyectos..." />;

  return (
    <div className="min-h-screen bg-[#08080A] pb-section-gap pt-32">
      <main className="mx-auto max-w-[1280px] px-4 md:px-container-margin">
        <nav className="mb-4 flex items-center gap-2 font-label text-label-sm text-on-surface-variant" aria-label="Migas de pan"><Link className="hover:text-primary" to="/">Inicio</Link><Icon className="text-sm">chevron_right</Icon><span className="font-bold text-primary">Proyectos</span></nav>
        <section className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><h1 className="font-headline text-headline-xl-mobile md:text-headline-xl">Proyectos</h1><p className="mt-2 max-w-2xl text-body-lg text-on-surface-variant">Una colección de soluciones de desarrollo, automatización e integración de sistemas.</p></div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high px-4 py-2"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" /><span className="font-label text-xs uppercase tracking-widest text-primary">{projects.length} proyectos publicados</span></div>
        </section>
        <section className="mb-14 rounded-xl border border-outline-variant/10 bg-surface-container-low p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <label className="relative flex-1"><span className="sr-only">Buscar proyecto</span><Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</Icon><input className="form-control h-12 pl-12 pr-4" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar proyecto o tecnología..." /></label>
            <select className="form-control h-12 px-4 lg:w-52" value={technology} onChange={(event) => setTechnology(event.target.value)} aria-label="Filtrar por tecnología"><option value="">Todas las tecnologías</option>{technologies.map((item) => <option value={item} key={item}>{item}</option>)}</select>
            <select className="form-control h-12 px-4 lg:w-48" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar proyectos"><option value="featured">Destacados</option><option value="recent">Más recientes</option><option value="oldest">Más antiguos</option></select>
            {(query || technology) && <button className="h-12 rounded-lg border border-outline-variant/20 px-4 text-on-surface-variant hover:border-primary/40 hover:text-primary" type="button" onClick={() => { setQuery(''); setTechnology(''); }}>Limpiar</button>}
          </div>
        </section>
        {error && <p className="mb-8 rounded-xl border border-error/20 bg-error/5 p-4 text-error" role="alert">{error}</p>}
        {!error && filtered.length > 0 && <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((project) => <ProjectCard project={project} key={project.id} />)}</div>}
        {!error && filtered.length === 0 && <EmptyState icon="search_off" title="No se encontraron proyectos" description="Prueba con otra búsqueda o limpia los filtros seleccionados." action={<button className="rounded-lg bg-primary-container px-5 py-2.5 font-semibold text-on-primary-container" type="button" onClick={() => { setQuery(''); setTechnology(''); }}>Limpiar filtros</button>} />}
      </main>
    </div>
  );
}
