import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Pega o estado de autenticação diretamente do contexto
  const { isAuthenticated } = useContext(AuthContext);

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, mostra a página solicitada
  return children;
};

export default ProtectedRoute;