import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, serviceStatus }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const getStatusBadge = (status) => {
    return <span className={`status-badge ${status}`}>{status}</span>;
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : "";
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <h4>Welcome, {user?.name || user?.email}</h4>
              <p className="user-role">User Dashboard</p>
            </div>

            <h3>Navigation</h3>
            <ul className="nav-links">
              <li>
                <Link to="/dashboard" className={isActive("/dashboard")}>
                  🏠 Unified Dashboard
                </Link>
              </li>
              <li>
                <Link to="/users" className={isActive("/users")}>
                  👥 User Management
                </Link>
              </li>
              <li>
                <Link to="/tasks" className={isActive("/tasks")}>
                  📋 Task Management
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className={isActive("/notifications")}
                >
                  🔔 Notifications
                </Link>
              </li>
            </ul>

            <h3>Quick Actions</h3>
            <ul className="quick-actions">
              <li>
                <Link to="/tasks" className="action-link">
                  ➕ Create Task
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="action-link">
                  📧 Check Notifications
                </Link>
              </li>
              <li>
                <Link to="/users" className="action-link">
                  👤 Profile Settings
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <>
            <h3>Get Started</h3>
            <ul className="nav-links">
              <li>
                <Link to="/login" className={isActive("/login")}>
                  🔐 Login
                </Link>
              </li>{" "}
              <li>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📝 Sign Up (User Service)
                </a>
              </li>
            </ul>

            <div className="info-section">
              <h4>About This Platform</h4>
              <p>A microservice architecture demonstration with:</p>
              <ul>
                <li>User Management</li>
                <li>Task Management</li>
                <li>Real-time Notifications</li>
                <li>Cross-service Integration</li>
              </ul>
            </div>
          </>
        )}
        <h3>Service Status</h3>
        <ul className="service-status-list">
          <li className="service-status-item">
            <span className="service-name">Backend API</span>
            {getStatusBadge(serviceStatus.backend)}
          </li>
          <li className="service-status-item">
            <span className="service-name">User Service</span>
            {getStatusBadge(serviceStatus.user)}
          </li>
          <li className="service-status-item">
            <span className="service-name">Task Service</span>
            {getStatusBadge(serviceStatus.task)}
          </li>
          <li className="service-status-item">
            <span className="service-name">Notification Service</span>
            {getStatusBadge(serviceStatus.notification)}
          </li>
        </ul>{" "}
        {isAuthenticated && (
          <div className="microservice-links">
            <h3>Microservices</h3>
            <ul className="service-links">
              <li>
                <Link to="/users" className={isActive("/users")}>
                  👥 User Service
                </Link>
              </li>
              <li>
                <Link to="/tasks" className={isActive("/tasks")}>
                  📋 Task Service
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className={isActive("/notifications")}
                >
                  🔔 Notification Service
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
