import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'Aluno' | 'Professor';
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Tela temporária durante o carregamento
  }

  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  console.log('requiredRole:', requiredRole);

  if (!isAuthenticated || !user) {
    console.warn('Usuário não autenticado.');
    return <Navigate to="/" replace />;
  }

  // Normaliza as strings para minúsculas antes da comparação
  const userRole = user.role.toLowerCase();
  const required = requiredRole?.toLowerCase();

  if (required && userRole !== required) {
    console.warn(`Acesso negado. Requer role: ${requiredRole}, role atual: ${user.role}`);
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
