import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css'; // Vamos criar um arquivo de estilo para a navbar

const Navbar = () => {
  // 1. Pegamos as informações do contexto de autenticação
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // 2. Se o contexto ainda não estiver pronto, não renderiza nada para evitar erros
  if (!auth) {
    return null;
  }

  const { isAuthenticated, user, logout } = auth;

  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/categories" className="navbar-logo">
          AEO Store
        </NavLink>

        {/* 3. Só mostra os links e o botão de logout se o usuário estiver autenticado */}
        {isAuthenticated && (
          <div className="navbar-menu">
            <ul className="navbar-links">
              <li>
                <NavLink to="/categories" className="nav-link">Categorias</NavLink>
              </li>
              <li>
                <NavLink to="/products" className="nav-link">Produtos</NavLink>
              </li>
              <li>
                <NavLink to="/orders" className="nav-link">Pedidos</NavLink>
              </li>
            </ul>
            <div className="navbar-user-section">
              {/* Mostra o nome do usuário que veio do token */}
              <span className="user-greeting">Olá, {user?.name || 'Usuário'}</span>
              <button onClick={handleLogout} className="logout-button">
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;