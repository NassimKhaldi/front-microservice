import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ serviceStatus, onRefreshStatus }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const getOverallStatus = () => {
    const statuses = Object.values(serviceStatus);
    if (statuses.every((status) => status === "online")) return "online";
    if (statuses.some((status) => status === "offline")) return "degraded";
    return "checking";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#4CAF50";
      case "degraded":
        return "#ff9800";
      case "offline":
        return "#f44336";
      default:
        return "#ff9800";
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const overallStatus = getOverallStatus();

  return (
    <header className="header">
      {" "}
      <div className="header-left">
        <div className="logo">
          <Link to="/dashboard">📋 Task Management Platform</Link>
        </div>
      </div>{" "}
      <div className="header-center">
        {isAuthenticated && (
          <nav className="quick-nav">
            <Link to="/dashboard" className="nav-item">
              🏠 Dashboard
            </Link>
            <Link to="/profile" className="nav-item">
              👤 Profile
            </Link>
            <Link to="/users" className="nav-item">
              👥 Users
            </Link>
            <Link to="/tasks" className="nav-item">
              📋 Tasks
            </Link>
            <Link to="/notifications" className="nav-item">
              🔔 Notifications
            </Link>
          </nav>
        )}
      </div>
      <div className="header-right">
        <div className="status-indicator">
          <div
            className="status-dot"
            style={{ backgroundColor: getStatusColor(overallStatus) }}
          ></div>
          <span>System {overallStatus}</span>
        </div>

        <button className="refresh-button" onClick={onRefreshStatus}>
          🔄 Refresh
        </button>

        {isAuthenticated ? (
          <div className="user-menu">
            <span className="user-welcome">
              Hello, {user?.name || user?.email}
            </span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
