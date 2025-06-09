// Notification helper functions for cross-service communication

// Import the notifications data (this would typically be from a shared database)
const fs = require('fs');
const path = require('path');

// For demo purposes, we'll read/write to the notifications route data
let notifications = [];

// Load notifications from the route file (simplified for demo)
const loadNotifications = () => {
  try {
    // In a real app, this would be from a database
    // For now, we'll maintain a simple array
    return notifications;
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};

// Save notification (in real app, this would save to database)
const saveNotification = (notification) => {
  notifications.push({
    id: notifications.length + 1,
    ...notification,
    createdAt: new Date(),
    read: false
  });
  return notifications[notifications.length - 1];
};

// Create task-related notifications
const createTaskNotification = (type, taskData, userId) => {
  let title, message, notificationType;

  switch (type) {
    case 'TASK_CREATED':
      title = 'New Task Created';
      message = `Task "${taskData.title}" has been created`;
      notificationType = 'task';
      break;
    
    case 'TASK_ASSIGNED':
      title = 'Task Assigned';
      message = `You have been assigned to task: "${taskData.title}"`;
      notificationType = 'task';
      break;
    
    case 'TASK_COMPLETED':
      title = 'Task Completed';
      message = `Task "${taskData.title}" has been marked as completed`;
      notificationType = 'success';
      break;
    
    case 'TASK_DUE_SOON':
      title = 'Task Due Soon';
      message = `Task "${taskData.title}" is due in 24 hours`;
      notificationType = 'reminder';
      break;
    
    case 'TASK_OVERDUE':
      title = 'Task Overdue';
      message = `Task "${taskData.title}" is overdue`;
      notificationType = 'warning';
      break;
    
    case 'TASK_STATUS_CHANGED':
      title = 'Task Status Updated';
      message = `Task "${taskData.title}" status changed to ${taskData.status}`;
      notificationType = 'info';
      break;
    
    default:
      title = 'Task Update';
      message = `Task "${taskData.title}" has been updated`;
      notificationType = 'info';
  }

  return saveNotification({
    userId: userId,
    title: title,
    message: message,
    type: notificationType,
    taskId: taskData.id,
    metadata: {
      taskTitle: taskData.title,
      taskStatus: taskData.status,
      taskPriority: taskData.priority
    }
  });
};

// Create user-related notifications
const createUserNotification = (type, userData, targetUserId) => {
  let title, message, notificationType;

  switch (type) {
    case 'USER_REGISTERED':
      title = 'Welcome to the Platform!';
      message = `Welcome ${userData.name}! Your account has been successfully created.`;
      notificationType = 'welcome';
      break;
    
    case 'USER_LOGIN':
      title = 'Login Successful';
      message = 'You have successfully logged into your account.';
      notificationType = 'info';
      break;
    
    case 'PROFILE_UPDATED':
      title = 'Profile Updated';
      message = 'Your profile information has been updated successfully.';
      notificationType = 'success';
      break;
    
    default:
      title = 'Account Update';
      message = 'Your account has been updated.';
      notificationType = 'info';
  }

  return saveNotification({
    userId: targetUserId,
    title: title,
    message: message,
    type: notificationType,
    metadata: {
      userName: userData.name || userData.email
    }
  });
};

// Get all notifications (to be used by the notifications route)
const getAllNotifications = () => {
  return notifications;
};

// Mark notification as read
const markAsRead = (notificationId) => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return notification;
  }
  return null;
};

// Get notifications for a specific user
const getUserNotifications = (userId) => {
  return notifications.filter(n => n.userId === userId);
};

module.exports = {
  createTaskNotification,
  createUserNotification,
  getAllNotifications,
  markAsRead,
  getUserNotifications,
  loadNotifications,
  saveNotification
};
