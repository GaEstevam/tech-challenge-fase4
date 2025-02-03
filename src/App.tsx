import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import PostReadPage from './pages/PostReadPage/PostReadPage';
import PostCreatePage from './pages/PostCreate/PostCreatePage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Post } from './types';
import { deletePost } from './services/api';
import './global.css';
import PostEditPage from './pages/PostEditPage/PostEditPage';

const AppContent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { token } = useAuth(); // Pega o token do contexto de autenticação

  // Função para deletar um post
  const handleDelete = async (id: number) => {
    try {
      if (!token) throw new Error('Token não disponível.');
      await deletePost(id, token); // Chama a API para deletar o post
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)); // Remove o post localmente
    } catch (error) {
      console.error('Erro ao deletar o post:', error);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage posts={posts} setPosts={setPosts} token={token || ''} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostReadPage posts={posts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute requiredRole="Professor">
                <PostCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute requiredRole="Professor">
                <PostEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Professor">
                <AdminPage posts={posts} onDelete={handleDelete} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
