import React from "react";

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff4757";
      case "medium":
        return "#ffa502";
      case "low":
        return "#2ed573";
      default:
        return "#747d8c";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#2ed573";
      case "in-progress":
        return "#3742fa";
      case "pending":
        return "#ffa502";
      default:
        return "#747d8c";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString();
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-grid">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEdit(task)}
                  title="Edit task"
                >
                  ✏️
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(task._id)}
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="task-description">{task.description}</p>

            <div className="task-meta">
              <div className="task-priority">
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </div>

              <div className="task-due-date">
                <span className="due-date">📅 {formatDate(task.dueDate)}</span>
              </div>
            </div>

            <div className="task-status">
              <label htmlFor={`status-${task._id}`}>Status:</label>
              <select
                id={`status-${task._id}`}
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
                style={{ color: getStatusColor(task.status) }}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="task-footer">
              <small className="task-created">
                Created: {formatDate(task.createdAt)}
              </small>
              {task.assignedTo && (
                <small className="task-assigned">
                  Assigned to: {task.assignedTo.name}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
