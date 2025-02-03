export interface Post {
  id: number;
  title: string;
  description: string;
  themeId: number; // Adicione themeId ao tipo Post
  creator?: {      // Creator é opcional
    username: string;
  };
}

// src/types.ts
export interface User {
  id: number;
  email: string;
  name: string; // Adicione essa linha
  role?: string; // Outras propriedades, se existirem
}

