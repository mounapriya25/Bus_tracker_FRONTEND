import React, { useState, useContext } from "react";
import {
 
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';

export default function StudentRegister({ onRegister }) {
 const navigation = useNavigation();
  const { register } = useContext(AuthContext);
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [area, setArea] = useState("");
  const [gender, setGender] = useState("");
  const [startTiming, setStartTiming] = useState("");
  const [exitTiming, setExitTiming] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const SERVER_URL =
    Platform.OS === "android" ? "http://192.168.1.3:8000" : "http://localhost:8000";

  const isValidTime = (time) =>
    /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(time);

  // Step validations
  const handleNext = () => {
    if (step === 1 && (!name || !email || !rollNumber)) {
      Alert.alert("Error", "Please fill Full Name, Email, and Roll Number");
      return;
    }
    if (step === 2 && (!area || !gender || !startTiming)) {
      Alert.alert("Error", "Please fill Area, Gender, and Start Timing");
      return;
    }
    if (step === 2 && !isValidTime(startTiming)) {
      Alert.alert("Error", "Start time format invalid (e.g., 8:00 AM)");
      return;
    }
    setStep(step + 1);
  };

  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !rollNumber ||
      !busNumber ||
      !area ||
      !gender ||
      !startTiming ||
      !exitTiming ||
      !mobileNumber ||
      !password
    ) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (!isValidTime(startTiming) || !isValidTime(exitTiming)) {
      Alert.alert(
        "Error",
        "Please enter valid Start and Exit timings (e.g., 8:00 AM, 5:00 PM)"
      );
      return;
    }

    const userData = {
      name,
      email,
      studentID: rollNumber,
      password,
      busNo: busNumber,
      area,
      gender,
      startTiming,
      exitTiming,
      mobileNumber,
    };

    try {
      const response = await fetch(`${SERVER_URL}/students/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Registration successful!");
        register(data.student);
        console.log("Registered student:", data.student);
        router.replace("LangingPage");
      } else {
        Alert.alert("Error", data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={26} color="#007bff" />
          </TouchableOpacity>

          <Image
            source={require("../images/student.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Student Registration</Text>

          {/* Step 1: Name, Email, Roll Number */}
          {step === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Email"
                  value={email}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Roll Number"
                  value={rollNumber}
                  onChangeText={setRollNumber}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step 2: Area, Gender, Start Timing */}
          {step === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Area"
                  value={area}
                  onChangeText={setArea}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="male-female-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Gender"
                  value={gender}
                  onChangeText={setGender}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="time-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Start Timing (e.g., 8:00 AM)"
                  value={startTiming}
                  onChangeText={setStartTiming}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step 3: Exit Timing, Mobile, Password, Bus Number */}
          {step === 3 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="time-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Exit Timing (e.g., 5:00 PM)"
                  value={exitTiming}
                  onChangeText={setExitTiming}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={setMobileNumber}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
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

              <View style={styles.inputContainer}>
                <Ionicons name="bus-outline" size={20} color="#555" />
                <TextInput
                  placeholder="Bus Number"
                  value={busNumber}
                  keyboardType="numeric"
                  onChangeText={setBusNumber}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10 },
  logo: { width: 100, height: 100, alignSelf: "center", marginBottom: 25, borderRadius: 50 },
  title: { textAlign: "center", fontSize: 26, fontWeight: "bold", color: "#007bff", marginBottom: 30 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
  },
  input: { flex: 1, fontSize: 16, color: "#000" },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
