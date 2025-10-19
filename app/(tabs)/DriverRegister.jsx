import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function DriverRegister() {
  const navigation = useNavigation();

  const [busNumber, setBusNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (!busNumber || !driverName || !mobileNumber || !password) {
      Alert.alert("Error", "Please fill all fields to register.");
      return;
    }

    Alert.alert("Success", "Registration successful!");
    navigation.navigate("DriverLogin");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.heading}>Driver Registration</Text>

          <TextInput
            style={[styles.input, focusedField === "driverName" && styles.inputFocused]}
            placeholder="Driver Name"
            value={driverName}
            onChangeText={setDriverName}
            onFocus={() => setFocusedField("driverName")}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="words"
          />

          <TextInput
            style={[styles.input, focusedField === "busNumber" && styles.inputFocused]}
            placeholder="Bus Number"
            value={busNumber}
            onChangeText={setBusNumber}
            keyboardType="numeric"
            onFocus={() => setFocusedField("busNumber")}
            onBlur={() => setFocusedField(null)}
          />

          <TextInput
            style={[styles.input, focusedField === "mobileNumber" && styles.inputFocused]}
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
            onFocus={() => setFocusedField("mobileNumber")}
            onBlur={() => setFocusedField(null)}
          />

          <View
            style={[
              styles.input,
              styles.passwordWrapper,
              focusedField === "password" && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.8}>
              <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            Already have an account?{" "}
            <Text
              style={styles.loginText}
              onPress={() => navigation.navigate("DriverLogin")}
            >
              Login here
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backBtn: { position: "absolute", top: 10, left: 20 },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    width: "100%",
    borderColor: "#ccc",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#dce8e6",
    color: "#000",
  },
  inputFocused: {
    borderColor: "#007AFF",
    ...Platform.select({
      ios: {
        shadowColor: "#007AFF",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 5 },
    }),
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  passwordInput: { flex: 1, fontSize: 16, color: "#000" },
    toggleText: { color: "#007AFF", fontWeight: "600", marginLeft: 8 },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  registerText: { textAlign: "center", marginTop: 25, fontSize: 15 },
  loginText: { fontWeight: "bold", color: "#007AFF" },
});
