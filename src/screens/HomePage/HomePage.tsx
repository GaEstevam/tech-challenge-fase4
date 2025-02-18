import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
  Alert,
} from 'react-native';
import styles from './HomePage.styles';
import { getPosts } from '../../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

interface Post {
  id: number;
  title: string;
  description: string;
  theme: string;
}

type HomePageProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  token: string;
  role?: 'professor' | 'aluno';
  onLogout?: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ token, navigation, onLogout }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  const handleLogout = () => {
    console.log("🔴 Logout acionado");
    if (onLogout) {
      console.log("✅ Chamando função onLogout passada como prop");
      onLogout();
    } else if (logout) {
      console.log("✅ Chamando função logout do contexto de autenticação");
      logout();
    } else {
      console.error("❌ ERRO: Nenhuma função de logout disponível");
    }
    navigation.replace('Login');
  };

  const renderPostItem: ListRenderItem<Post> = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
      <Text style={styles.postTheme}>Tema: {item.theme}</Text>
      <TouchableOpacity 
        style={styles.readMoreButton} 
        onPress={() => {
          console.log("📌 Navegando para ReadPost com ID:", item.id);
          if (item.id) {
            navigation.navigate('ReadPost', { id: item.id });
          } else {
            console.error("❌ ERRO: ID do post indefinido!");
          }
        }}
      >
        <Text style={styles.readMoreText}>Ler mais</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    console.log('Role recebida:', user?.role);

    if (!user?.role) {
      console.log('⏳ Role indefinida, aguardando...');
      setTimeout(() => {
        if (!user?.role) {
          console.log('🚪 Role ainda indefinida após espera. Fazendo logout...');
          handleLogout();
        }
      }, 2000);
      return;
    }

    setCheckingRole(false);

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data: Post[] = await getPosts(token);
        setPosts(data);
      } catch (err) {
        setError('Erro ao buscar os posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.role]);

  if (authLoading || checkingRole) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Carregando...</Text>
      </View>
    );
  }

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Lista de Posts</Text>
        {user?.role === 'aluno' && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderPostItem}
          contentContainerStyle={{ paddingBottom: user?.role === 'professor' ? 100 : 0 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {user?.role === 'professor' && (
        <View style={styles.footerContainer}>
          <Footer />
        </View>
      )}
    </View>
  );
};

export default HomePage;
