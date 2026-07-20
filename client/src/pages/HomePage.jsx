import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client.js';
import { SectionRenderer } from '../components/SectionRenderer.jsx';

export function HomePage() {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/public/site')
      .then((data) => setSections(data.sections))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!sections.length) return <p>Cargando información...</p>;
  return sections.map((section) => <SectionRenderer key={section.id} section={section} />);
}
