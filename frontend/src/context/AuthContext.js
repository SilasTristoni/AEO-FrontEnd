import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null, isAuthenticated: false });
  const [loading, setLoading] = useState(true);

  const login = useCallback((token) => {
    try {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decoded = jwtDecode(token);
      setAuth({
        token: token,
        user: { id: decoded.id, name: decoded.name },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
      logout();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setAuth({ token: null, user: null, isAuthenticated: false });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      login(token);
    }
    setLoading(false);
  }, [login]);

  if (loading) {
    return <div>Carregando Aplicação...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};