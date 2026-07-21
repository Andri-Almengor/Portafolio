import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { Icon } from '../components/Icon.jsx';

export function LoginPage() {
  const { admin, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (admin) return <Navigate to="/admin" replace />;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <main className="flex min-h-screen overflow-hidden bg-[#08080A]">
      <section className="security-pattern page-grid relative hidden w-1/2 overflow-hidden border-r border-outline-variant/10 bg-surface-container-lowest md:flex">
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12">
          <div><div className="font-headline text-headline-lg font-black text-primary">AA</div><div className="mt-2 h-1 w-12 rounded-full bg-primary" /></div>
          <div className="max-w-xl"><span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-label text-label-sm text-primary"><Icon className="text-lg">verified_user</Icon> SISTEMA SEGURO</span><h1 className="font-headline text-headline-xl-mobile lg:text-headline-xl">Acceso exclusivo para administradores autorizados</h1><p className="mt-6 text-body-lg leading-relaxed text-on-surface-variant">Autentícate para administrar el contenido, proyectos, imágenes y mensajes del portafolio.</p></div>
          <div className="flex flex-wrap items-center gap-6"><div><span className="block font-label text-xs text-on-surface-variant">ESTADO DEL SERVIDOR</span><span className="mt-1 flex items-center gap-2 font-code text-sm text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> OPERACIONAL</span></div><div className="h-8 w-px bg-outline-variant/20" /><div><span className="block font-label text-xs text-on-surface-variant">SESIÓN</span><span className="mt-1 font-code text-sm text-primary">HTTPONLY + ROTACIÓN</span></div></div>
        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center bg-surface p-5 md:w-1/2 md:p-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center md:hidden"><div className="font-headline text-headline-lg font-black text-primary">AA</div><div className="mx-auto mt-1 h-1 w-8 rounded-full bg-primary" /></div>
          <div className="mb-8"><h2 className="font-headline text-headline-md">Panel de control</h2><p className="mt-2 text-on-surface-variant">Introduce tus credenciales para continuar.</p></div>
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-glow md:p-8">
            <form className="space-y-6" onSubmit={submit}>
              <label className="block"><span className="mb-2 block font-label text-xs uppercase tracking-wider text-on-surface-variant">Correo electrónico</span><div className="relative"><Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">alternate_email</Icon><input className="form-control py-3 pl-12 pr-4" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" placeholder="admin@correo.com" /></div></label>
              <label className="block"><span className="mb-2 block font-label text-xs uppercase tracking-wider text-on-surface-variant">Contraseña</span><div className="relative"><Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</Icon><input className="form-control py-3 pl-12 pr-12" type={visible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength="8" maxLength="128" autoComplete="current-password" placeholder="••••••••••••" /><button className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-on-surface-variant hover:text-primary" type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}><Icon>{visible ? 'visibility_off' : 'visibility'}</Icon></button></div></label>
              {error && <p className="rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error" role="alert">{error}</p>}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-4 font-bold text-on-primary-container transition-transform active:scale-[0.98] disabled:opacity-60" type="submit" disabled={loading}>{loading ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-on-primary-container/30 border-t-on-primary-container" /> Ingresando...</> : <><Icon>login</Icon> Iniciar sesión</>}</button>
            </form>
          </div>
          <div className="mt-8 flex justify-center"><Link className="flex items-center gap-2 font-label text-label-sm text-on-surface-variant hover:text-primary" to="/"><Icon className="text-lg">arrow_back</Icon> Volver al portafolio</Link></div>
        </div>
      </section>
    </main>
  );
}
