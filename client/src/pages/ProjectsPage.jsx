import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client.js';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/public/projects')
      .then((data) => setProjects(data.projects))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h1>Proyectos</h1>
      {error && <p role="alert">{error}</p>}
      {!error && !projects.length && <p>No hay proyectos publicados todavía.</p>}
      {projects.map((project) => (
        <article key={project.id}>
          {project.imageUrl && <img src={project.imageUrl} alt={`Vista previa de ${project.title}`} width="320" />}
          <h2><Link to={`/projects/${project.slug}`}>{project.title}</Link></h2>
          <p>{project.summary}</p>
          <p>{project.technologies.join(', ')}</p>
        </article>
      ))}
    </section>
  );
}
