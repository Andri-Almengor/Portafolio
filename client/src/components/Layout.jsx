import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export function Layout() {
  const { admin } = useAuth();
  return (
    <>
      <header>
        <nav aria-label="Navegación principal">
          <Link to="/">Inicio</Link>{' | '}
          <Link to="/projects">Proyectos</Link>{' | '}
          <Link to="/contact">Contacto</Link>{' | '}
          {admin ? <Link to="/admin">Administración</Link> : <Link to="/login">Ingresar</Link>}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Portafolio de Andrick Almengor</p>
      </footer>
    </>
  );
}
