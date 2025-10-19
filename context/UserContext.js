// context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("UserDetails");
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  // Function to fetch user data from backend and store in context + AsyncStorage
  const fetchUserData = async (email) => {
    try {
      const res = await axios.post("http://192.168.137.1:8000/getsettings", { user: email });
      console.log("API response:", res.data);

      if (res.data.message === "success") {
        // Save to AsyncStorage
        await AsyncStorage.setItem("UserDetails", JSON.stringify(res.data.user));
        // Update context
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};