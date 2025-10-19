import React, { createContext, useState } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // Default role
  const [userinfo, setUserinfo] = useState(null);
 

  const login = (userData) => setUserinfo(userData);
  const logout = () => setUserinfo(null);
  const register = (userData) => setUserinfo(userData);

  return (
    <AuthContext.Provider value={{ userinfo, login, logout, register ,role,setRole}}>
      {children}
    </AuthContext.Provider>
  );
};
