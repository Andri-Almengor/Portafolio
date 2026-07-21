import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { LoadingState } from './LoadingState.jsx';

export function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Validando sesión..." />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
}
