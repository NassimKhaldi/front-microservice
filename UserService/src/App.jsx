import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function AuthenticatedApp() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="app">
      {authMode === "login" ? (
        <Login switchToSignup={() => setAuthMode("signup")} />
      ) : (
        <SignUp switchToLogin={() => setAuthMode("login")} />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
