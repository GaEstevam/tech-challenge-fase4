import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import './PostReadPage.css';
import { getThemeName } from '../../theme';

interface PostReadPageProps {
  posts: Post[];
}

const PostReadPage: React.FC<PostReadPageProps> = ({ posts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = posts.find((p) => p.id === parseInt(id || '', 10));

  // Caso o post não seja encontrado
  if (!post) return <p className="error-message">Post não encontrado!</p>;

  const handleEdit = () => {
    // Navega para a página de edição com o ID do post
    navigate(`/edit/${post.id}`);
  };

  return (
    
    <div className="post-read-container">
      <div className="post-read-content">
        <h1 className="post-read-title">{post.title}</h1>
        <p className="post-read-description">{post.description}</p>
        <p className='post-read-themeId'>Tema: {getThemeName(post.themeId)}</p>
        <p className="post-read-author">
          Autor: {post.creator?.username || 'Desconhecido'}
        </p>
      </div>
    </div>
  );
};

export default PostReadPage;
