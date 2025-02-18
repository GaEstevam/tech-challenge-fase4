import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './PostCreatePage.styles';
import { createPost, setAuthToken } from '../../services/api';

const PostCreatePage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [themeId, setThemeId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

  // Carrega o token ao montar o componente
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        setToken(storedToken);
      }
    };

    loadToken();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Erro', 'Título e descrição são obrigatórios.');
      return;
    }

    if (!token) {
      Alert.alert('Erro', 'Você não está autenticado.');
      return;
    }

    try {
      setLoading(true);
      await createPost(title, description, themeId);
      Alert.alert('Sucesso', 'Post criado com sucesso!');
      navigation.navigate('Home'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao criar post:', error);
      Alert.alert('Erro', 'Não foi possível criar o post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Título (obrigatório)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição (obrigatório)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Theme ID (padrão: 1)"
        value={themeId.toString()}
        onChangeText={(value) => {
          const id = Math.max(1, Math.min(4, Number(value))); // Limita o ID entre 1 e 4
          setThemeId(id);
        }}
        keyboardType="numeric"
      />
      <Button
        title={loading ? 'Enviando...' : 'Criar Post'}
        onPress={handleSubmit}
        disabled={loading}
        color="#007BFF"
      />
      {loading && <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />}
    </View>
  );
};

export default PostCreatePage;
