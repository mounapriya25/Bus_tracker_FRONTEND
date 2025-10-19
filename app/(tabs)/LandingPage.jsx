import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AuthContext } from "../../context/AuthContext";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function HomeScreen() {
  const { userinfo,role } = useContext(AuthContext);
  const { user, fetchUserData } = useContext(UserContext);
  const { light } = useContext(ThemeContext);
  const router = useRouter();

  // Determine email/phone from userinfo
  let email = null;
  let phone = null;
  if (role != "driver") email = userinfo?.email;
  else phone = userinfo?.mobileno;

  // Fetch user data if logged in
  useEffect(() => {
    if (!userinfo) {
      router.replace("/StudentLogin");
      return;
    }
  const timer=setTimeout(()=>{router.replace("/Home")},5000)
   
  }, [userinfo]);

  return (
    <SafeAreaView style={[styles.safeArea,{ backgroundColor: light ? "#fff" : "#222" }]}>
      <View style={[styles.container, { backgroundColor: light ? "#fff" : "#222" }]}>
        <Text style={[styles.title, { color: light ? "#161616ff" : "#f1ededff" }]}>
          Welcome, {userinfo?.name || user?.name} 👋
        </Text>
        <Text style={[styles.subtitle, { color: light ? "#161616ff" : "#f1ededff" }]}>
          You are logged in as  {role || user?.role}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
  },
});
