/*import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;

    (async () => {
      // Ask for permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Start watching location continuously
      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // update every 2 seconds
          distanceInterval: 2, // or when user moves 2 meters
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );
    })();

    // Cleanup when component unmounts
    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});//
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, Linking, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const openGoogleMaps = () => {
    if (!location) return;
    const origin = `${location.latitude},${location.longitude}`;
    const destination = encodeURIComponent("Pullareddy Engineering College Kurnool");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    Linking.openURL(url);
  };

  if (errorMsg) return <Text>{errorMsg}</Text>;
  if (!location)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Fetching location...</Text>
      </View>
    );

  return (
    <View style={styles.center}>
      <Text>Lat: {location.latitude.toFixed(4)}</Text>
      <Text>Lng: {location.longitude.toFixed(4)}</Text>
      <Button title="Show Route to Pullareddy College" onPress={openGoogleMaps} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
//import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";

export default function App() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const GOOGLE_API_KEY = "AIzaSyC2ZnxbNie5UYH-FIZRn6PWt5Rxi6S0ppU"; // 👈 replace this

  const destination = {
    latitude: 15.8281,
    longitude: 78.0373, // Pullareddy College, Kurnool
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location denied");
        return;
      }

      // Get continuous location updates
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setLocation(coords);
          fetchRoute(coords, destination);
        }
      );
    })();
  }, []);

  const fetchRoute = async (origin: { latitude: number; longitude: number }, dest: { latitude: number; longitude: number }) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&key=${GOOGLE_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const routeCoords = points.map(([latitude, longitude]) => ({ latitude, longitude }));
        setRouteCoords(routeCoords);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker coordinate={location} title="You" />
      <Marker coordinate={destination} title="Pullareddy College" />
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});*/
// App.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

type Coord = { latitude: number; longitude: number };

export default function App() {
  const [location, setLocation] = useState<Coord | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const destination: Coord = {
    latitude: 15.8281,
    longitude: 78.0373, // Pullareddy College, Kurnool
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location denied");
        return;
      }

      // Get continuous location updates
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => {
          const coords: Coord = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setLocation(coords);
          fetchRoute(coords, destination);
        }
      );
    })();
  }, []);

  const fetchRoute = async (start: Coord, end: Coord) => {
    try {
      // Using OSRM API (Open Source Routing Machine)
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(
          ([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })
        );
        setRouteCoords(coords);
      }
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker coordinate={location} title="You" />
      <Marker coordinate={destination} title="Pullareddy College" />
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
