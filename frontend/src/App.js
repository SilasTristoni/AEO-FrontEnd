import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

// Importando os estilos
import './App.css'; // <-- CORREÇÃO: Importa os estilos principais
import 'react-toastify/dist/ReactToastify.css';

// Importação das páginas e componentes
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Orders from './pages/Orders';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';

// Layout para páginas internas que possuem a barra de navegação
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="container">{children}</div>
  </>
);

// Layout para as páginas de autenticação (Login, Register)
const AuthLayout = ({ children }) => (
  <div className="auth-container">{children}</div>
);


function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
      <Router>
        <Routes>
          {/* Rota Raiz: redireciona para /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

          {/* Rotas Protegidas */}
          <Route 
            path="/categories" 
            element={<ProtectedRoute><MainLayout><Categories /></MainLayout></ProtectedRoute>} 
          />
          <Route 
            path="/products" 
            element={<ProtectedRoute><MainLayout><Products /></MainLayout></ProtectedRoute>} 
          />
          <Route 
            path="/orders" 
            element={<ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>} 
          />

          {/* Rota para qualquer outro caminho não encontrado */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;