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
import Sidebar from "./components/Sidebar";
import UserDashboard from "./components/UserDashboard";
import MicroFrontendLoader from "./components/MicroFrontendLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Login component for the shell
const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user, data.data.token);
        // After successful login, navigate to tasks
        window.location.href = "/tasks";
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    }
  };

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData.email, formData.password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to Microservice Platform</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

// Main App Layout Component
const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
          // For backend, we can check directly since it has CORS configured
          const response = await fetch(service.url);
          return {
            name: service.name,
            status: response.ok ? "online" : "offline",
          };
        } else {
          // For other services, try a simple fetch with no-cors
          const response = await fetch(service.url, {
            method: "GET",
            mode: "no-cors",
          });
          return { name: service.name, status: "online" };
        }
      } catch (error) {
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      <Header
        toggleSidebar={toggleSidebar}
        serviceStatus={serviceStatus}
        onRefreshStatus={checkServiceStatus}
      />
      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} serviceStatus={serviceStatus} />
        <main
          className={`main-content ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
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
