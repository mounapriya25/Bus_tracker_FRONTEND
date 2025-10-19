import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Text, Switch, StyleSheet, StatusBar, ScrollView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { ThemeContext } from "../../context/ThemeContext";

export default function SettingsScreen() {
  const { light } = useContext(ThemeContext); // Get theme
  const [pushNotifications, setPushNotifications] = useState(false);
  const [arrivalAlerts, setArrivalAlerts] = useState(false);
  const [delayNotifications, setDelayNotifications] = useState(false);
  const [voiceAssist, setVoiceAssist] = useState(false);
  const router = useRouter();

  // Load saved preferences
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedPush = await AsyncStorage.getItem("pushNotifications");
        const savedArrival = await AsyncStorage.getItem("arrivalAlerts");
        const savedDelay = await AsyncStorage.getItem("delayNotifications");
        const savedVoice = await AsyncStorage.getItem("voiceAssist");

        if (savedPush !== null) setPushNotifications(JSON.parse(savedPush));
        if (savedArrival !== null) setArrivalAlerts(JSON.parse(savedArrival));
        if (savedDelay !== null) setDelayNotifications(JSON.parse(savedDelay));
        if (savedVoice !== null) setVoiceAssist(JSON.parse(savedVoice));
      } catch (e) {
        console.log("Error loading settings:", e);
      }
    };
    loadSettings();
  }, []);

  // Save settings when changed
  const toggleSetting = async (key, value, setter) => {
    setter(value);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log("Error saving setting:", e);
    }
  };

  // Theme-based colors
  const colors = {
    background: light ? "#F9FAFB" : "#121212",
    containerLight: light ? "#c8eff9ff" : "#1E1E1E",
    containerArrival: light ? "#ebeeefff" : "#2A2A2A",
    containerDelay: light ? "#FFF5E9" : "#2E2E2E",
    containerVoice: light ? "#dbd3fbff" : "#292929",
    textPrimary: light ? "#111827" : "#E2E2E2",
    textSecondary: light ? "#6B7280" : "#A0A0A0",
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your preferences and permissions</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Notification Preferences</Text>

        <View style={[styles.settingBox, { backgroundColor: colors.containerLight }]}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Push Notifications</Text>
          <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Receive notifications on your device</Text>
          <Switch
            value={pushNotifications}
            onValueChange={(val) => toggleSetting("pushNotifications", val, setPushNotifications)}
          />
        </View>

        <View style={[styles.settingBox, { backgroundColor: colors.containerArrival }]}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Arrival Alerts</Text>
          <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Get notified when your bus is approaching</Text>
          <Switch
            value={arrivalAlerts}
            onValueChange={(val) => toggleSetting("arrivalAlerts", val, setArrivalAlerts)}
          />
        </View>

        <View style={[styles.settingBox, { backgroundColor: colors.containerDelay }]}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Delay Notifications</Text>
          <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Receive alerts about bus delays</Text>
          <Switch
            value={delayNotifications}
            onValueChange={(val) => toggleSetting("delayNotifications", val, setDelayNotifications)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Voice Assistance</Text>
        <View style={[styles.settingBox, { backgroundColor: colors.containerVoice }]}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Voice Assistance</Text>
          <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Enable or disable voice announcements</Text>
          <Switch
            value={voiceAssist}
            onValueChange={(val) => toggleSetting("voiceAssist", val, setVoiceAssist)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 60,
    marginEnd: 10,
  },
  backBtn: { position: "absolute", top: 15, left: 10 },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  settingBox: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDesc: {
    fontSize: 13,
    marginBottom: 8,
  },
});
