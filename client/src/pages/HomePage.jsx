import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { Icon } from '../components/Icon.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { ScrollReveal } from '../components/ScrollReveal.jsx';
import { TypewriterText } from '../components/TypewriterText.jsx';

const FALLBACK = {
  hero: {
    name: 'Andrick Almengor Quiros',
    headline: 'Desarrollo software que automatiza procesos y mejora operaciones',
    location: 'San José, Costa Rica',
    email: 'andrickalmengor@gmail.com',
    phone: '+506 7139-0044',
    linkedin: 'https://www.linkedin.com/in/andrick-almengor-5aa69b2b2'
  },
  about: {
    paragraphs: [
      'Especialista en soporte técnico y mesa de servicio con experiencia en soporte L1 y L2 para usuarios corporativos.',
      'Experiencia en desarrollo de aplicaciones web y de escritorio, automatización de procesos, integración de APIs, Google Apps Script, AppSheet, React, React Native y Python.',
      'Conocimientos en hardware, software, redes, sistemas operativos, Active Directory, OnGuard y Milestone XProtect.'
    ]
  },
  experience: { items: [] },
  skills: { groups: [] },
  education: { items: [] },
  certifications: { items: [] }
};

const capabilityCards = [
  {
    icon: 'devices',
    title: 'Aplicaciones web y móviles',
    text: 'Interfaces funcionales y responsivas respaldadas por arquitecturas organizadas.'
  },
  {
    icon: 'precision_manufacturing',
    title: 'Automatización de procesos',
    text: 'Scripts, integraciones y flujos que reducen tareas manuales repetitivas.'
  },
  {
    icon: 'hub',
    title: 'Integración de sistemas',
    text: 'Conexión de APIs, Google Workspace, bases de datos y plataformas corporativas.'
  },
  {
    icon: 'support_agent',
    title: 'Soporte tecnológico',
    text: 'Diagnóstico y resolución de incidencias en entornos corporativos.'
  }
];

export function HomePage() {
  const [sections, setSections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([apiFetch('/api/public/site'), apiFetch('/api/public/projects')])
      .then(([siteData, projectData]) => {
        if (!active) return;
        setSections(siteData.sections || []);
        setProjects(projectData.projects || []);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const content = useMemo(() => {
    const map = Object.fromEntries(sections.map((section) => [section.key, section.content]));

    return {
      hero: map.hero || FALLBACK.hero,
      about: map.about || FALLBACK.about,
      experience: map.experience || FALLBACK.experience,
      skills: map.skills || FALLBACK.skills,
      education: map.education || FALLBACK.education,
      certifications: map.certifications || FALLBACK.certifications
    };
  }, [sections]);

  if (loading) return <LoadingState label="Cargando portafolio..." />;

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const visibleProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 3);

  return (
    <div className="page-grid">
      <section className="hero-radial mx-auto flex min-h-screen max-w-[1280px] flex-col items-center gap-12 px-4 pb-20 pt-32 md:px-container-margin lg:flex-row">
        <div className="hero-copy-enter flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="font-label text-label-sm uppercase tracking-wider text-primary">
              Disponible para nuevos proyectos
            </span>
          </div>

          <h1 className="min-h-[1.15em] font-headline text-headline-xl-mobile text-on-surface md:text-headline-xl">
            <TypewriterText text={content.hero.name} />
          </h1>

          <h2 className="max-w-2xl font-headline text-headline-md text-primary-fixed">
            {content.hero.headline}
          </h2>

          <p className="max-w-xl text-body-lg text-on-surface-variant">
            Desarrollo aplicaciones web, móviles y de escritorio, integraciones con APIs y soluciones de automatización para entornos corporativos.
          </p>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Link
              className="button-motion flex min-h-12 items-center justify-center rounded-lg bg-primary-container px-8 py-3 font-bold text-on-primary-container transition-shadow hover:shadow-glow"
              to="/projects"
            >
              Ver proyectos
            </Link>
            <Link
              className="button-motion flex min-h-12 items-center justify-center rounded-lg border-2 border-primary-container px-8 py-3 font-bold text-primary hover:bg-primary/5"
              to="/contact"
            >
              Contactarme
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-sm text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Icon className="text-lg text-primary">location_on</Icon>
              {content.hero.location}
            </span>
            <a className="flex items-center gap-2 hover:text-primary" href={`mailto:${content.hero.email}`}>
              <Icon className="text-lg">mail</Icon>
              {content.hero.email}
            </a>
          </div>
        </div>

        <div className="hero-visual-enter relative w-full max-w-md flex-1">
          <div className="hero-tech-card inner-stroke-primary purple-glow tonal-layer-2 flex aspect-square w-full flex-col justify-between rounded-xl border border-outline-variant/10 p-7 md:p-8">
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container font-headline text-2xl font-black text-white">
                AA
              </div>
              <div className="flex gap-2 text-primary">
                <Icon>terminal</Icon>
                <Icon>lan</Icon>
              </div>
            </div>

            <div>
              <p className="mb-4 font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                Core tech stack
              </p>
              <div className="flex flex-wrap gap-2">
                {['React', 'React Native', 'Node.js', 'Python', 'Google Apps Script', 'AppSheet'].map((item) => (
                  <span className="skill-chip rounded-lg px-3 py-1 font-label text-label-sm" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-high p-4">
              <div className="mb-2 flex justify-between text-xs text-on-surface-variant">
                <span>Enfoque profesional</span>
                <span>Desarrollo + automatización</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-variant">
                <div className="hero-progress h-full w-[88%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal
        as="section"
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 border-y border-outline-variant/10 px-4 py-12 sm:grid-cols-3 md:px-container-margin"
      >
        {[
          ['100+', 'equipos administrados'],
          ['98%', 'cumplimiento de SLA'],
          ['40%', 'reducción de tareas manuales']
        ].map(([value, label]) => (
          <div className="metric-item text-center" key={label}>
            <div className="font-headline text-headline-lg text-primary">{value}</div>
            <div className="mt-2 font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              {label}
            </div>
          </div>
        ))}
      </ScrollReveal>

      <section
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 px-4 py-section-gap md:px-container-margin lg:grid-cols-2"
        id="about"
      >
        <ScrollReveal className="space-y-7">
          <div className="h-1 w-14 rounded-full bg-primary" />
          <h2 className="font-headline text-headline-lg">Sobre mí</h2>
          <div className="space-y-4 text-body-lg text-on-surface-variant">
            {(content.about.paragraphs || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <a
            className="inline-flex items-center gap-2 font-bold text-primary transition-transform hover:translate-x-1"
            href="#experience"
          >
            Conocer mi experiencia
            <Icon>arrow_forward</Icon>
          </a>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {capabilityCards.map((card, index) => (
            <ScrollReveal
              as="article"
              className="interactive-card tonal-layer-2 rounded-xl border border-outline-variant/10 p-6"
              delay={index * 90}
              key={card.title}
            >
              <Icon className="mb-4 text-3xl text-primary-container">{card.icon}</Icon>
              <h3 className="font-headline text-headline-md">{card.title}</h3>
              <p className="mt-2 text-sm text-on-surface-variant">{card.text}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-section-gap md:px-container-margin" id="experience">
        <ScrollReveal>
          <h2 className="mb-12 text-center font-headline text-headline-lg">Experiencia profesional</h2>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl space-y-12">
          {(content.experience.items || []).map((item, index) => (
            <ScrollReveal
              as="article"
              className="timeline-line relative pl-10 md:pl-12"
              delay={Math.min(index * 120, 360)}
              distance="32px"
              key={`${item.company}-${item.period}`}
            >
              <span
                className={`absolute left-[-5px] top-0 h-3 w-3 rounded-full ${
                  index === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-outline-variant'
                }`}
              />
              <div className="interactive-card tonal-layer-2 rounded-xl border border-outline-variant/10 p-6 md:p-8">
                <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row">
                  <div>
                    <h3 className="font-headline text-headline-md">{item.company}</h3>
                    <p className="mt-1 font-semibold text-on-surface-variant">{item.role}</p>
                  </div>
                  <span className="font-label text-label-sm text-primary">{item.period}</span>
                </div>
                <ul className="space-y-3">
                  {(item.achievements || []).map((achievement) => (
                    <li className="flex gap-3 text-on-surface-variant" key={achievement}>
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-primary" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-section-gap md:px-container-margin" id="skills">
        <ScrollReveal>
          <h2 className="mb-12 font-headline text-headline-lg">Tecnologías y habilidades</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(content.skills.groups || []).map((group, index) => (
            <ScrollReveal
              as="article"
              className="interactive-card tonal-layer-2 rounded-xl border border-outline-variant/10 p-8"
              delay={Math.min(index * 90, 270)}
              key={group.name}
            >
              <div className="mb-5 flex items-center gap-3">
                <Icon className="text-primary">terminal</Icon>
                <h3 className="font-headline text-headline-md">{group.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(group.items || []).map((item) => (
                  <span className="skill-chip rounded-lg px-3 py-1 font-label text-label-sm" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-section-gap md:px-container-margin" id="projects">
        <ScrollReveal className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-headline text-headline-lg">Proyectos destacados</h2>
            <p className="mt-2 text-on-surface-variant">
              Soluciones construidas para necesidades operativas reales.
            </p>
          </div>
          <Link className="flex items-center gap-2 font-bold text-primary" to="/projects">
            Ver todos
            <Icon>arrow_forward</Icon>
          </Link>
        </ScrollReveal>

        {error && (
          <p className="rounded-xl border border-error/20 bg-error/5 p-4 text-error" role="alert">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ScrollReveal className="h-full" delay={index * 100} key={project.id}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>

        {!error && !visibleProjects.length && (
          <div className="rounded-xl border border-dashed border-outline-variant/30 p-8 text-center text-on-surface-variant">
            Los proyectos publicados aparecerán aquí.
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-section-gap md:px-container-margin lg:grid-cols-2">
        <ScrollReveal
          as="article"
          className="interactive-card tonal-layer-2 rounded-xl border border-outline-variant/10 p-8"
        >
          <h2 className="font-headline text-headline-md text-primary">Educación</h2>
          <div className="mt-7 space-y-6">
            {(content.education.items || []).map((item) => (
              <div className="border-l-2 border-primary/30 pl-5" key={item.title}>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-on-surface-variant">{item.institution}</p>
                <p className="mt-1 font-label text-xs uppercase text-primary">{item.status}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal
          as="article"
          className="interactive-card tonal-layer-2 rounded-xl border border-outline-variant/10 p-8"
          delay={120}
        >
          <h2 className="font-headline text-headline-md text-primary">Certificaciones y cursos</h2>
          <ul className="mt-7 space-y-4">
            {(content.certifications.items || []).map((item) => (
              <li className="flex gap-3 text-on-surface-variant" key={item}>
                <Icon className="text-primary">verified</Icon>
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-section-gap md:px-container-margin">
        <ScrollReveal className="hero-radial rounded-xl border border-primary/20 bg-surface-container-low p-8 text-center shadow-glow md:p-12">
          <h2 className="font-headline text-headline-lg">¿Tienes un proyecto o una oportunidad profesional?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-on-surface-variant">
            Conversemos sobre cómo puedo ayudarte a desarrollar, automatizar o mejorar una solución tecnológica.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="button-motion rounded-lg bg-primary-container px-7 py-3 font-bold text-on-primary-container"
              to="/contact"
            >
              Enviar un mensaje
            </Link>
            <a
              className="button-motion rounded-lg border border-primary-container px-7 py-3 font-bold text-primary"
              href="https://wa.me/50671390044"
              target="_blank"
              rel="noreferrer"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
