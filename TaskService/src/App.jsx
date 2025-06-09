import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TaskDashboard from "./components/TaskDashboard";
import "./App.css";

function AuthenticatedApp() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to access the Task Management system.</p>
        <p>
          This service is designed to work within the microservice platform.
        </p>
      </div>
    );
  }

  return <TaskDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AuthenticatedApp />
      </div>
    </AuthProvider>
  );
}

export default App;
