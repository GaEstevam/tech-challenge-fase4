// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { login as loginService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  role: 'Aluno' | 'Professor';
  name: string; // Adiciona o nome ao payload do token
  iat?: number;
  exp?: number;
}

interface User {
  id: number;
  role: 'Aluno' | 'Professor';
  name: string; // Adiciona o nome ao usuário
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          logout();
        } else {
          setToken(storedToken);
          setIsAuthenticated(true);
          setUser({ id: decoded.id, role: decoded.role, name: decoded.name }); // Inclui 'name'
        }
      } catch (error) {
        console.error('Token inválido', error);
        logout();
      }
    }
    setLoading(false);
  }, []);
  

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginService(email, password);
      const jwtToken = response.token as string;
  
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
  
      const decoded = jwtDecode<JwtPayload>(jwtToken);
      setIsAuthenticated(true);
      setUser({ id: decoded.id, role: decoded.role, name: decoded.name }); // Inclui 'name'
  
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };
  

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
