import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  role: 'Aluno' | 'Professor';
  name?: string;
  iat?: number;
  exp?: number;
}

interface User {
  id: number;
  role: 'Aluno' | 'Professor';
  name: string;
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
    const loadStoredData = async () => {
      console.log("🔄 Iniciando carregamento dos dados do usuário...");
      setLoading(true);

      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("loggedInUser");

        console.log("🔄 Token carregado do AsyncStorage:", storedToken);
        console.log("🔄 Usuário carregado do AsyncStorage:", storedUser);

        if (storedToken) {
          const decoded = jwtDecode<JwtPayload>(storedToken);
          console.log("✅ Token decodificado:", decoded);

          if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            console.warn("⚠️ Token expirado, realizando logout...");
            logout();
          } else {
            setToken(storedToken);
            setIsAuthenticated(true);

            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setUser({
                id: decoded.id,
                role: decoded.role,
                name: decoded.name || "Usuário"
              });
            }
          }
        }
      } catch (error) {
        console.error("❌ Erro ao carregar os dados:", error);
        logout();
      }

      console.log("✅ Finalizando carregamento dos dados...");
      setLoading(false);
    };

    loadStoredData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log("🔐 Tentando login com:", email, password);
      const response = await loginService(email, password);
      console.log("✅ Resposta da API:", response);

      if (response && response.token) {
        const jwtToken = response.token as string;
        console.log("🔑 Token recebido do login:", jwtToken);

        await AsyncStorage.setItem("token", jwtToken);

        const decoded = jwtDecode<JwtPayload>(jwtToken);
        console.log("🔍 Token decodificado:", decoded);

        if (!decoded.id || !decoded.role) {
          console.error("❌ Erro: token inválido (id ou role ausente)!");
          logout();
          return false;
        }

        const newUser = {
          id: decoded.id,
          role: decoded.role,
          name: decoded.name || "Usuário"
        };
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(newUser));
        setUser(newUser);
        setToken(jwtToken);
        setIsAuthenticated(true);
        console.log("✅ Usuário salvo no contexto:", newUser);

        setLoading(false);
        return true;
      } else {
        console.warn("⚠️ Nenhum token recebido. Credenciais inválidas?");
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
    }

    setLoading(false);
    return false;
  };

  const logout = async () => {
    console.log("🚪 Realizando logout...");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Correção: Exportando `useAuth` corretamente
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
