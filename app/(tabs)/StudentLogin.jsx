import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import{useRouter} from 'expo-router'

export default function StudentLogin() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
   const router = useRouter();
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const SERVER_URL =
    Platform.OS === "android" ? "http:// 192.168.137.1:8000" : "http://localhost:8000";

  const handleLogin = async () => {
    if (!roll || !password) {
      Alert.alert("Error", "Please enter Roll Number and Password");
      return;
    }

    const userData = { studentID: roll, password };
      //router.push("LandingPage");
    try {
      const response = await fetch(`http://192.168.137.1:8000/students/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        login(data.student);
        Alert.alert("Success", "Login Successful!");
        router.replace("LandingPage");
      } else {
        Alert.alert("Error", data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 🔙 Back Arrow */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color="#007bff" />
          </TouchableOpacity>

          {/* 🎓 Logo */}
          <Image
            source={require("../images/student.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Student Login</Text>

          {/* 🎓 Roll Number */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Roll Number"
              value={roll}
              onChangeText={setRoll}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>

          {/* 🔒 Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {/* 🔘 Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Login</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>

          {/* 🧾 Register Redirect */}
          <TouchableOpacity onPress={() => router.push("StudentRegister")}>
            <Text style={styles.linkText}>
              Don’t have an account?{" "}
              <Text style={{ color: "#007bff", fontWeight: "bold" }}>Register</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 25,
    borderRadius: 50,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 30,
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
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
