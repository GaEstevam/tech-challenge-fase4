import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Certifique-se de ajustar o caminho conforme sua estrutura de pastas

const NotFoundPage: React.FC = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">Página não encontrada</h1>
      <p className="notfound-message">Desculpe, a página que você está procurando não existe.</p>
      <Link to="/" className="notfound-link">Voltar à página inicial</Link>
    </div>
  );
};

export default NotFoundPage;
