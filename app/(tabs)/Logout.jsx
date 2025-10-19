import React, { useContext } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
   // Your logout function
  const { light } = useContext(ThemeContext);
  const { logout,setRole } = useContext(AuthContext);
  const router = useRouter();

  

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: light ? "#fff" : "#222" }]}>
      
      <View style={styles.container}>
        <Text style={{fontSize:20,fontWeight:"bold" ,color: light ?  "#000000ff" : "#f3efefff" }}>Do you want  to Logout?</Text>
        <View style={{flexDirection:"row",gap:20,marginTop:20}}>
          <TouchableOpacity
          onPress={()=>{ logout();setRole(null);router.replace('/')}}
          style={[
            styles.logoutButton,
            { backgroundColor: light ? "#f39142ff" : "#444" },
          ]}
        >
          
          <Text style={[styles.logoutText, { color: light ? "#fffafaff" : "#0c0c0cff"  }]}>Yes</Text>
        </TouchableOpacity>
         <TouchableOpacity
          onPress={()=>router.back()}
          style={[
            styles.logoutButton,
            { backgroundColor: light ? "#30bcf8ff" : "#444" },
          ]}
        > <Text style={[styles.logoutText, { color: light ? "#fffafaff" : "#0c0c0cff"  }]}>No</Text></TouchableOpacity>
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: { fontSize: 16, fontWeight: "600" },
});
