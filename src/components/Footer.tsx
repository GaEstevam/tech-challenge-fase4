import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      {/* Botão Home */}
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.button}>
        <Ionicons name="home-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Botão Post */}
      <TouchableOpacity onPress={() => navigation.navigate("AdminPost")} style={styles.button}>
        <Ionicons name="add-circle-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Botão Admin */}
      <TouchableOpacity onPress={() => navigation.navigate("AdminUsers")} style={styles.button}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#007BFF",
    paddingVertical: 12, // Reduzindo a altura do Footer
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 }, // Ajustando a sombra para cima
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8, // Melhorando sombra no Android
  },
  button: {
    padding: 10, // Mantendo área clicável boa
  },
});
