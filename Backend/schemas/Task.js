const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be assigned to a user"],
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (date) {
          return !date || date > new Date();
        },
        message: "Due date cannot be in the past",
      },
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
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

// Static methods for validation and business logic
taskSchema.statics.getValidStatuses = function () {
  return ["pending", "in-progress", "completed", "cancelled"];
};

taskSchema.statics.getValidPriorities = function () {
  return ["low", "medium", "high", "urgent"];
};

taskSchema.statics.getPriorityWeight = function (priority) {
  const weights = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };
  return weights[priority] || 2;
};

taskSchema.statics.isValidStatusTransition = function (
  currentStatus,
  newStatus
) {
  const transitions = {
    pending: ["in-progress", "cancelled"],
    "in-progress": ["completed", "cancelled", "pending"],
    completed: [],
    cancelled: ["pending"],
  };
  return transitions[currentStatus]?.includes(newStatus) || false;
};

// Instance methods
taskSchema.methods.canTransitionTo = function (newStatus) {
  return this.constructor.isValidStatusTransition(this.status, newStatus);
};

module.exports = mongoose.model("Task", taskSchema);
