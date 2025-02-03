import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, deletePost } from '../../services/api';
import { Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext'; // Importa o hook de autenticação
import './AdminPage.css';


interface AdminPageProps {
  posts: Post[];
  onDelete: (id: number) => void; // Função para deletar o post
}

const AdminPage: React.FC<AdminPageProps> = ({ posts, onDelete }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const { token } = useAuth(); // Pega o token do contexto de autenticação
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (!token) throw new Error('Token não disponível.');
        const data = await getPosts(token); // Passa o token aqui
        setLocalPosts(data);
      } catch (err) {
        setError('Erro ao buscar os posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleDelete = async (id: number) => {
    try {
      if (!token) throw new Error('Token não disponível.');
      await deletePost(id, token); // Passa o token aqui também
      setLocalPosts(localPosts.filter((post) => post.id !== id)); // Remove localmente
      onDelete(id); // Notifica o App
    } catch (err) {
      setError('Erro ao deletar o post.');
    }
  };

  if (loading) return <p>Carregando posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className='header'>
        <h1>Administração de Posts</h1>
        <button onClick={() => navigate('/create')}>Criar Post</button>
      </div>

      {localPosts.length > 0 ? (
        localPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              margin: '10px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3>{post.title}</h3>
            </div>
            <div className="admin-actions">
                <button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className="edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="delete"
                >
                  Excluir
                </button>
              </div>

            </div>
        ))
      ) : (
        <p>Nenhum post encontrado.</p>
      )}
    </div>
  );
};

export default AdminPage;
