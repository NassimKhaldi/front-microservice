import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

// Standalone Login Page for Microservice Shell
function StandaloneLogin() {
  const [authMode, setAuthMode] = useState("login");

  return (
    <div className="app standalone-auth">
      {authMode === "login" ? (
        <Login switchToSignup={() => setAuthMode("signup")} />
      ) : (
        <SignUp switchToLogin={() => setAuthMode("login")} />
      )}
    </div>
  );
}

function AuthenticatedApp() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login");

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Standalone login route for microservice shell */}
      <Route path="/login" element={<StandaloneLogin />} />

      {/* Main app routes */}
      <Route
        path="/"
        element={
          user ? (
            <Dashboard />
          ) : (
            <div className="app">
              {authMode === "login" ? (
                <Login switchToSignup={() => setAuthMode("signup")} />
              ) : (
                <SignUp switchToLogin={() => setAuthMode("login")} />
              )}
            </div>
          )
        }
      />

      {/* Dashboard route */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" replace />}
      />

      {/* Profile route */}
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
