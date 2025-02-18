import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Instância do axios com a baseURL do backend
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // Alterado de 'localhost' para o IP da rede local para funcionar no dispositivo físico
});

// Função para configurar o token de autenticação no cabeçalho
export const setAuthToken = async (token: string | null) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Recupera o token armazenado e define automaticamente no Axios
export const loadAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// --------------------- Funções de Usuário ---------------------

export const register = async (name: string, username: string, password: string, email: string, mobilePhone: string, role: string) => {
  const response = await api.post('/users/register', { name, username, password, email, mobilePhone, role });
  return response.data;
};

export const login = async (email: string, password: string) => {
  try {
    console.log("🔄 Tentando login com:", email, password);
    
    const response = await api.post('/users/login', { email, password });

    console.log("✅ Resposta da API:", response.status, response.data);

    if (response.data.token) {
      await setAuthToken(response.data.token);
      return response.data;
    } else {
      console.warn("⚠️ Nenhum token recebido!");
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Erro na API:", error.response?.status, error.response?.data);
    } else {
      console.error("❌ Erro inesperado:", error);
    }
    return null;
  }
};


export const getUsers = async () => {
  await loadAuthToken(); // Garante que o token está definido antes da requisição
  const response = await api.get('/users/');
  return response.data;
};

export const deleteUser = async (id: string) => {
  await loadAuthToken();
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  await loadAuthToken(); // Certifica-se de carregar o token antes de fazer a requisição

  try {
    console.log("📡 Enviando requisição PUT para atualizar usuário:", id, userData);

    const response = await api.put(`/users/${id}`, userData);

    console.log("✅ Resposta da API:", response.status, response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Erro na API ao atualizar usuário:", error.response?.status, error.response?.data);
      throw new Error(`Erro na API: ${error.response?.data?.message || "Erro desconhecido"}`);
    } else {
      console.error("❌ Erro inesperado ao atualizar usuário:", error);
      throw new Error("Erro inesperado ao atualizar usuário");
    }
  }
};


export const getUserById = async (id: string) => {
  await loadAuthToken();
  const response = await api.get(`/users/${id}`);
  return response.data;
};



// --------------------- Funções de Postagens ---------------------

export const createPost = async (title: string, description: string, themeId: number) => {
  await loadAuthToken();
  const response = await api.post('/posts/create', { title, description, themeId });
  return response.data;
};

export const editPost = async (id: number, title?: string, description?: string, themeId?: number, content?: string) => {
  await loadAuthToken();
  const response = await api.put(`/posts/edit/${id}`, { title, description, themeId, content });
  return response.data;
};

export const getPosts = async () => {
  await loadAuthToken();
  const response = await api.get('/posts/');
  return response.data;
};

export const getPostById = async (id: number) => {
  await loadAuthToken(); // Garante que o token está carregado

  console.log(`🔎 Buscando post com ID: ${id}`);

  try {
    const response = await api.get(`/posts/${id}`);
    console.log("✅ Resposta da API:", response.status, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Erro na API ao buscar post:", error.response?.status, error.response?.data);
    } else {
      console.error("❌ Erro inesperado ao buscar post:", error);
    }
    return null; // Retorna `null` se a requisição falhar
  }
};


export const searchPosts = async (query: string) => {
  await loadAuthToken();
  const response = await api.get(`/posts/search/${query}`);
  return response.data;
};

export const deletePost = async (id: number) => {
  await loadAuthToken();
  const response = await api.delete(`/posts/delete/${id}`);
  return response.data;
};
