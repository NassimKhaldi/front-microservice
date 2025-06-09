import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">User Dashboard</h1>
        <div className="user-info">
          <span className="user-name">Welcome, {user?.name}!</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="welcome-section">
        <h2>Welcome to User Service</h2>
        <p>You have successfully logged in to your account.</p>
      </div>

      <div className="user-details">
        <h3>Account Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Name:</strong> {user?.name}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="info-item">
            <strong>Member since:</strong>{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
