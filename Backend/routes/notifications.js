const express = require("express");
const router = express.Router();
const { getAllNotifications, markAsRead, getUserNotifications } = require("../utils/notificationHelpers");
const { initializeDemoScenarios, workflowScenarios } = require("../utils/demoScenarios");

// Mock data for demonstration
let notifications = [
  {
    id: 1,
    userId: 1,
    title: "Welcome!",
    message: "Welcome to the backend microservice",
    type: "info",
    read: false,
    createdAt: new Date(),
  },
  {
    id: 2,
    userId: 1,
    title: "Task Assigned",
    message: "You have been assigned a new task: Complete project setup",
    type: "task",
    read: false,
    createdAt: new Date(),
  },
  {
    id: 3,
    userId: 2,
    title: "Task Due Soon",
    message: 'Your task "Implement user authentication" is due in 3 days',
    type: "reminder",
    read: true,
    createdAt: new Date(),
  },
];

// GET /api/notifications - Get all notifications
router.get("/", (req, res) => {
  const { userId, type, read } = req.query;
  let allNotifications = getAllNotifications();
  let filteredNotifications = allNotifications;

  if (userId) {
    filteredNotifications = getUserNotifications(parseInt(userId));
  }

  if (type) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.type === type
    );
  }

  if (read !== undefined) {
    const isRead = read === "true";
    filteredNotifications = filteredNotifications.filter(
      (n) => n.read === isRead
    );
  }

  res.json({
    success: true,
    data: filteredNotifications,
    count: filteredNotifications.length,
  });
});

// GET /api/notifications/:id - Get notification by ID
router.get("/:id", (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notification = notifications.find((n) => n.id === notificationId);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  res.json({
    success: true,
    data: notification,
  });
});

// POST /api/notifications - Create new notification
router.post("/", (req, res) => {
  const { userId, title, message, type = "info" } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({
      success: false,
      message: "UserId, title, and message are required",
    });
  }

  const newNotification = {
    id: notifications.length + 1,
    userId: parseInt(userId),
    title,
    message,
    type,
    read: false,
    createdAt: new Date(),
  };

  notifications.push(newNotification);

  res.status(201).json({
    success: true,
    data: newNotification,
    message: "Notification created successfully",
  });
});

// PUT /api/notifications/:id - Update notification
router.put("/:id", (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notificationIndex = notifications.findIndex(
    (n) => n.id === notificationId
  );

  if (notificationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  const { title, message, type, read } = req.body;

  if (title) notifications[notificationIndex].title = title;
  if (message) notifications[notificationIndex].message = message;
  if (type) notifications[notificationIndex].type = type;
  if (read !== undefined) notifications[notificationIndex].read = read;
  notifications[notificationIndex].updatedAt = new Date();

  res.json({
    success: true,
    data: notifications[notificationIndex],
    message: "Notification updated successfully",
  });
});

// PATCH /api/notifications/:id/read - Mark notification as read/unread
router.patch("/:id/read", (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notificationIndex = notifications.findIndex(
    (n) => n.id === notificationId
  );

  if (notificationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  const { read = true } = req.body;

  notifications[notificationIndex].read = read;
  notifications[notificationIndex].updatedAt = new Date();

  res.json({
    success: true,
    data: notifications[notificationIndex],
    message: `Notification marked as ${read ? "read" : "unread"}`,
  });
});

// DELETE /api/notifications/:id - Delete notification
router.delete("/:id", (req, res) => {
  const notificationId = parseInt(req.params.id);
  const notificationIndex = notifications.findIndex(
    (n) => n.id === notificationId
  );

  if (notificationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  notifications.splice(notificationIndex, 1);

  res.json({
    success: true,
    message: "Notification deleted successfully",
  });
});

// POST /api/notifications/bulk-read - Mark multiple notifications as read
router.post("/bulk-read", (req, res) => {
  const { userId, notificationIds } = req.body;

  if (!userId && !notificationIds) {
    return res.status(400).json({
      success: false,
      message: "Either userId or notificationIds array is required",
    });
  }

  let updatedCount = 0;

  if (userId) {
    // Mark all notifications for a user as read
    notifications.forEach((notification) => {
      if (notification.userId === parseInt(userId) && !notification.read) {
        notification.read = true;
        notification.updatedAt = new Date();
        updatedCount++;
      }
    });
  } else if (notificationIds && Array.isArray(notificationIds)) {
    // Mark specific notifications as read
    notificationIds.forEach((id) => {
      const notificationIndex = notifications.findIndex(
        (n) => n.id === parseInt(id)
      );
      if (notificationIndex !== -1 && !notifications[notificationIndex].read) {
        notifications[notificationIndex].read = true;
        notifications[notificationIndex].updatedAt = new Date();
        updatedCount++;
      }
    });
  }

  res.json({
    success: true,
    message: `${updatedCount} notifications marked as read`,
  });
});

// POST /api/notifications/demo/initialize - Initialize demo scenarios
router.post("/demo/initialize", (req, res) => {
  try {
    initializeDemoScenarios();
    
    res.json({
      success: true,
      message: "Demo scenarios initialized successfully",
      data: {
        scenarios: [
          "User onboarding workflow",
          "Task assignment notifications", 
          "Task completion updates",
          "Overdue task warnings",
          "Due date reminders"
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to initialize demo scenarios",
      error: error.message
    });
  }
});

// POST /api/notifications/demo/workflow - Trigger specific workflow
router.post("/demo/workflow/:workflowType", (req, res) => {
  const { workflowType } = req.params;
  const { userId, taskId, userData } = req.body;
  
  try {
    switch (workflowType) {
      case 'complete-task':
        if (!taskId || !userId) {
          return res.status(400).json({
            success: false,
            message: "taskId and userId are required for complete-task workflow"
          });
        }
        workflowScenarios.completeTaskWorkflow(taskId, userId);
        break;
        
      case 'new-user':
        if (!userData) {
          return res.status(400).json({
            success: false,
            message: "userData is required for new-user workflow"
          });
        }
        workflowScenarios.newUserOnboarding(userData);
        break;
        
      case 'team-collaboration':
        workflowScenarios.teamCollaboration();
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: `Unknown workflow type: ${workflowType}`,
          availableWorkflows: ['complete-task', 'new-user', 'team-collaboration']
        });
    }
    
    res.json({
      success: true,
      message: `${workflowType} workflow triggered successfully`,
      workflow: workflowType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to trigger ${workflowType} workflow`,
      error: error.message
    });
  }
});

// GET /api/notifications/demo/status - Get demo scenario status
router.get("/demo/status", (req, res) => {
  const allNotifications = getAllNotifications();
  const stats = {
    totalNotifications: allNotifications.length,
    notificationTypes: {},
    recentNotifications: allNotifications.slice(-5),
    userStats: {}
  };
  
  // Count notification types
  allNotifications.forEach(notification => {
    stats.notificationTypes[notification.type] = (stats.notificationTypes[notification.type] || 0) + 1;
    
    // Count per user
    stats.userStats[notification.userId] = (stats.userStats[notification.userId] || 0) + 1;
  });
  
  res.json({
    success: true,
    data: stats,
    message: "Demo scenario status retrieved successfully"
  });
});

module.exports = router;
