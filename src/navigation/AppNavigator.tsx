import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import HomePage from '../screens/HomePage/HomePage';
import LoginPage from '../screens/LoginPage/LoginPage';
import PostCreatePage from '../screens/CreatePage/PostCreatePage';
import PostEditPage from '../screens/EditPage/PostEditPage';
import PostReadPage from '../screens/ReadPage/PostReadPage';
import AdminPostPage from '../screens/AdminPostPage/AdminPostPage';
import AdminUsersPage from '../screens/AdminUsersPage/AdminUsersPage';
import EditUserPage from '../screens/EditUserPage/EditUserPage'; 
import CreateUserPage from '../screens/CreateUserPage/CreateUserPage';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CreatePost: undefined;
  EditPost: { id: number };
  ReadPost: { id: number };
  AdminPost: undefined;
  AdminUsers: undefined;
  EditUser: { id: string };
  CreateUser: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await AsyncStorage.getItem("loggedInUser");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserRole(parsedUser?.role || "aluno"); // Garante um valor padrão caso falhe
        }
      } catch (error) {
        console.error("Erro ao carregar a role do usuário:", error);
        setUserRole("aluno"); // Fallback seguro
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading || loadingRole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Definir permissões com base no papel do usuário
  const isAluno = userRole === "aluno";
  const allowedScreens = {
    aluno: ["Home", "ReadPost"],
    professor: [
      "Home", "ReadPost", "CreatePost", "EditPost",
      "AdminPost", "AdminUsers", "EditUser", "CreateUser"
    ],
  };

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
      {/* Páginas acessíveis a todos os usuários logados */}
      {allowedScreens.aluno.includes("Home") && (
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      )}
      {allowedScreens.aluno.includes("ReadPost") && (
        <Stack.Screen name="ReadPost" component={PostReadPage} options={{ headerShown: false }} />
      )}

      {/* Páginas restritas a professores */}
      {!isAluno && (
        <>
          {allowedScreens.professor.includes("CreatePost") && (
            <Stack.Screen name="CreatePost" component={PostCreatePage} options={{ headerShown: false }} />
          )}
          {allowedScreens.professor.includes("EditPost") && (
            <Stack.Screen name="EditPost" component={PostEditPage} options={{ headerShown: false }} />
          )}
          {allowedScreens.professor.includes("AdminPost") && (
            <Stack.Screen name="AdminPost" component={AdminPostPage} options={{ headerShown: false }} />
          )}
          {allowedScreens.professor.includes("AdminUsers") && (
            <Stack.Screen name="AdminUsers" component={AdminUsersPage} options={{ title: "Gerenciar Usuários" }} />
          )}
          {allowedScreens.professor.includes("EditUser") && (
            <Stack.Screen name="EditUser" component={EditUserPage} options={{ title: "Editar Usuário" }} />
          )}
          {allowedScreens.professor.includes("CreateUser") && (
            <Stack.Screen name="CreateUser" component={CreateUserPage} options={{ title: "Criar Usuário" }} />
          )}
        </>
      )}

      {/* Tela de login para usuários não autenticados */}
      <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
