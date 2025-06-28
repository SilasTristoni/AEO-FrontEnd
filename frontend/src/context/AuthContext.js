import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You might need to install jwt-decode: npm install jwt-decode

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({ token, user: { id: decoded.id, name: decoded.name } });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setAuth({ token, user: { id: decoded.id, name: decoded.name } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};