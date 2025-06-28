import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', { name, email, password });
      toast.success('Cadastro realizado com sucesso! Faça o login para continuar.');
      navigate('/login');
    } catch (error) {
      console.error('Falha no cadastro', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Crie sua Conta</h2>
        <div className="form-group">
          <label htmlFor="name">Nome Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Pelo menos 6 caracteres"
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="button-primary">Cadastrar</button>
      </form>
      <div className="redirect-link">
        <p>
          Já tem uma conta? <Link to="/login">Faça o login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;