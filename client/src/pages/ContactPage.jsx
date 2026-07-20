import { useCallback, useState } from 'react';
import { apiFetch } from '../api/client.js';
import { TurnstileWidget } from '../components/TurnstileWidget.jsx';

const initialForm = {
  name: '', email: '', phone: '', subject: '', message: '', channel: 'email', company: ''
};

export function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const handleToken = useCallback((token) => setTurnstileToken(token), []);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setStatus('');
    try {
      const data = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ ...form, turnstileToken })
      });
      setStatus(data.message);
      setForm(initialForm);
      if (data.whatsappUrl) window.location.assign(data.whatsappUrl);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section>
      <h1>Contacto</h1>
      <form onSubmit={submit}>
        <p><label>Nombre<br /><input name="name" value={form.name} onChange={update} required minLength="2" maxLength="100" /></label></p>
        <p><label>Correo<br /><input type="email" name="email" value={form.email} onChange={update} required /></label></p>
        <p><label>Teléfono<br /><input name="phone" value={form.phone} onChange={update} maxLength="30" /></label></p>
        <p><label>Asunto<br /><input name="subject" value={form.subject} onChange={update} required minLength="3" maxLength="150" /></label></p>
        <p><label>Mensaje<br /><textarea name="message" value={form.message} onChange={update} required minLength="10" maxLength="3000" rows="8" /></label></p>
        <p><label>Canal<br /><select name="channel" value={form.channel} onChange={update}><option value="email">Correo</option><option value="whatsapp">WhatsApp</option></select></label></p>
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}>
          <label>Empresa<input name="company" value={form.company} onChange={update} tabIndex="-1" autoComplete="off" /></label>
        </div>
        <TurnstileWidget onToken={handleToken} />
        <button disabled={sending} type="submit">{sending ? 'Enviando...' : 'Enviar'}</button>
      </form>
      {status && <p role="status">{status}</p>}
    </section>
  );
}
