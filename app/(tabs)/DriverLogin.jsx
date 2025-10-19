import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DriverLogin({ navigation }) {
  const [busNo, setBusNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!busNo || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://192.168.10.2:3000/drivers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busNo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        Alert.alert("Success", "Login successful!");
        navigation.navigate("Home");
      } else {
        console.error("Login failed:", data);
        Alert.alert("Error", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🔙 Back Arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("LandingPage")}
        >
          <Ionicons name="arrow-back" size={26} color="#007bff" />
        </TouchableOpacity>

        <Text style={styles.title}>Driver Login</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="bus-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            placeholder="Bus Number"
            value={busNo}
            onChangeText={setBusNo}
            style={styles.input}
            placeholderTextColor="#888"
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("DriverRegister")}>
          <Text style={styles.linkText}>
            Don’t have an account? <Text style={{ color: "#007bff" }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#007bff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    textAlign: "center",
    color: "#333",
    fontSize: 15,
  },
});
