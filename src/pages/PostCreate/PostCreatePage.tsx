import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, setAuthToken } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './PostCreatePage.css';

const PostCreatePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [themeId, setThemeId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Configura o token no axios
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description ) {
      alert('Título, Descrição e Conteúdo são obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      // Envia a requisição para a API com o campo conteúdo
      await createPost(title, description, themeId);
      alert('Post criado com sucesso!');
      navigate('/home');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar o post. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-create-container">
      <h1 className="post-create-title">Criar Novo Post</h1>
      <form onSubmit={handleSubmit} className="post-create-form">
        <input
          type="text"
          placeholder="Título (obrigatório)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição (obrigatório)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Theme ID (padrão: 1)"
          value={themeId}
          onChange={(e) => {
            const value = Math.max(1, Math.min(4, Number(e.target.value))); // Limita entre 1 e 4
            setThemeId(value);
          }}
          required
        />
        <button type="submit" disabled={loading} className="botao-post">
          {loading ? 'Enviando...' : 'Criar Post'}
        </button>
      </form>
    </div>
  );
};

export default PostCreatePage;
