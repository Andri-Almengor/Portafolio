import { useCallback, useState } from 'react';
import { apiFetch } from '../api/client.js';
import { Icon } from '../components/Icon.jsx';
import { Toast } from '../components/Toast.jsx';
import { TurnstileWidget } from '../components/TurnstileWidget.jsx';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  channel: 'email'
};

export function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [notice, setNotice] = useState({ message: '', tone: 'success' });
  const [sending, setSending] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const handleToken = useCallback((token) => setTurnstileToken(token), []);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!accepted) {
      setNotice({
        message: 'Debes aceptar el tratamiento de datos para enviar el mensaje.',
        tone: 'error'
      });
      return;
    }

    setSending(true);
    setNotice({ message: '', tone: 'success' });

    try {
      const data = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ ...form, turnstileToken })
      });
      setForm(initialForm);
      setAccepted(false);
      setNotice({
        message: data.message || 'Tu mensaje fue enviado correctamente.',
        tone: 'success'
      });
      if (data.whatsappUrl) window.location.assign(data.whatsappUrl);
    } catch (error) {
      setNotice({ message: error.message, tone: 'error' });
    } finally {
      setTurnstileToken('');
      setTurnstileReset((current) => current + 1);
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08080A] pb-section-gap pt-32">
      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-4 md:px-container-margin lg:grid-cols-12 lg:gap-16">
        <section className="flex flex-col gap-10 lg:col-span-5">
          <div>
            <h1 className="font-headline text-headline-xl-mobile md:text-headline-xl">Hablemos</h1>
            <p className="mt-6 max-w-md text-body-lg text-on-surface-variant">
              ¿Tienes una idea, una oportunidad profesional o un proceso que necesita ser automatizado? Conversemos.
            </p>
          </div>

          <div className="space-y-5">
            {[
              ['mail', 'Correo', 'andrickalmengor@gmail.com', 'mailto:andrickalmengor@gmail.com'],
              ['call', 'Teléfono', '+506 7139-0044', 'tel:+50671390044'],
              ['location_on', 'Ubicación', 'San José, Costa Rica', '']
            ].map(([icon, label, value, href]) => (
              <article className="tonal-layer-2 flex items-start gap-4 rounded-xl border border-outline-variant/10 p-4" key={label}>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon>{icon}</Icon>
                </div>
                <div className="min-w-0">
                  <p className="font-label text-xs uppercase tracking-widest text-primary">{label}</p>
                  {href ? (
                    <a className="mt-1 block break-all font-headline text-lg font-semibold hover:text-primary md:text-xl" href={href}>
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 font-headline text-lg font-semibold md:text-xl">{value}</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <a
                className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-primary"
                href="https://github.com/Andri-Almengor"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Icon>code</Icon>
              </a>
              <a
                className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:border-primary/40 hover:text-primary"
                href="https://www.linkedin.com/in/andrick-almengor-5aa69b2b2"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Icon>link</Icon>
              </a>
            </div>
            <a
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 py-4 font-bold text-[#25D366] hover:bg-[#25D366]/20"
              href="https://wa.me/50671390044"
              target="_blank"
              rel="noreferrer"
            >
              <Icon>chat</Icon>
              Escribir por WhatsApp
            </a>
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="inner-stroke-primary tonal-layer-2 relative overflow-hidden rounded-[24px] border border-outline-variant/10 p-6 shadow-glow md:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
            <form className="relative z-10 space-y-6" onSubmit={submit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="font-label text-label-sm text-on-surface-variant">Nombre completo</span>
                  <input
                    className="form-control h-14 px-4"
                    name="name"
                    value={form.name}
                    onChange={update}
                    required
                    minLength="2"
                    maxLength="100"
                    placeholder="Ej. Juan Pérez"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label text-label-sm text-on-surface-variant">Correo electrónico</span>
                  <input
                    className="form-control h-14 px-4"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={update}
                    required
                    maxLength="254"
                    placeholder="juan@empresa.com"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="font-label text-label-sm text-on-surface-variant">Teléfono (opcional)</span>
                  <input
                    className="form-control h-14 px-4"
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    maxLength="30"
                    placeholder="+506 0000-0000"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label text-label-sm text-on-surface-variant">Asunto</span>
                  <input
                    className="form-control h-14 px-4"
                    name="subject"
                    value={form.subject}
                    onChange={update}
                    required
                    minLength="3"
                    maxLength="150"
                    placeholder="Nuevo proyecto"
                  />
                </label>
              </div>

              <fieldset>
                <legend className="mb-2 font-label text-label-sm text-on-surface-variant">Canal preferido</legend>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['email', 'mail', 'Correo'],
                    ['whatsapp', 'chat', 'WhatsApp']
                  ].map(([value, icon, label]) => (
                    <label
                      className={`relative flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-xl border p-4 transition-all ${
                        form.channel === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-outline-variant/20 text-on-surface hover:bg-surface-variant/20'
                      }`}
                      key={value}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="channel"
                        value={value}
                        checked={form.channel === value}
                        onChange={update}
                      />
                      <Icon>{icon}</Icon>
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="space-y-2">
                <span className="font-label text-label-sm text-on-surface-variant">Mensaje</span>
                <textarea
                  className="form-control min-h-40 resize-y p-4"
                  name="message"
                  value={form.message}
                  onChange={update}
                  required
                  minLength="10"
                  maxLength="3000"
                  placeholder="Cuéntame sobre tu proyecto o consulta..."
                />
              </label>

              <TurnstileWidget onToken={handleToken} resetSignal={turnstileReset} />

              <label className="flex items-start gap-3 text-sm text-on-surface-variant">
                <input
                  className="mt-0.5 h-5 w-5 rounded border-outline-variant/40 bg-surface-container-lowest text-primary-container focus:ring-primary/20"
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                />
                <span>Acepto que mis datos sean utilizados únicamente para responder esta solicitud de contacto.</span>
              </label>

              <button
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-lg font-bold text-on-primary shadow-lg shadow-primary/10 transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={sending}
                type="submit"
              >
                {sending ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Icon>send</Icon>
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Toast
        message={notice.message}
        tone={notice.tone}
        onClose={() => setNotice({ message: '', tone: 'success' })}
      />
    </div>
  );
}
