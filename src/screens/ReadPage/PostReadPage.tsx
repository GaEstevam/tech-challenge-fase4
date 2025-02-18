import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './PostReadPage.styles';
import { getPostById } from '../../services/api';
import { useRoute } from '@react-navigation/native';

// Tipagem para um Post
interface Post {
  id: number;
  title: string;
  description: string;
  themeId: number;
  creator?: { username: string };
}

const PostReadPage: React.FC = () => {
  const route = useRoute();
  const { id: postId } = route.params || {}; // Obtém o ID da rota

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      console.error("⚠️ Nenhum ID de post recebido!");
      setError("Post ID inválido.");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      console.log(`📖 Carregando post com ID: ${postId}`);

      try {
        const data = await getPostById(postId);
        if (!data) {
          console.warn("⚠️ Post não encontrado na API!");
          setError("Post não encontrado.");
        } else {
          console.log("✅ Post carregado com sucesso:", data);
          setPost(data);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar post:", err);
        setError("Erro ao carregar o post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorMessage}>Nenhum post carregado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
        <Text style={styles.theme}>Tema ID: {post.themeId}</Text>
        <Text style={styles.author}>{post.creator?.username || 'Desconhecido'}</Text>
      </View>
    </View>
  );
};

export default PostReadPage;
