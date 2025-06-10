import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext";
import Header from "./components/Header";
import UserDashboard from "./components/UserDashboard";
import MicroFrontendLoader from "./components/MicroFrontendLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Login component using UserService as micro-frontend
const LoginPage = () => {
  const { login } = useAuth();
  const [serviceStatus, setServiceStatus] = useState("checking");
  // Check UserService status
  useEffect(() => {
    const checkUserServiceStatus = async () => {
      try {
        await fetch("http://localhost:5173/login", {
          method: "HEAD",
          mode: "no-cors",
        });
        setServiceStatus("online");
      } catch (error) {
        setServiceStatus("offline");
      }
    };

    checkUserServiceStatus();
  }, []);

  // Listen for authentication events from UserService
  useEffect(() => {
    const handleMessage = (event) => {
      // Ensure the message is from the UserService
      if (event.origin !== "http://localhost:5173") return;

      if (event.data.type === "LOGIN_SUCCESS") {
        const { user, token } = event.data;
        login(user, token);
        // Navigate to dashboard after successful login
        window.location.href = "/dashboard";
      } else if (event.data.type === "LOGIN_ERROR") {
        console.error("Login error from UserService:", event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [login]);
  return (
    <div className="login-page-microservice">
      <MicroFrontendLoader
        url="http://localhost:5173/login"
        name="User Service Login"
        status={serviceStatus}
      />
    </div>
  );
};

// Main App Layout Component
const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [serviceStatus, setServiceStatus] = useState({
    backend: "checking",
    user: "checking",
    task: "checking",
    notification: "checking",
  });

  // Check service status
  const checkServiceStatus = async () => {
    const services = [
      { name: "backend", url: "http://localhost:3000/health" },
      { name: "user", url: "http://localhost:5173" },
      { name: "task", url: "http://localhost:5174" },
      { name: "notification", url: "http://localhost:4200" },
    ];

    const statusChecks = services.map(async (service) => {
      try {
        if (service.name === "backend") {
          // For backend, check the health endpoint directly
          const response = await fetch(service.url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          return {
            name: service.name,
            status: response.ok ? "online" : "offline",
          };
        } else {
          // For frontend services, use no-cors mode since they're on different ports
          await fetch(service.url, {
            method: "HEAD",
            mode: "no-cors",
          });
          // If no error is thrown, assume service is online
          return { name: service.name, status: "online" };
        }
      } catch (error) {
        // If fetch fails, service is likely offline
        return { name: service.name, status: "offline" };
      }
    });

    const results = await Promise.all(statusChecks);
    const newStatus = {};
    results.forEach((result) => {
      newStatus[result.name] = result.status;
    });

    setServiceStatus(newStatus);
  };

  useEffect(() => {
    checkServiceStatus();
    const interval = setInterval(checkServiceStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <Header
        serviceStatus={serviceStatus}
        onRefreshStatus={checkServiceStatus}
      />
      <main className="main-content-full">
        <Routes>
          <Route path="/login" element={<LoginPage />} />{" "}
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          {/* Profile Route - Using UserService */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MicroFrontendLoader
                  url="http://localhost:5173/profile"
                  name="User Profile"
                  status={serviceStatus.user}
                />
              </ProtectedRoute>
            }
          />
          {/* Task Service - Default route after login */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <MicroFrontendLoader
                  url="http://localhost:5174"
                  name="Task Service"
                  status={serviceStatus.task}
                />
              </ProtectedRoute>
            }
          />
          {/* User Service */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <MicroFrontendLoader
                  url="http://localhost:5173"
                  name="User Service"
                  status={serviceStatus.user}
                />
              </ProtectedRoute>
            }
          />
          {/* Notification Service */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MicroFrontendLoader
                  url="http://localhost:4200"
                  name="Notification Service"
                  status={serviceStatus.notification}
                />
              </ProtectedRoute>
            }
          />
          {/* Default redirects */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/tasks" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Catch all route */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/tasks" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// Root App Component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;
