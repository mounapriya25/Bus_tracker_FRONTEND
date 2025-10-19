// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider>+
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}
