import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Validando sesión...</p>;
  if (!admin) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
