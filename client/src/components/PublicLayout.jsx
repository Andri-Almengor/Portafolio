import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon } from './Icon.jsx';

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Sobre mí', to: '/#about' },
  { label: 'Experiencia', to: '/#experience' },
  { label: 'Habilidades', to: '/#skills' },
  { label: 'Proyectos', to: '/projects' },
  { label: 'Contacto', to: '/contact' }
];

function PublicNavLink({ item, onClick }) {
  const location = useLocation();
  const isRouteActive = item.to === '/'
    ? location.pathname === '/'
    : item.to === '/projects'
      ? location.pathname.startsWith('/projects')
      : item.to === '/contact'
        ? location.pathname === '/contact'
        : false;

  if (item.to.includes('#')) {
    return (
      <a href={item.to} onClick={onClick} className="font-label text-label-sm text-on-surface-variant transition-colors hover:text-primary">
        {item.label}
      </a>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={() => `font-label text-label-sm transition-colors ${
        isRouteActive ? 'border-b-2 border-primary pb-1 font-bold text-primary' : 'text-on-surface-variant hover:text-primary'
      }`}
    >
      {item.label}
    </NavLink>
  );
}

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const id = location.hash.slice(1);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-[#08080A] text-on-surface">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-outline-variant/10 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 md:px-container-margin">
          <Link to="/" className="font-headline text-headline-lg font-black text-primary" aria-label="Ir al inicio">AA</Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
            {navItems.map((item) => <PublicNavLink item={item} key={item.to} />)}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a className="rounded-lg border border-primary-container px-5 py-2.5 font-label text-label-sm font-semibold text-primary transition-colors hover:bg-primary/5" href="/contact">Solicitar CV</a>
            <Link className="rounded-lg bg-primary-container px-5 py-2.5 font-label text-label-sm font-bold text-on-primary-container transition-transform active:scale-95" to="/contact">Contactarme</Link>
          </div>
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg border border-outline-variant/20 bg-surface-container-low text-on-surface md:hidden" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>
            <Icon>{menuOpen ? 'close' : 'menu'}</Icon>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#08080A]/95 px-5 pb-8 pt-28 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-md flex-col gap-6" aria-label="Navegación móvil">
            {navItems.map((item) => <div className="border-b border-outline-variant/10 pb-4 text-xl" key={item.to}><PublicNavLink item={item} onClick={() => setMenuOpen(false)} /></div>)}
            <Link className="mt-2 flex h-12 items-center justify-center rounded-xl bg-primary-container font-bold text-on-primary-container" to="/contact">Contactarme</Link>
          </nav>
        </div>
      )}

      <main><Outlet /></main>

      <footer className="border-t border-outline-variant/10 bg-surface-container-low">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 py-14 md:grid-cols-3 md:px-container-margin">
          <div>
            <div className="font-headline text-headline-lg font-black text-primary">AA</div>
            <p className="mt-3 max-w-sm text-on-surface-variant">Desarrollo de software, automatización e integración de soluciones tecnológicas.</p>
          </div>
          <div>
            <h2 className="font-headline text-lg font-semibold">Navegación</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-on-surface-variant">
              <Link className="hover:text-primary" to="/">Inicio</Link>
              <Link className="hover:text-primary" to="/projects">Proyectos</Link>
              <Link className="hover:text-primary" to="/contact">Contacto</Link>
              <Link className="hover:text-primary" to="/admin/login">Acceso administrativo</Link>
            </div>
          </div>
          <div>
            <h2 className="font-headline text-lg font-semibold">Contacto</h2>
            <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
              <a className="flex items-center gap-2 hover:text-primary" href="mailto:andrickalmengor@gmail.com"><Icon className="text-lg">mail</Icon> andrickalmengor@gmail.com</a>
              <a className="flex items-center gap-2 hover:text-primary" href="https://wa.me/50671390044" target="_blank" rel="noreferrer"><Icon className="text-lg">chat</Icon> WhatsApp</a>
              <a className="flex items-center gap-2 hover:text-primary" href="https://www.linkedin.com/in/andrick-almengor-5aa69b2b2" target="_blank" rel="noreferrer"><Icon className="text-lg">link</Icon> LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="border-t border-outline-variant/10 px-4 py-5 text-center text-sm text-on-surface-variant">© 2026 Andrick Almengor. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
