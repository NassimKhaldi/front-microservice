import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

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
    // Check if user is already logged in on app start
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }

    // Listen for authentication messages from parent window (MicroserviceShell)
    const handleMessage = (event) => {
      if (event.data.type === "AUTH_TOKEN") {
        // Store the authentication data received from parent
        localStorage.setItem("token", event.data.token);
        localStorage.setItem("user", JSON.stringify(event.data.user));
        setUser(event.data.user);
      }
    };

    window.addEventListener("message", handleMessage);

    setLoading(false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);

      // If we're running inside an iframe (microservice mode), notify parent
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "LOGIN_SUCCESS",
            user: response.data.user,
            token: response.data.token,
          },
          "*"
        );
      }

      return response;
    } catch (error) {
      // If we're running inside an iframe, notify parent of error
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "LOGIN_ERROR",
            error: error.message,
          },
          "*"
        );
      }
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      // For now, we'll simulate the API call and update local storage
      // In a real application, this would make an API call to update the user profile
      const updatedUser = { ...user, ...profileData };

      // Update local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update state
      setUser(updatedUser);

      // If we're running inside an iframe, notify parent of profile update
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "PROFILE_UPDATED",
            user: updatedUser,
          },
          "*"
        );
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    loading,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
