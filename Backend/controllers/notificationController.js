const Notification = require("../models/Notification");
const User = require("../models/User");

class NotificationController {
  // Get all notifications with filtering
  static async getAllNotifications(req, res) {
    try {
      const { userId, type, read, page = 1, limit = 20 } = req.query;

      // Build query object
      const query = {};

      if (userId) query.userId = userId;
      if (type) query.type = type;
      if (read !== undefined) query.read = read === "true";

      // Add pagination
      const offset = (page - 1) * limit;

      // Execute query with pagination
      const notifications = await Notification.find(query)
        .populate("userId", "name email")
        .populate("relatedTask", "title status")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalNotifications = await Notification.countDocuments(query);
      const totalPages = Math.ceil(totalNotifications / limit);

      res.json({
        success: true,
        message: "Notifications retrieved successfully",
        data: notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalNotifications,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving notifications",
        error: error.message,
      });
    }
  }

  // Get notifications for a specific user
  static async getUserNotifications(req, res) {
    try {
      const { userId } = req.params;
      const { type, read, limit = 20 } = req.query;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Build query
      const query = { userId };
      if (type) query.type = type;
      if (read !== undefined) query.read = read === "true";

      const notifications = await Notification.find(query)
        .populate("relatedTask", "title status")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      // Count unread notifications
      const unreadCount = await Notification.countDocuments({
        userId,
        read: false,
      });

      res.json({
        success: true,
        message: "User notifications retrieved successfully",
        data: notifications,
        unreadCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving user notifications",
        error: error.message,
      });
    }
  }

  // Get notification by ID
  static async getNotificationById(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findById(id)
        .populate("userId", "name email")
        .populate("relatedTask", "title status");

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.json({
        success: true,
        message: "Notification retrieved successfully",
        data: notification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving notification",
        error: error.message,
      });
    }
  }

  // Create new notification
  static async createNotification(req, res) {
    try {
      const { userId, title, message, type, relatedTask } = req.body;

      // Validate required fields
      if (!userId || !title || !message) {
        return res.status(400).json({
          success: false,
          message: "UserId, title, and message are required",
        });
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      // Create notification
      const notification = new Notification({
        userId,
        title,
        message,
        type: type || "info",
        relatedTask,
      });

      await notification.save();
      await notification.populate("userId", "name email");
      if (relatedTask) {
        await notification.populate("relatedTask", "title status");
      }

      res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: notification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating notification",
        error: error.message,
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      )
        .populate("userId", "name email")
        .populate("relatedTask", "title status");

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error marking notification as read",
        error: error.message,
      });
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(req, res) {
    try {
      const { userId } = req.params;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
      );

      res.json({
        success: true,
        message: "All notifications marked as read",
        data: {
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error marking notifications as read",
        error: error.message,
      });
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByIdAndDelete(id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting notification",
        error: error.message,
      });
    }
  }

  // Delete all notifications for a user
  static async deleteAllUserNotifications(req, res) {
    try {
      const { userId } = req.params;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const result = await Notification.deleteMany({ userId });

      res.json({
        success: true,
        message: "All user notifications deleted successfully",
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting user notifications",
        error: error.message,
      });
    }
  }

  // Get notification statistics
  static async getNotificationStats(req, res) {
    try {
      const { userId } = req.query;

      let matchStage = {};
      if (userId)
        matchStage.userId = new require("mongoose").Types.ObjectId(userId);

      const stats = await Notification.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            unreadCount: {
              $sum: {
                $cond: [{ $eq: ["$read", false] }, 1, 0],
              },
            },
          },
        },
      ]);

      const totalStats = await Notification.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: {
              $sum: {
                $cond: [{ $eq: ["$read", false] }, 1, 0],
              },
            },
          },
        },
      ]);

      res.json({
        success: true,
        message: "Notification statistics retrieved successfully",
        data: {
          typeStats: stats,
          totalStats: totalStats[0] || { total: 0, unread: 0 },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving notification statistics",
        error: error.message,
      });
    }
  }
}

module.exports = NotificationController;
