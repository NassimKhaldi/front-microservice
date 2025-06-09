const express = require("express");
const router = express.Router();
const { getAllNotifications, getUserNotifications } = require("../utils/notificationHelpers");

// GET /api/dashboard/stats - Get cross-service statistics
router.get("/stats", (req, res) => {
  try {
    // This would normally come from database queries
    const tasks = require("../routes/tasks"); // Get tasks from tasks route
    const notifications = getAllNotifications();
    
    // Calculate basic stats
    const stats = {
      overview: {
        totalTasks: 0, // Would be calculated from actual tasks
        totalNotifications: notifications.length,
        activeUsers: 4, // Demo value
        completedTasksToday: 0
      },
      tasksByStatus: {
        pending: 0,
        'in-progress': 0,
        completed: 0,
        overdue: 0
      },
      notificationsByType: {},
      userActivity: {},
      recentActivity: []
    };
    
    // Count notifications by type
    notifications.forEach(notification => {
      const type = notification.type || 'other';
      stats.notificationsByType[type] = (stats.notificationsByType[type] || 0) + 1;
      
      // Count user activity
      const userId = notification.userId;
      if (!stats.userActivity[userId]) {
        stats.userActivity[userId] = {
          notifications: 0,
          lastActive: notification.createdAt
        };
      }
      stats.userActivity[userId].notifications++;
      
      // Update last active time
      if (new Date(notification.createdAt) > new Date(stats.userActivity[userId].lastActive)) {
        stats.userActivity[userId].lastActive = notification.createdAt;
      }
    });
    
    // Get recent activity (last 10 notifications)
    stats.recentActivity = notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        userId: notification.userId,
        createdAt: notification.createdAt,
        read: notification.read
      }));
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard stats",
      error: error.message
    });
  }
});

// GET /api/dashboard/user/:userId - Get user-specific dashboard
router.get("/user/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  
  try {
    const userNotifications = getUserNotifications(userId);
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    const userStats = {
      userId: userId,
      notifications: {
        total: userNotifications.length,
        unread: unreadCount,
        byType: {}
      },
      tasks: {
        assigned: 0, // Would be calculated from tasks
        completed: 0,
        overdue: 0
      },
      recentNotifications: userNotifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };
    
    // Count notifications by type for this user
    userNotifications.forEach(notification => {
      const type = notification.type || 'other';
      userStats.notifications.byType[type] = (userStats.notifications.byType[type] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: userStats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user dashboard",
      error: error.message
    });
  }
});

// POST /api/dashboard/demo/activity - Simulate user activity
router.post("/demo/activity", (req, res) => {
  const { userId, activityType, metadata } = req.body;
  
  try {
    const activities = [];
    
    switch (activityType) {
      case 'login':
        activities.push({
          type: 'user_login',
          userId: userId,
          timestamp: new Date(),
          details: 'User logged into the system'
        });
        break;
        
      case 'task_interaction':
        activities.push({
          type: 'task_viewed',
          userId: userId,
          timestamp: new Date(),
          details: `User viewed task: ${metadata?.taskTitle || 'Unknown Task'}`
        });
        break;
        
      case 'notification_read':
        activities.push({
          type: 'notification_read',
          userId: userId,
          timestamp: new Date(),
          details: 'User read notifications'
        });
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid activity type',
          validTypes: ['login', 'task_interaction', 'notification_read']
        });
    }
    
    res.json({
      success: true,
      message: 'Activity simulated successfully',
      data: activities
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to simulate activity',
      error: error.message
    });
  }
});

module.exports = router;
