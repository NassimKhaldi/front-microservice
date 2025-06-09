const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success", "task", "reminder"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
notificationSchema.index({ userId: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

// Static methods
notificationSchema.statics.getValidTypes = function () {
  return ["info", "warning", "error", "success", "task", "reminder"];
};

notificationSchema.statics.getTypeStyles = function () {
  return {
    info: { color: "blue", icon: "info" },
    warning: { color: "orange", icon: "warning" },
    error: { color: "red", icon: "error" },
    success: { color: "green", icon: "check" },
    task: { color: "purple", icon: "task" },
    reminder: { color: "yellow", icon: "clock" },
  };
};

// Instance methods
notificationSchema.methods.markAsRead = function () {
  this.read = true;
  return this.save();
};

notificationSchema.methods.getStyleForType = function () {
  const styles = this.constructor.getTypeStyles();
  return styles[this.type] || styles["info"];
};

// Static method to create task-related notifications
notificationSchema.statics.createTaskNotification = function (
  userId,
  taskId,
  title,
  message,
  type = "task"
) {
  return this.create({
    userId,
    title,
    message,
    type,
    relatedTask: taskId,
  });
};

module.exports = mongoose.model("Notification", notificationSchema);
