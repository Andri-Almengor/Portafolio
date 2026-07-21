import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { Icon } from './Icon.jsx';

const items = [
  { to: '/admin', end: true, label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/sections', label: 'Portafolio', icon: 'folder_special' },
  { to: '/admin/projects', label: 'Proyectos', icon: 'account_tree' },
  { to: '/admin/messages', label: 'Mensajes', icon: 'mail' },
  { to: '/admin/settings', label: 'Configuración', icon: 'settings' }
];

function SidebarLink({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 font-label text-label-sm transition-all ${
        isActive ? 'border-l-2 border-primary bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface'
      }`}
    >
      <Icon filled={item.icon === 'dashboard'}>{item.icon}</Icon>
      {item.label}
    </NavLink>
  );
}

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  async function signOut() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-outline-variant/10 bg-surface-container-low p-4">
      <div className="mb-9 px-2">
        <div className="font-headline text-headline-md font-black text-primary">AA</div>
        <div className="mt-1 font-label text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Panel administrativo</div>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item) => <SidebarLink item={item} key={item.to} onNavigate={() => setDrawerOpen(false)} />)}
        <a className="flex items-center gap-3 rounded-lg px-4 py-3 font-label text-label-sm text-on-surface-variant transition-colors hover:bg-surface-variant/20 hover:text-primary" href="/" target="_blank" rel="noreferrer"><Icon>open_in_new</Icon>Ver portafolio</a>
      </nav>
      <div className="border-t border-outline-variant/10 pt-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-bold text-primary">{(admin?.name || 'AA').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
          <div className="min-w-0"><p className="truncate text-sm font-bold text-on-surface">{admin?.name}</p><p className="truncate text-[10px] text-on-surface-variant">{admin?.email}</p></div>
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-label text-label-sm text-on-surface-variant transition-colors hover:bg-error/5 hover:text-error" onClick={signOut} type="button"><Icon>logout</Icon>Cerrar sesión</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#08080A] text-on-surface">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-[#08080A]/80 backdrop-blur-sm" aria-label="Cerrar menú" onClick={() => setDrawerOpen(false)} type="button" />
          <div className="relative h-full w-64">{sidebar}</div>
        </div>
      )}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/10 bg-surface/90 px-4 backdrop-blur-md lg:left-64 lg:px-6">
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-container-high lg:hidden" type="button" aria-label="Abrir menú" onClick={() => setDrawerOpen(true)}><Icon>menu</Icon></button>
          <div><p className="font-headline text-lg font-bold">Panel de control</p><p className="hidden text-xs text-on-surface-variant sm:block">Administración del portafolio</p></div>
        </div>
        <div className="flex items-center gap-2"><button className="relative rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" type="button" aria-label="Notificaciones"><Icon>notifications</Icon></button><div className="ml-2 hidden h-6 w-px bg-outline-variant/20 sm:block" /><span className="hidden font-label text-label-sm text-on-surface-variant sm:block">{admin?.name}</span></div>
      </header>
      <main className="min-h-screen pt-16 lg:ml-64"><Outlet /></main>
    </div>
  );
}
