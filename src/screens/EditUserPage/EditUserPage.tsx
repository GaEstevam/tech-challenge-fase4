import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { updateUser, getUserById } from "../../services/api";
import { styles } from "./EditUserPage.styles";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";

type EditUserPageRouteProp = RouteProp<RootStackParamList, "EditUser">;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, "EditUser">;

const EditUserPage = ({ route }: { route: EditUserPageRouteProp }) => {
  const { id } = route.params;
  const navigation = useNavigation<NavigationProps>();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [role, setRole] = useState("aluno"); // Agora em minúsculas

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await getUserById(id);
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email);
      setMobilePhone(user.mobilePhone || "");

      // Garante que o role sempre esteja em minúsculas
      setRole(user.role.toLowerCase());
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    }
  };

  const handleUpdateUser = async () => {
    try {
      // Certifica-se de que "Aluno" e "Professor" são convertidos corretamente
      const roleMapping: Record<string, string> = {
        "Aluno": "aluno",
        "Professor": "professor",
        "aluno": "aluno",
        "professor": "professor",
      };

      const formattedRole = roleMapping[role] || "aluno"; // Padrão seguro

      console.log("🔄 Enviando atualização com role:", formattedRole);

      await updateUser(id, { name, username, email, mobilePhone, role: formattedRole });

      Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      Alert.alert("Erro", "Não foi possível atualizar o usuário.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>
      
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
        placeholder="Telefone" 
        value={mobilePhone} 
        onChangeText={setMobilePhone} 
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Cargo</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Aluno" value="aluno" />
        <Picker.Item label="Professor" value="professor" />
      </Picker>

      <Button title="Salvar Alterações" onPress={handleUpdateUser} />
    </View>
  );
};

export default EditUserPage;