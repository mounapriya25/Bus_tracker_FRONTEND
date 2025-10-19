import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { UserContext } from "../../context/UserContext"; // your UserContext

export default function ProfileScreen() {
  const { light } = useContext(ThemeContext);
  const { user, fetchUserData } = useContext(UserContext);

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
   /* try {
      setLoading(true);
      await axios.put(`https://your-api.com/students/${user._id}`, profile);
      await fetchUserData(); // refresh user data
      Alert.alert("Success", "Profile updated successfully");
      setEditing(false);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }*/
  };

  const themeStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: light ? "#F9FAFB" : "#1F2937", padding: 20 },
    label: { fontSize: 14, fontWeight: "500", color: light ? "#111827" : "#F9FAFB", marginTop: 15 },
    input: {
      borderWidth: 1,
      borderColor: light ? "#D1D5DB" : "#6B7280",
      borderRadius: 8,
      padding: 10,
      color: light ? "#111827" : "#F9FAFB",
      marginTop: 5,
      backgroundColor: light ? "#fff" : "#374151",
    },
    button: {
      backgroundColor: "#2563EB",
      padding: 15,
      borderRadius: 8,
      marginTop: 30,
      alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    title: { fontSize: 24, fontWeight: "bold", color: light ? "#111827" : "#F9FAFB" },
  });

  if (!profile) {
    return (
      <View style={[themeStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={themeStyles.container}>
      <Text style={themeStyles.title}>My Profile</Text>

      {Object.entries(profile).map(([key, value]) => {
        if (key === "_id" || key === "settingsId" || key === "busId") return null;
        return (
          <View key={key}>
            <Text style={themeStyles.label}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <TextInput
              style={themeStyles.input}
              value={value ? String(value) : ""}
              editable={editing}
              onChangeText={(text) => setProfile({ ...profile, [key]: text })}
            />
          </View>
        );
      })}

      <TouchableOpacity
        style={themeStyles.button}
        onPress={editing ? handleSave : () => setEditing(true)}
        disabled={loading}
      >
        <Text style={themeStyles.buttonText}>
          {editing ? (loading ? "Saving..." : "Save Changes") : "Edit Profile"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
