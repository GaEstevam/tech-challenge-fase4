import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import './PostItem.css';
import { useAuth } from '../../contexts/AuthContext';
import { getThemeName } from '../../theme'; // Corrigido o caminho

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const { user } = useAuth();

  return (
    <div className="post-item">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-description">{post.description}</p>
      {/* Exibindo o nome do tema */}
      <p className="post-theme">Tema: {getThemeName(post.themeId)}</p>

      <Link to={`/posts/${post.id}`} className="read-more-link">
        Ler mais
      </Link>
    </div>
  );
};

export default PostItem;
