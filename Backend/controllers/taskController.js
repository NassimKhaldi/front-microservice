const Task = require("../models/Task");
const User = require("../models/User");
const Notification = require("../models/Notification");

class TaskController {
  // Get all tasks with filtering
  static async getAllTasks(req, res) {
    try {
      const { status, priority, assignedTo, page = 1, limit = 10 } = req.query;

      // Build query object
      const query = {};

      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (assignedTo) query.assignedTo = assignedTo;

      // Add pagination
      const offset = (page - 1) * limit;

      // Execute query with pagination
      const tasks = await Task.find(query)
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(parseInt(limit));

      // Get total count for pagination
      const totalTasks = await Task.countDocuments(query);
      const totalPages = Math.ceil(totalTasks / limit);

      res.json({
        success: true,
        message: "Tasks retrieved successfully",
        data: tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalTasks,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving tasks",
        error: error.message,
      });
    }
  }

  // Get task by ID
  static async getTaskById(req, res) {
    try {
      const { id } = req.params;

      const task = await Task.findById(id).populate("assignedTo", "name email");

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        message: "Task retrieved successfully",
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving task",
        error: error.message,
      });
    }
  }

  // Create new task
  static async createTask(req, res) {
    try {
      const { title, description, priority, assignedTo, dueDate } = req.body;

      // Validate required fields
      if (!title || !assignedTo) {
        return res.status(400).json({
          success: false,
          message: "Title and assignedTo are required",
        });
      }

      // Check if assigned user exists
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Assigned user not found",
        });
      }

      // Create task
      const task = new Task({
        title,
        description,
        priority,
        assignedTo,
        dueDate,
      });

      await task.save();
      await task.populate("assignedTo", "name email");

      // Create notification for assigned user
      await Notification.createTaskNotification(
        assignedTo,
        task._id,
        "New Task Assigned",
        `You have been assigned a new task: ${title}`
      );

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating task",
        error: error.message,
      });
    }
  }

  // Update task
  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status, priority, assignedTo, dueDate } =
        req.body;

      // Find existing task
      const existingTask = await Task.findById(id);
      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      // Validate status transition if status is being updated
      if (status && status !== existingTask.status) {
        if (!Task.isValidStatusTransition(existingTask.status, status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status transition from ${existingTask.status} to ${status}`,
          });
        }
      }

      // Check if assigned user exists (if being updated)
      if (assignedTo && assignedTo !== existingTask.assignedTo.toString()) {
        const user = await User.findById(assignedTo);
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "Assigned user not found",
          });
        }
      }

      // Update task
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, status, priority, assignedTo, dueDate },
        { new: true, runValidators: true }
      ).populate("assignedTo", "name email");

      // Create notification for status changes
      if (status && status !== existingTask.status) {
        let notificationMessage = "";
        switch (status) {
          case "completed":
            notificationMessage = `Task completed: ${updatedTask.title}`;
            break;
          case "in-progress":
            notificationMessage = `Task started: ${updatedTask.title}`;
            break;
          case "cancelled":
            notificationMessage = `Task cancelled: ${updatedTask.title}`;
            break;
        }

        if (notificationMessage) {
          await Notification.createTaskNotification(
            updatedTask.assignedTo._id,
            updatedTask._id,
            "Task Status Updated",
            notificationMessage
          );
        }
      }

      res.json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating task",
        error: error.message,
      });
    }
  }

  // Delete task
  static async deleteTask(req, res) {
    try {
      const { id } = req.params;

      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      // Delete related notifications
      await Notification.deleteMany({ relatedTask: id });

      res.json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting task",
        error: error.message,
      });
    }
  }

  // Get tasks by user
  static async getTasksByUser(req, res) {
    try {
      const { userId } = req.params;
      const { status, priority } = req.query;

      // Build query
      const query = { assignedTo: userId };
      if (status) query.status = status;
      if (priority) query.priority = priority;

      const tasks = await Task.find(query)
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: "User tasks retrieved successfully",
        data: tasks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving user tasks",
        error: error.message,
      });
    }
  }

  // Get task statistics
  static async getTaskStats(req, res) {
    try {
      const stats = await Task.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const priorityStats = await Task.aggregate([
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({
        success: true,
        message: "Task statistics retrieved successfully",
        data: {
          statusStats: stats,
          priorityStats: priorityStats,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving task statistics",
        error: error.message,
      });
    }
  }
}

module.exports = TaskController;
