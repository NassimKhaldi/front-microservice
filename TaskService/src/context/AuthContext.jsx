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
    // Check URL parameters first (fallback method)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const urlUser = urlParams.get("user");

    if (urlToken && urlUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(urlUser));
        localStorage.setItem("token", urlToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        console.log("TaskService: Auth loaded from URL parameters");
      } catch (error) {
        console.error("TaskService: Error parsing URL auth data:", error);
      }
    }

    // Check if user is already logged in from localStorage (shared across microfrontends)
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (currentUser && token) {
      setUser(currentUser);
    }
    // Listen for authentication messages from parent window (MicroserviceShell)
    const handleMessage = (event) => {
      console.log("TaskService received message:", event.data);

      if (event.data.type === "AUTH_TOKEN") {
        console.log("TaskService: Setting auth token from parent");
        // Store the authentication data received from parent
        localStorage.setItem("token", event.data.token);
        localStorage.setItem("user", JSON.stringify(event.data.user));
        setUser(event.data.user);
      }
    };

    window.addEventListener("message", handleMessage);

    // Also send a message to parent indicating we're ready to receive auth
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "IFRAME_READY", service: "TaskService" },
        "*"
      );
    }

    setLoading(false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
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
