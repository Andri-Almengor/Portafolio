function Hero({ content }) {
  return (
    <>
      <h1>{content.name}</h1>
      <p>{content.headline}</p>
      <p>{content.location}</p>
      <p>
        {content.email && <a href={`mailto:${content.email}`}>{content.email}</a>}
        {content.phone && <> | <a href={`tel:${content.phone.replace(/\s/g, '')}`}>{content.phone}</a></>}
        {content.linkedin && <> | <a href={content.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></>}
      </p>
    </>
  );
}

function Experience({ content }) {
  return (content.items || []).map((item) => (
    <article key={`${item.company}-${item.period}`}>
      <h3>{item.role} | {item.company}</h3>
      <p>{item.period}</p>
      <ul>{(item.achievements || []).map((value) => <li key={value}>{value}</li>)}</ul>
    </article>
  ));
}

function Education({ content }) {
  return <ul>{(content.items || []).map((item) => (
    <li key={`${item.title}-${item.institution}`}>
      <strong>{item.title}</strong> — {item.institution} ({item.status})
    </li>
  ))}</ul>;
}

function Skills({ content }) {
  return (content.groups || []).map((group) => (
    <div key={group.name}>
      <h3>{group.name}</h3>
      <ul>{(group.items || []).map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  ));
}

function Generic({ content }) {
  if (Array.isArray(content.items)) {
    return <ul>{content.items.map((item, index) => (
      <li key={typeof item === 'string' ? item : index}>
        {typeof item === 'string' ? item : Object.values(item).join(' — ')}
      </li>
    ))}</ul>;
  }
  if (Array.isArray(content.paragraphs)) {
    return content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
  }
  return <pre>{JSON.stringify(content, null, 2)}</pre>;
}

export function SectionRenderer({ section }) {
  return (
    <section id={section.key}>
      {section.key !== 'hero' && <h2>{section.title}</h2>}
      {section.key === 'hero' && <Hero content={section.content} />}
      {section.key === 'experience' && <Experience content={section.content} />}
      {section.key === 'education' && <Education content={section.content} />}
      {section.key === 'skills' && <Skills content={section.content} />}
      {!['hero', 'experience', 'education', 'skills'].includes(section.key)
        && <Generic content={section.content} />}
    </section>
  );
}
