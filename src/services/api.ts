import axios from 'axios';

// Instância do axios com a baseURL do backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Prefixo para o endpoint de posts
});

// Função para configurar o token de autenticação no cabeçalho
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// --------------------- Funções de Usuário ---------------------

export const register = async (name: string, username: string, password: string, email: string, mobilePhone: string, role: string) => {
  const response = await api.post('/users/register', { name, username, password, email, mobilePhone, role });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users/');
  return response.data;
};

// --------------------- Funções de Postagens ---------------------

// Criar um post (apenas PROFESSOR)
export const createPost = async (title: string, description: string, themeId: number) => {
  const response = await api.post('/posts/create', { title, description, themeId });
  return response.data;
};

// Editar um post (apenas PROFESSOR)
export const editPost = async (
  id: number,
  title?: string,
  description?: string,
  themeId?: number,
  content?: string,
  token?: string
) => {
  const response = await api.put(
    `/posts/edit/${id}`,
    { title, description, themeId, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Obter todos os posts
export const getPosts = async (token: string) => {
  const response = await api.get('/posts/', {
    headers: {
      Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
    },
  });
  return response.data;
};

// Obter um post por ID
export const getPostById = async (id: number, token: string) => {
  const response = await api.get(`/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Pesquisar posts por query
export const searchPosts = async (query: string) => {
  const response = await api.get(`/posts/search/${query}`);
  return response.data;
};

export const deletePost = async (id: number, token: string) => {
  const response = await api.delete(`/posts/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
    },
  });
  return response.data;
};
