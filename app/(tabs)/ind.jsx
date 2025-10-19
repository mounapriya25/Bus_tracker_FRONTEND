import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import { AuthContext } from "../../context/AuthContext";

export default function Landingpage() {
  const navigation = useNavigation();
  const router = useRouter();
   const { setRole } = useContext(AuthContext);
  const handleRoleSelection = (role) => {
    setRole(role);
    if (role === "driver") {
      router.push("DriverLogin");}
    else router.push("StudentLogin");
  };

  const RoleButton = ({ role, title, description, image }) => (
    <TouchableOpacity
      style={styles.roleButton}
      onPress={() => handleRoleSelection(role)}
    >
      <View style={styles.iconContainer}>
        <Image source={image} style={styles.iconImage} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("../images/bus-stop.png")}
        style={styles.busImage}
      />

      <Text style={styles.heading}>Welcome to BusTracker!</Text>
      <Text style={styles.subheading}>Please select your role to continue.</Text>

      <View style={styles.buttonsContainer}>
        <RoleButton
          role="student"
          title="I'm a Student"
          description="Track your bus, stay updated, and never miss a ride!"
          image={require("../images/student.png")}
        />
        <RoleButton
          role="driver"
          title="I'm a Driver"
          description="Manage your route, timings, and communicate with students."
          image={require("../images/driver.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  busImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginTop: 50,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
  },
  roleButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
  iconImage: {
    width: 50,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#f0f0f0",
    marginTop: 5,
    textAlign: "center",
  },
});
