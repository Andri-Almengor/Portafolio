import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export function LoginPage() {
  const { admin, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>Administración</h1>
      <form onSubmit={submit}>
        <p><label>Correo<br /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label></p>
        <p><label>Contraseña<br /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label></p>
        <button disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
