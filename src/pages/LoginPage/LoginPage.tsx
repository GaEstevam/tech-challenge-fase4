// src/pages/LoginPage/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';
import { FaLock, FaUser } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      
      navigate('/home');
    } else {
      alert('Credenciais inválidas!');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>
        <div className="input-field">
      <input
        type="text"
        placeholder="Usuário"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        
      />
      <FaUser className="icon"/>
      </div>
      <div className="input-field">
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      </div>
        <button type="submit" className="botao-login">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
