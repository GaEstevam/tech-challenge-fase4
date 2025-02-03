import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostItem from '../../components/PostItem/PostItem';
import { getPosts } from '../../services/api';
import './HomePage.css';
import { Post } from '../../types';


interface HomePageProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  token: string; // Token para autenticação
}

const HomePage: React.FC<HomePageProps> = ({ posts, setPosts, token }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPosts(token); // Passa o token para a requisição
        setPosts(data);
      } catch (err) {
        setError('Erro ao buscar os posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token, setPosts]);

  if (loading) return <p>Carregando posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className="posts-list">
        <h1>Lista de Posts</h1>
        {posts.length > 0 ? (
        posts.map((post) => <PostItem key={post.id} post={post} />)
      ) 
      : (
        <p>Nenhum post encontrado.</p>
      )}
      </div>
    </div>
  );
};

export default HomePage;
