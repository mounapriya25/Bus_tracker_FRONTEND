// context/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [light, setLight] = useState(true);

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const fetchTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("Theme");
      if (storedTheme) {
        setLight(JSON.parse(storedTheme).light);
      }
    };
    fetchTheme();
  }, []);

  // Function to toggle theme
  const toggleTheme = async () => {
    const newLight = !light;
    setLight(newLight);
    await AsyncStorage.setItem("Theme", JSON.stringify({ light: newLight }));
  };

  return (
    <ThemeContext.Provider value={{ light, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
