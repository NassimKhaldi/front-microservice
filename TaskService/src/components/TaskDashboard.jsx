import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import "./TaskDashboard.css";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      setTasks(response.data || []);
      setError("");
    } catch (error) {
      setError(error.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      setTasks([...tasks, response.data]);
      setShowForm(false);
      setError("");
    } catch (error) {
      setError(error.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await taskService.updateTask(editingTask._id, taskData);
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? response.data : task
        )
      );
      setEditingTask(null);
      setShowForm(false);
      setError("");
    } catch (error) {
      setError(error.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      setError("");
    } catch (error) {
      setError(error.message || "Failed to delete task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskService.updateTaskStatus(taskId, newStatus);
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setError("");
    } catch (error) {
      setError(error.message || "Failed to update task status");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="task-dashboard">
      <div className="dashboard-header">
        <h1>Task Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Create New Task
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchTasks} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelEdit}
          isEditing={!!editingTask}
        />
      )}

      <div className="task-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <span className="stat-number">{tasks.length}</span>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <span className="stat-number">
            {tasks.filter((task) => task.status === "pending").length}
          </span>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <span className="stat-number">
            {tasks.filter((task) => task.status === "in-progress").length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <span className="stat-number">
            {tasks.filter((task) => task.status === "completed").length}
          </span>
        </div>
      </div>

      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default TaskDashboard;
