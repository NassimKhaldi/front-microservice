import React from "react";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;
