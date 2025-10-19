
import React, { useEffect, useState, useRef ,useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";


import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";

const { height: s_height, width: s_width } = Dimensions.get("window");

export default function MultiRouteMapWithIcons() {
  // ----------------------------
  // States
  const [userLocation, setUserLocation] = useState(null);
  const [routeBusToUser, setRouteBusToUser] = useState([]);
  const [routeUserToCollege, setRouteUserToCollege] = useState([]);
  const [distanceBusToUser, setDistanceBusToUser] = useState(null);
  const [durationBusToUser, setDurationBusToUser] = useState(null);
  const [distanceUserToCollege, setDistanceUserToCollege] = useState(null);
  const [durationUserToCollege, setDurationUserToCollege] = useState(null);

    const { light, toggleTheme } = useContext(ThemeContext);
    const { user, fetchUserData } = useContext(UserContext);

  
  
  const [theme, setTheme] = useState({
    arrowIcon: require("../images/icons8-double-up-96.png"),
  });
  const [isArrow, setIsArrow] = useState(false);

  // ----------------------------
  // Refs & Animations
  const arrowHeight = useRef(new Animated.Value(300)).current;
  
  // Update arrow icon when light changes
 // Update arrow icon when light changes
useEffect(() => {
  setTheme({
    arrowIcon: light
      ?(isArrow? require("../images/icons8-double-down-100.png"):require("../images/icons8-double-arrow-100.png"))
      : (isArrow? require("../images/icons8-double-down-100.png"):require("../images/icons8-double-arrow-100.png")),  // <- check this path
  });
}, [light,isArrow]);

// ----------------------------
  // Toggle bottom bar
  const toggleArrow = () => {
    Animated.timing(arrowHeight, {
      toValue: !isArrow ? 700 : 300,
      duration: 500,
      useNativeDriver: false,
    }).start(() => setIsArrow(!isArrow));
  };


  // ----------------------------
  // Locations
  const busLocation = { latitude: 15.797406220981244, longitude: 78.02498979702729 };
  const collegeLocation = { latitude: 15.798096, longitude: 78.079392 };

  // ----------------------------
  // Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied for location");
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setUserLocation(location.coords);
    })();
  }, []);

  // ----------------------------
  // Fetch routes
  useEffect(() => {
    if (!userLocation) return;

    fetchRoute(busLocation, userLocation, setRouteBusToUser, setDistanceBusToUser, setDurationBusToUser);
    fetchRoute(userLocation, collegeLocation, setRouteUserToCollege, setDistanceUserToCollege, setDurationUserToCollege);
    checkBusAlert(userLocation, busLocation);
  }, [userLocation]);

  // ----------------------------
  
  // ----------------------------
  // Distance calculation
  const getDistance = (loc1, loc2) => {
    const R = 6371000;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ----------------------------
  // Bus alert if 5 mins away
  const checkBusAlert = (userLoc, busLoc) => {
    const distanceMeters = getDistance(userLoc, busLoc);
    const busSpeedMps = 40 * 1000 / 3600;
    const etaSeconds = distanceMeters / busSpeedMps;
    const etaMinutes = etaSeconds / 60;

    if (etaMinutes >= 50) {
      Alert.alert("Bus Alert", "Your bus is about 5 minutes away!");
    }
  };

  // ----------------------------
  // Fetch route from OSRM
  const fetchRoute = async (start, end, setRoute, setDistance, setDuration) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(([lon, lat]) => ({
          latitude: lat,
          longitude: lon,
        }));
        setRoute(coords);
        setDistance((route.distance / 1000).toFixed(2));
        setDuration(Math.round(route.duration / 60));
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  // ----------------------------
  // Loader while getting location
  if (!userLocation) return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="blue" />
      <Text>Getting user location...</Text>
    </View>
  );

  // ----------------------------
  // Render
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
       <Marker coordinate={busLocation} title="Bus" image={require('../images/buspin.png')} />
<Marker coordinate={userLocation} title="You" image={require('../images/person.png')} />
<Marker coordinate={collegeLocation} title="College" image={require('../images/education.png')} />

        {routeBusToUser.length > 0 && (
          <Polyline coordinates={routeBusToUser} strokeColor="rgba(218, 70, 26, 1)" strokeWidth={6} />
        )}

        {routeUserToCollege.length > 0 && (
          <Polyline coordinates={routeUserToCollege} strokeColor="blue" strokeWidth={6} />
        )}
      </MapView>

      <Animated.View style={[styles.bottombar, { height: arrowHeight ,backgroundColor: light ? "rgba(255,255,255,0.9)" : "#1c1c1c"}]}>
        <TouchableOpacity onPress={toggleArrow}>
          <Image source={theme.arrowIcon} style={{ height: 39, width: 27, alignSelf: "center" }} />
        </TouchableOpacity>

        <View style={[styles.infoBox,{backgroundColor: light ? "rgba(255,255,255,0.9)" : "#353434ff"}]}>
          {distanceBusToUser && durationBusToUser && (
            <Text style={[styles.infoText,{color: light ? "rgba(18, 17, 17, 0.9)" : "#e9e8e8ff"}]}>
              Bus → You: {distanceBusToUser} km, {durationBusToUser} mins
            </Text>
          )}
          {distanceUserToCollege && durationUserToCollege && (
            <Text style={[styles.infoText,{color: light ? "rgba(18, 17, 17, 0.9)" : "#e9e8e8ff"}]}>
              You → College: {distanceUserToCollege} km, {durationUserToCollege} mins
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoBox: {
    
    alignSelf: "center",
    padding: 12,
    marginTop:20,
    borderRadius: 10,
    elevation: 5,
  },
  infoText: { fontSize: 16, fontWeight: "600" },
  bottombar: {
    position: "absolute",
    width: s_width,
    borderWidth: 2,
    bottom: 0,
    elevation: 10,
    shadowColor: "black",
    borderColor: "rgba(164, 160, 160, 1)",
    paddingTop: 10,
    paddingBottom: 50,
    zIndex: 990,
  },
});
