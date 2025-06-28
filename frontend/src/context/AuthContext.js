import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Você já instalou, mas confirme
import api from '../api/api';

// Criação do Contexto
export const AuthContext = createContext(null);

// Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null, isAuthenticated: false });
  const [loading, setLoading] = useState(true);

  // Função de login: recebe o token, salva, e atualiza o estado
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
      logout(); // Se o token for inválido, desloga
    }
  }, []);

  // Função de logout: limpa tudo
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setAuth({ token: null, user: null, isAuthenticated: false });
  };

  // Efeito para verificar o token ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      login(token); // Reutiliza a função de login para validar e setar o estado
    }
    setLoading(false);
  }, [login]);

  // Não renderiza nada enquanto verifica o token
  if (loading) {
    return <div>Carregando Aplicação...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};