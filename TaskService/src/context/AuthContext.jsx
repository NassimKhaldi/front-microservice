import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage (shared across microfrontends)
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (currentUser && token) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("token");
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
