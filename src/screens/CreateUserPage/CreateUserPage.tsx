import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { register } from "../../services/api"; // Função para criar usuário
import { styles } from "./CreateUserPage.styles";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "CreateUser">;

const CreateUserPage = () => {
  const navigation = useNavigation<NavigationProps>();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [role, setRole] = useState("aluno"); // 🔹 Alterado para minúsculas

  const handleCreateUser = async () => {
    if (!name || !username || !email || !password || !role) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      console.log("Enviando dados:", {
        name,
        username,
        password,
        email,
        mobilePhone,
        role: role.toLowerCase(), // 🔹 Garante que o valor seja minúsculo
      });

      await register(name, username, password, email, mobilePhone, role.toLowerCase()); // 🔹 Garante minúsculas
      Alert.alert("Sucesso", "Usuário criado com sucesso!");
      navigation.goBack(); // Voltar para a tela de AdminUsersPage
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o usuário.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Usuário</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nome" 
        value={name} 
        onChangeText={setName} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="E-mail" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry
      />

      <TextInput 
        style={styles.input} 
        placeholder="Telefone (opcional)" 
        value={mobilePhone} 
        onChangeText={setMobilePhone} 
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Cargo</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => {
          console.log("Novo valor selecionado:", itemValue); // 🔹 Debug para conferir
          setRole(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Aluno" value="aluno" />
        <Picker.Item label="Professor" value="professor" />
      </Picker>

      <Button title="Criar Usuário" onPress={handleCreateUser} />
    </View>
  );
};

export default CreateUserPage;
