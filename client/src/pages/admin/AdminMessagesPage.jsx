import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../api/client.js';
import { EmptyState } from '../../components/EmptyState.jsx';
import { Icon } from '../../components/Icon.jsx';
import { LoadingState } from '../../components/LoadingState.jsx';
import { Toast } from '../../components/Toast.jsx';

const statuses = {
  new: { label: 'Nuevo', className: 'border-primary/20 bg-primary/10 text-primary' },
  read: { label: 'Leído', className: 'border-outline-variant/20 bg-surface-variant/30 text-on-surface-variant' },
  replied: { label: 'Respondido', className: 'border-tertiary/20 bg-tertiary/10 text-tertiary' },
  archived: { label: 'Archivado', className: 'border-outline-variant/20 bg-surface-container-high text-on-surface-variant' }
};

export function AdminMessagesPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState({ message: '', tone: 'success' });
  const [loading, setLoading] = useState(true);

  async function load(preferredId) { const data = await apiFetch('/api/admin/contacts'); const rows = data.contacts || []; setContacts(rows); setSelectedId((current) => preferredId || current || rows[0]?.id || ''); }
  useEffect(() => { let active = true; load().catch((error) => { if (active) setNotice({ message: error.message, tone: 'error' }); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return contacts.filter((contact) => {
      const matchesText = !text || [contact.name, contact.email, contact.subject, contact.message].join(' ').toLowerCase().includes(text);
      return matchesText && (filter === 'all' || contact.status === filter);
    });
  }, [contacts, query, filter]);

  const selected = contacts.find((contact) => contact.id === selectedId) || filtered[0] || null;
  async function changeStatus(status) { if (!selected) return; try { const data = await apiFetch(`/api/admin/contacts/${selected.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); setContacts((current) => current.map((contact) => contact.id === selected.id ? data.contact : contact)); setNotice({ message: 'Estado actualizado.', tone: 'success' }); } catch (error) { setNotice({ message: error.message, tone: 'error' }); } }

  if (loading) return <LoadingState label="Cargando mensajes..." />;
  if (!contacts.length) return <div className="p-4 md:p-8"><EmptyState icon="mail" title="No hay mensajes" description="Los mensajes del formulario de contacto aparecerán aquí." /></div>;

  return <div className="flex h-[calc(100vh-64px)] overflow-hidden">
    <aside className={`${selected ? 'hidden lg:flex' : 'flex'} w-full flex-col border-r border-outline-variant/10 bg-surface lg:w-[390px] lg:flex`}>
      <header className="border-b border-outline-variant/10 p-5"><h1 className="font-headline text-headline-md">Mensajes</h1><p className="mt-1 text-sm text-on-surface-variant">{contacts.filter((contact) => contact.status === 'new').length} consultas nuevas</p><div className="relative mt-4"><Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</Icon><input className="form-control h-11 pl-10 pr-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar mensajes..." /></div><div className="custom-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">{['all', 'new', 'read', 'replied', 'archived'].map((status) => <button className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs ${filter === status ? 'border-primary/30 bg-primary/10 text-primary' : 'border-outline-variant/20 text-on-surface-variant'}`} type="button" onClick={() => setFilter(status)} key={status}>{status === 'all' ? 'Todos' : statuses[status].label}</button>)}</div></header>
      <div className="custom-scrollbar flex-1 overflow-y-auto">{filtered.map((contact) => <button className={`w-full border-b border-outline-variant/10 p-4 text-left transition-colors hover:bg-surface-variant/10 ${selected?.id === contact.id ? 'border-l-2 border-l-primary bg-primary/5' : ''}`} type="button" onClick={() => setSelectedId(contact.id)} key={contact.id}><div className="flex justify-between gap-3"><span className="truncate font-label text-sm font-bold">{contact.name}</span><span className="flex-shrink-0 text-[11px] text-on-surface-variant">{new Date(contact.createdAt).toLocaleDateString('es-CR')}</span></div><div className="mt-2 flex items-center gap-2"><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statuses[contact.status]?.className || statuses.new.className}`}>{statuses[contact.status]?.label || 'Nuevo'}</span><span className="truncate text-sm text-on-surface-variant">{contact.subject}</span></div></button>)}{!filtered.length && <p className="p-6 text-center text-on-surface-variant">No hay resultados con estos filtros.</p>}</div>
    </aside>
    <section className={`${selected ? 'flex' : 'hidden lg:flex'} custom-scrollbar flex-1 flex-col overflow-y-auto bg-surface-container-lowest`}>
      {selected && <><header className="sticky top-0 z-10 flex flex-col justify-between gap-4 border-b border-outline-variant/10 bg-surface p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-container-high lg:hidden" type="button" onClick={() => setSelectedId('')} aria-label="Volver a la lista"><Icon>arrow_back</Icon></button><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 font-bold text-primary shadow-glow">{selected.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div><h2 className="font-headline text-xl font-semibold">{selected.name}</h2><p className="mt-1 text-xs text-on-surface-variant">{new Date(selected.createdAt).toLocaleString('es-CR')}</p></div></div><select className="form-control w-full px-3 py-2 text-sm sm:w-auto" value={selected.status} onChange={(event) => changeStatus(event.target.value)}><option value="new">Nuevo</option><option value="read">Leído</option><option value="replied">Respondido</option><option value="archived">Archivado</option></select></header><div className="mx-auto w-full max-w-4xl space-y-8 p-5 md:p-8"><div className="grid grid-cols-1 gap-4 md:grid-cols-3">{[['mail', 'Correo', selected.email], ['call', 'Teléfono', selected.phone || 'No indicado'], ['forum', 'Canal', selected.channel === 'whatsapp' ? 'WhatsApp' : 'Correo']].map(([icon, label, value]) => <article className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-5" key={label}><div className="mb-4 flex items-center gap-2 text-on-surface-variant"><Icon className="text-lg">{icon}</Icon><span className="font-label text-[10px] font-bold uppercase tracking-widest">{label}</span></div><p className="break-words text-sm font-semibold">{value}</p></article>)}</div><article className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-6 md:p-8"><p className="font-label text-xs uppercase tracking-wider text-primary">Asunto</p><h2 className="mt-2 font-headline text-headline-md">{selected.subject}</h2><div className="my-6 h-px bg-outline-variant/10" /><p className="whitespace-pre-line leading-relaxed text-on-surface-variant">{selected.message}</p></article><div className="flex flex-col gap-3 sm:flex-row"><a className="flex items-center justify-center gap-2 rounded-xl bg-primary-container px-5 py-3 font-bold text-on-primary-container" href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} onClick={() => changeStatus('replied')}><Icon>reply</Icon> Responder por correo</a>{selected.phone && <a className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 px-5 py-3 font-bold text-[#25D366]" href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><Icon>chat</Icon> Abrir WhatsApp</a>}<button className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant/20 px-5 py-3 text-on-surface-variant hover:text-primary" type="button" onClick={() => navigator.clipboard?.writeText(selected.email).then(() => setNotice({ message: 'Correo copiado.', tone: 'success' }))}><Icon>content_copy</Icon> Copiar correo</button></div></div></>}
    </section>
    <Toast message={notice.message} tone={notice.tone} onClose={() => setNotice({ message: '', tone: 'success' })} />
  </div>;
}
