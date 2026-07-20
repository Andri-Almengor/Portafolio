import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client.js';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/public/projects/${encodeURIComponent(slug)}`)
      .then((data) => setProject(data.project))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <p role="alert">{error}</p>;
  if (!project) return <p>Cargando proyecto...</p>;

  return (
    <article>
      <p><Link to="/projects">Volver a proyectos</Link></p>
      <h1>{project.title}</h1>
      {project.imageUrl && <img src={project.imageUrl} alt={`Imagen de ${project.title}`} width="640" />}
      <p>{project.summary}</p>
      <p>{project.description}</p>
      <h2>Tecnologías</h2>
      <ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
      {project.demoUrl && <p><a href={project.demoUrl} target="_blank" rel="noreferrer">Ver proyecto desplegado</a></p>}
      {project.repoUrl && <p><a href={project.repoUrl} target="_blank" rel="noreferrer">Ver repositorio</a></p>}
    </article>
  );
}
