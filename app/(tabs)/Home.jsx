import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StatusBar,
  TextInput,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import Map from "./map";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

const { height: s_height, width: s_width } = Dimensions.get("window");

export default function Index() {
  const { light, toggleTheme } = useContext(ThemeContext);
  const { user, fetchUserData } = useContext(UserContext);
  const { userinfo } = useContext(AuthContext );
  const us = user;
  const router = useRouter();
  const navigation = useNavigation(); // ✅ Navigation hook
  const [isMenu, setIsMenu] = useState(false);
  const [isArrow, setIsArrow] = useState(false);
  
  const arrowHeight = useRef(new Animated.Value(70)).current;

  const slideAnim = useRef(new Animated.Value(-s_width * 0.7)).current;
  const backdropOpacity = slideAnim.interpolate({
    inputRange: [-s_width * 0.7, 0],
    outputRange: [0, 0.7],
  });

  const [theme, setTheme] = useState({
    bgColor: "white",
    TtColor: "#757778ff",
    menu: "white",
    menuIcon: require("../images/menu-light.png"),
    
  });
  
  useEffect(() => {
    
    setTheme({
      bgColor: light ? "rgba(255,255,255)" : "#22272bff",
      TtColor: light ? "#343536ff" : "#e2e5e6ff",
      menu: light ? "white" : "#22272bff",
      menuIcon: light
        ? require("../images/menu-light.png")
        : require("../images/menu-dark.png"),
     
    });
   
  }, [light]);

 

  const toggleMenu = () => {
    if (!isMenu) {
      setIsMenu(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -s_width * 0.7,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setIsMenu(false));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      {/* Header */}
      <View style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,zIndex:990 }} >
        <View style={[styles.header, { paddingLeft: 15 }]}>
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={theme.menuIcon}
              style={{ height: 22, width: 22, alignSelf: "flex-end" }}
            />
          </TouchableOpacity>

          <Text
            style={{
              paddingLeft: 20,
              color: theme.TtColor,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Bus
            <Text style={{ color: "#30bcf8ff", fontWeight: "bold", fontSize: 20 }}>
              Tracker
            </Text>
          </Text>

          <TouchableOpacity style={styles.rightAlign} onPress={() => toggleTheme()}>
            <Image
              source={
                light
                  ? require("../images/icons8-sun-50.png")
                  : require("../images/icons8-do-not-disturb-ios-100.png")
              }
              style={{ height: 26, width: 25, alignSelf: "flex-end" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Overlay */}
      {isMenu && (
        <>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity, backgroundColor: theme.bgColor }]}
          >
            <TouchableOpacity style={{ height: "100%", width: "100%" }} onPress={toggleMenu} />
          </Animated.View>

          <Animated.View
            style={[
              styles.menu,
              {
                transform: [{ translateX: slideAnim }],
                backgroundColor: theme.bgColor,
              },
            ]}
          >
            {/* Profile */}
            <TouchableOpacity
              style={{
                marginBottom: 20,
                padding: 15,
                borderColor: "rgba(223, 218, 218, 1)",
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
                backgroundColor: "#30bcf8ff",
              }} onPress={() => router.push('/Profile')}
            >
              <View style={{ flexDirection: "row", paddingTop: 25 }}>
                <Image
                  source={{
                    uri: "https://www.intsocialcapital.org/wp-content/uploads/2022/01/blank-profile-picture-973460_1280.png",
                  }}
                  style={{
                    height: 55,
                    width: 55,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: "rgba(223, 218, 218, 1)",
                  }}
                />
                <View style={{ paddingRight: 20, paddingLeft: 20 }}>
                  <Text style={[styles.name, { color: theme.menu }]} numberOfLines={1} ellipsizeMode="tail">
                    {userinfo?.name || "Name"}
                  </Text>
                  <Text style={{ color: theme.menu, fontSize: 13 }}>{userinfo?.studentID||""}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Menu Items */}
            <View style={{ padding: 10, paddingLeft: 20, backgroundColor: theme.bgColor }}>
              
              <TouchableOpacity
                style={{ paddingBottom: 20, flexDirection: "row" }}
                onPress={() => router.push('/Buslist')}
              >
                <Image source={require("../images/icons8-list-100.png")} style={{ height: 25, width: 25, marginRight: 15 }} />
                <Text style={{ fontSize: 18, fontWeight: "600", color: theme.TtColor }}>BusList</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ paddingBottom: 20, flexDirection: "row" }}
                onPress={() => router.push('/Notifications')}
                 // replace with your screen
              >
                <Image source={require("../images/icons8-notification-100.png")} style={{ height: 25, width: 25, marginRight: 15 }} />
                <Text style={{ fontSize: 18, fontWeight: "600", color: theme.TtColor }}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ paddingBottom: 20, flexDirection: "row" }}
                onPress={() => router.push('/Settings')}
               // replace with your screen
              >
                <Image source={require("../images/icons8-settings-100.png")} style={{ height: 25, width: 25, marginRight: 15 }} />
                <Text style={{ fontSize: 18, fontWeight: "600", color: theme.TtColor }}>Settings</Text>
              </TouchableOpacity>
                  <TouchableOpacity
                style={{ paddingBottom: 20, flexDirection: "row" }}
                onPress={() => router.push('/Home')}

              >
                <Image source={require("../images/icons8-help-100.png")} style={{ height: 25, width: 25, marginRight: 15 }} />
                <Text style={{ fontSize: 18, fontWeight: "600", color: theme.TtColor }}>Help</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{ paddingBottom: 20, flexDirection: "row" }}
                onPress={() => router.push('/Logout')}
               
              >
                <Image source={require("../images/icons8-logout-60.png")} style={{ height: 25, width: 25, marginRight: 15 }} />
                <Text style={{ fontSize: 18, fontWeight: "600", color: theme.TtColor }}>Logout</Text>
                

              </TouchableOpacity>
              
            </View>
          </Animated.View>
        </>
      )}

      {/* Main Body */}
      <View style={{ position: "relative",zIndex: 1, height: "100%", width: "100%", backgroundColor: theme.bgColor }}>
        <Map/>
      </View>

      {/* Search Bar */}
      <View style={{ position: "absolute", top: "14%", zIndex: 1, left: "12%" ,opacity:0.9}}>
        <TextInput
          style={[styles.searchbar, { flex: 1, paddingLeft: 50, height: 45, fontSize: 14, backgroundColor: theme.bgColor, color: theme.TtColor }]}
          placeholder="Search"
          placeholderTextColor={theme.TtColor}
        />
        <TouchableOpacity style={{ position: "absolute", left: 15, paddingTop: 12 }}>
          <Image source={require("../images/icons8-search-96.png")} style={{ height: 20, width: 25 }} />
        </TouchableOpacity>
      </View>

      {/* Bottom Bar 
      <Animated.View style={[styles.bottombar, { height: arrowHeight, backgroundColor: theme.bgColor }]}>
        <TouchableOpacity onPress={toggleArrow}>
          <Image source={theme.arrowIcon} style={{ height: 29, width: 27, alignSelf: "center" }} />
        </TouchableOpacity>
      </Animated.View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative", zIndex: 1 },
  header: { flexDirection: "row", alignItems: "center",  shadowOpacity: 0.2, padding: 10,elevation:50,shadowColor:"rgb(0,0,0)",},
  rightAlign: { flex: 1, width: 30, justifyContent: "center" },
  searchbar: { elevation: 30,shadowColor:"#070707ff", borderWidth: 2, borderColor: "#b6bdbdff", width: 300, borderRadius: 40 },
  
  backdrop: { position: "absolute", top: 0, left: 0, height: s_height, width: s_width, backgroundColor: "black", zIndex: 998 },
  menu: { position: "absolute", height: "100%", width: s_width * 0.7, elevation: 50, shadowColor: "black", shadowOpacity: 1, zIndex: 999 },
  name: { color: "#eaf1f1ff", width: 170, fontWeight: "bold", fontSize: 22 },
});
