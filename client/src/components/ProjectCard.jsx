import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';

function ProjectVisual({ project }) {
  if (project.imageUrl) {
    return (
      <img
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={project.imageUrl}
        alt={`Vista previa de ${project.title}`}
        loading="lazy"
      />
    );
  }

  return (
    <div className="page-grid hero-radial flex h-full w-full items-center justify-center bg-surface-container-lowest">
      <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-glow">
        <Icon className="text-4xl">terminal</Icon>
      </div>
    </div>
  );
}

export function ProjectCard({ project, compact = false }) {
  const category = project.category || 'Desarrollo de software';
  return (
    <article className="group interactive-card flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low">
      <div className={`${compact ? 'h-44' : 'aspect-video'} relative overflow-hidden`}>
        <ProjectVisual project={project} />
        <span className="absolute left-4 top-4 rounded-full border border-primary/20 bg-[#08080A]/70 px-3 py-1 font-label text-[11px] uppercase tracking-wider text-primary backdrop-blur-md">
          {category}
        </span>
        {project.featured && (
          <span className="absolute right-0 top-0 rounded-bl-xl bg-primary px-4 py-1 font-label text-[11px] font-bold uppercase text-on-primary">
            Destacado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-headline text-headline-md text-on-surface">
          <Link className="hover:text-primary" to={`/projects/${project.slug}`}>{project.title}</Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-on-surface-variant">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(project.technologies || []).slice(0, 5).map((technology) => (
            <span className="skill-chip rounded-lg px-3 py-1 font-label text-xs" key={technology}>{technology}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-outline-variant/10 pt-6">
          {project.repoUrl ? (
            <a className="flex items-center gap-2 font-label text-xs uppercase text-on-surface-variant hover:text-primary" href={project.repoUrl} target="_blank" rel="noreferrer">
              <Icon className="text-lg">code</Icon> GitHub
            </a>
          ) : <span />}
          <Link className="flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2 font-label text-xs font-bold text-on-primary-container" to={`/projects/${project.slug}`}>
            Ver detalle <Icon className="text-lg">arrow_forward</Icon>
          </Link>
        </div>
      </div>
    </article>
  );
}
