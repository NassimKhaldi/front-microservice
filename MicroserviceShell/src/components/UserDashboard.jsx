import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    tasks: [],
    notifications: [],
    stats: {},
    loading: true,
    error: null
  });  const [activeTab, setActiveTab] = useState('overview');

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const loadUserDashboard = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      const headers = getAuthHeaders();

      // Load user-specific data with proper authentication
      const [tasksResponse, notificationsResponse, statsResponse] = await Promise.all([
        fetch(`http://localhost:3000/api/tasks?assignedTo=${user.id}`, { headers }),
        fetch(`http://localhost:3000/api/notifications?userId=${user.id}`, { headers }),
        fetch(`http://localhost:3000/api/dashboard/user/${user.id}`, { headers })
      ]);

      if (!tasksResponse.ok || !notificationsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const tasks = await tasksResponse.json();
      const notifications = await notificationsResponse.json();
      const stats = await statsResponse.json();

      setDashboardData({
        tasks: tasks.data || tasks || [],
        notifications: notifications.data || notifications || [],
        stats: stats.data || stats || {},
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setDashboardData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load dashboard data. Please try again.' 
      }));
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      loadUserDashboard();
    }
  }, [user, isAuthenticated]);  const markNotificationAsRead = async (notificationId) => {
    try {
      const headers = getAuthHeaders();

      await fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ read: true })
      });
      
      // Update local state
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const headers = getAuthHeaders();

      await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      
      // Reload dashboard to get updated data
      loadUserDashboard();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };  const createDemoScenario = async (scenario) => {
    try {
      const headers = getAuthHeaders();

      await fetch(`http://localhost:3000/api/tasks/demo/create-scenario`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ scenario })
      });
      
      // Reload dashboard
      loadUserDashboard();
    } catch (error) {
      console.error('Error creating demo scenario:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="user-dashboard">
        <div className="empty-state">
          <h3>Please log in to access your dashboard</h3>
          <p>You need to be authenticated to view your tasks and notifications.</p>
        </div>
      </div>
    );
  }

  if (dashboardData.loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-spinner">Loading your dashboard...</div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="user-dashboard">
        <div className="message error">
          {dashboardData.error}
          <button onClick={loadUserDashboard} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const unreadNotifications = dashboardData.notifications.filter(n => !n.read);
  const pendingTasks = dashboardData.tasks.filter(t => t.status === 'pending');
  const inProgressTasks = dashboardData.tasks.filter(t => t.status === 'in-progress');
  const completedTasks = dashboardData.tasks.filter(t => t.status === 'completed');

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{dashboardData.tasks.length}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{unreadNotifications.length}</h3>
            <p>Unread Notifications</p>
          </div>
          <div className="stat-card">
            <h3>{pendingTasks.length}</h3>
            <p>Pending Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{completedTasks.length}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'tasks' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tasks')}
        >
          My Tasks
        </button>
        <button 
          className={activeTab === 'notifications' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications ({unreadNotifications.length})
        </button>
        <button 
          className={activeTab === 'demo' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('demo')}
        >
          Demo Scenarios
        </button>
      </div>

      <div className="dashboard-content">        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="quick-navigation">
              <h2>Quick Access</h2>
              <div className="navigation-cards">
                <div className="nav-card" onClick={() => navigate('/tasks')}>
                  <div className="nav-icon">📋</div>
                  <h3>Task Management</h3>
                  <p>Create, manage, and track all your tasks</p>
                  <button className="nav-button">Go to Tasks</button>
                </div>
                <div className="nav-card" onClick={() => navigate('/notifications')}>
                  <div className="nav-icon">🔔</div>
                  <h3>Notifications</h3>
                  <p>View all notifications and alerts</p>
                  <button className="nav-button">Go to Notifications</button>
                </div>
                <div className="nav-card" onClick={() => navigate('/users')}>
                  <div className="nav-icon">👥</div>
                  <h3>User Profile</h3>
                  <p>Manage your profile and settings</p>
                  <button className="nav-button">Go to Profile</button>
                </div>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h2>Recent Tasks</h2>
                <div className="task-list">
                  {dashboardData.tasks.slice(0, 5).map(task => (
                    <div key={task.id} className={`task-item ${task.priority}`}>
                      <div className="task-info">
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <span className={`status ${task.status}`}>{task.status}</span>
                      </div>
                      <div className="task-actions">
                        {task.status === 'pending' && (
                          <button onClick={() => updateTaskStatus(task.id, 'in-progress')}>
                            Start
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <button onClick={() => updateTaskStatus(task.id, 'completed')}>
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Recent Notifications</h2>
                <div className="notification-list">
                  {dashboardData.notifications.slice(0, 5).map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                    >
                      <div className={`notification-type ${notification.type}`}></div>
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="task-sections">
              <div className="task-section">
                <h3>Pending ({pendingTasks.length})</h3>
                {pendingTasks.map(task => (
                  <div key={task.id} className="task-card pending">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className={`priority ${task.priority}`}>{task.priority}</span>
                      {task.dueDate && (
                        <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    <button onClick={() => updateTaskStatus(task.id, 'in-progress')}>
                      Start Task
                    </button>
                  </div>
                ))}
              </div>

              <div className="task-section">
                <h3>In Progress ({inProgressTasks.length})</h3>
                {inProgressTasks.map(task => (
                  <div key={task.id} className="task-card in-progress">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className={`priority ${task.priority}`}>{task.priority}</span>
                      {task.dueDate && (
                        <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    <button onClick={() => updateTaskStatus(task.id, 'completed')}>
                      Complete Task
                    </button>
                  </div>
                ))}
              </div>

              <div className="task-section">
                <h3>Completed ({completedTasks.length})</h3>
                {completedTasks.map(task => (
                  <div key={task.id} className="task-card completed">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className={`priority ${task.priority}`}>{task.priority}</span>
                      <span className="completed-date">
                        Completed: {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <div className="notification-actions">              <button 
                onClick={async () => {
                  const headers = getAuthHeaders();
                  await fetch(`http://localhost:3000/api/notifications/bulk-read`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ userId: user.id })
                  });
                  loadUserDashboard();
                }}
              >
                Mark All as Read
              </button>
            </div>
            <div className="all-notifications">
              {dashboardData.notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-card ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                  onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                >
                  <div className="notification-header">
                    <h4>{notification.title}</h4>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{notification.message}</p>
                  <div className="notification-footer">
                    <span className={`type-badge ${notification.type}`}>{notification.type}</span>
                    {!notification.read && <span className="unread-indicator">NEW</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'demo' && (
          <div className="demo-tab">
            <h2>Demo Scenarios</h2>
            <p>Try these realistic scenarios to see how the microservices work together:</p>
            
            <div className="demo-scenarios">
              <div className="scenario-card">
                <h3>Sprint Planning</h3>
                <p>Creates a set of tasks for a 2-week sprint with assignments and notifications</p>
                <button onClick={() => createDemoScenario('sprint-planning')}>
                  Create Sprint Tasks
                </button>
              </div>

              <div className="scenario-card">
                <h3>Urgent Bug Fix</h3>
                <p>Simulates an urgent bug report that needs immediate attention</p>
                <button onClick={() => createDemoScenario('urgent-bug-fix')}>
                  Create Bug Report
                </button>
              </div>

              <div className="scenario-card">
                <h3>Feature Release</h3>
                <p>Creates tasks for code review and documentation before feature release</p>
                <button onClick={() => createDemoScenario('feature-release')}>
                  Create Feature Tasks
                </button>
              </div>

              <div className="scenario-card">
                <h3>Initialize All Demos</h3>
                <p>Sets up comprehensive demo data with realistic user scenarios</p>                <button 
                  onClick={async () => {
                    const headers = getAuthHeaders();
                    await fetch('http://localhost:3000/api/notifications/demo/initialize', {
                      method: 'POST',
                      headers
                    });
                    loadUserDashboard();
                  }}
                >
                  Initialize Demo Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
