import React, { useState, useEffect } from 'react';
import { getPostById, editPost } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './PostEditPage.styles';

interface RouteParams {
  id: string;
}

interface Post {
  title: string;
  description: string;
  content?: string;
  themeId: number;
}

const PostEditPage: React.FC = () => {
  const { token } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [themeId, setThemeId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!token) {
          Alert.alert("Erro", "Token não disponível.");
          return;
        }

        console.log(`🔎 Buscando post com ID: ${id} usando token: ${token}`);
        const post = await getPostById(parseInt(id, 10));

        if (!post) {
          Alert.alert("Erro", "Post não encontrado.");
          return;
        }

        console.log("✅ Post carregado com sucesso:", post);

        setTitle(post.title || ""); 
        setDescription(post.description || ""); 
        setContent(post.content || ""); 
        setThemeId(post.themeId || 1);
      } catch (error) {
        console.error("❌ Erro ao carregar o post:", error);
        Alert.alert("Erro", "Não foi possível carregar o post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleSubmit = async () => {
    try {
      if (!token) {
        Alert.alert("Erro", "Token não disponível.");
        return;
      }

      await editPost(parseInt(id, 10), title, description, themeId, content, token);
      Alert.alert('Sucesso', 'Post atualizado com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('❌ Erro ao editar o post:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false} // 🔥 Remove a barra de rolagem
      >
        <View style={styles.container}>
          <Text style={styles.title}>Editar Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Conteúdo"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
          />
          <TextInput
            style={styles.input}
            placeholder="Theme ID"
            value={themeId.toString()}
            onChangeText={(value) => setThemeId(Math.max(1, Number(value)))}
            keyboardType="numeric"
          />
          <Button title="Salvar Alterações" onPress={handleSubmit} color="#007BFF" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PostEditPage;
