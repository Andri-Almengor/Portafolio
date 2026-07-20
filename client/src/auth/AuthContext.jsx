import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, logoutRequest, refreshSession } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    refreshSession()
      .then((data) => {
        if (active) setAdmin(data.admin);
      })
      .catch(() => {
        if (active) setAdmin(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({
    admin,
    loading,
    async login(email, password) {
      const data = await loginRequest({ email, password });
      setAdmin(data.admin);
      return data.admin;
    },
    async logout() {
      await logoutRequest();
      setAdmin(null);
    }
  }), [admin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
}
