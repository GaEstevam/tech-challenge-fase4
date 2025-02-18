import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPosts, deletePost, getPostById } from "../../services/api";
import { Post } from "../../types";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer"; // Importando o Footer atualizado

const AdminPostPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const { token } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (!token) throw new Error("Token não disponível.");
        const data = await getPosts(token);
        setPosts(data);
        setError(null);
      } catch (err) {
        setError("Erro ao buscar os posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleFetchPost = async (id: number) => {
    try {
      if (!token) throw new Error("Token não disponível.");
      const post = await getPostById(id, token);
      
      navigation.navigate("EditPost", { id: post.id, title: post.title, content: post.content });
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar o post.");
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              if (!token) throw new Error("Token não disponível.");
              await deletePost(id, token);
              
              const newPosts = posts.filter((post) => post.id !== id);
              setPosts(newPosts);
            } catch (err) {
              Alert.alert("Erro", "Erro ao deletar o post.");
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando posts...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Administração de Posts</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Text style={styles.createButtonText}>Criar Post</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Posts */}
      <FlatList
        data={posts}
        style={styles.postList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleFetchPost(item.id)}
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Nenhum post encontrado.</Text>
        }
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={<View style={{ height: 100 }} />} // 🔥 Espaço extra para evitar sobreposição do Footer
      />

      {/* Footer fixo */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

export default AdminPostPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  postContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  adminActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#17a2b8",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  footerContainer: {
    alignSelf: "stretch",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
  },
});
