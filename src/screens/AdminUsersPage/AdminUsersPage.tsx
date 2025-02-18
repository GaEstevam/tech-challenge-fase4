import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsers, deleteUser } from "../../services/api"; 
import { styles } from "./AdminUsersPage.styles";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "AdminUsers">;

const AdminUsersPage = () => {
  const navigation = useNavigation<NavigationProps>();
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; role: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchLoggedInUser();
  }, []);

  // Buscar lista de usuários
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os usuários.");
    }
  };

  // Buscar usuário logado do AsyncStorage
  const fetchLoggedInUser = async () => {
    try {
      const user = await AsyncStorage.getItem("loggedInUser");
      if (user) {
        setLoggedInUser(JSON.parse(user));
      } else {
        console.log("Nenhum usuário logado encontrado.");
      }
    } catch (error) {
      console.error("Erro ao carregar usuário logado", error);
    } finally {
      setLoadingUser(false);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    navigation.navigate("Login");
  };

  // Função para excluir usuário
  const handleDeleteUser = async (userId: string) => {
    Alert.alert("Excluir Usuário", "Tem certeza que deseja excluir este usuário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            await deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            Alert.alert("Sucesso", "Usuário excluído.");
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o usuário.");
          }
        },
      },
    ]);
  };

  return (
  <View style={styles.container}>
    {/* Informações do Usuário Logado */}
    <View style={styles.userHeader}>
      {loadingUser ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text style={styles.userHeaderText}>
          {loggedInUser
            ? `Conectado como: ${loggedInUser.name} (${loggedInUser.role})`
            : "Usuário não identificado"}
        </Text>
      )}
      {/* O botão de logout agora aparece sempre */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>

    {/* Cabeçalho da Gestão de Usuários */}
    <View style={styles.header}>
      <Text style={styles.title}>Administração de Usuários</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateUser")}
      >
        <Text style={styles.createButtonText}>+ Criar</Text>
      </TouchableOpacity>
    </View>

    {/* Lista de Usuários */}
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhum usuário encontrado.</Text>}
      renderItem={({ item }) => (
        <View style={styles.userContainer}>
          <Text style={styles.userInfo}>{item.name} ({item.role})</Text>
          <View style={styles.adminActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => navigation.navigate("EditUser", { id: item.id })}
            >
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteUser(item.id)}
            >
              <Text style={styles.actionButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </View>
);
}

export default AdminUsersPage;
