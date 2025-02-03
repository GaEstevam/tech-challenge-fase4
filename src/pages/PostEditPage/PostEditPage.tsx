import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { editPost, getPostById } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './PostEditPage.css';


const PostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth(); // Recupera o token do contexto de autenticação

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [themeId, setThemeId] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!token) throw new Error('Token não fornecido');

        const post = await getPostById(parseInt(id || '', 10), token);
        setTitle(post.title);
        setContent(post.content);
        setDescription(post.description);
        setThemeId(post.themeId);
      } catch (error) {
        console.error('Erro ao carregar o post:', error);
        alert('Erro ao carregar o post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) throw new Error('Token não fornecido');

      await editPost(parseInt(id || '', 10), title, description, themeId, content, token);
      alert('Post atualizado com sucesso!');
      navigate('/home'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao editar o post:', error);
      alert('Erro ao editar o post.');
    }
  };

  if (loading) return <p>Carregando post...</p>;

  return (
    <div className="post-edit-container">
      <h1 className="post-edit-title">Editar Post</h1>
      <form onSubmit={handleSubmit} className="post-edit-form">
        <input
          type="text"

          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Theme ID"
          value={themeId}
          onChange={(e) => setThemeId(Math.max(1, Number(e.target.value)))}
          required
        />
        <button type="submit" className="botao-put">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default PostEditPage;
