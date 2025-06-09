import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/tasks";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await apiClient.get("/");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch tasks" };
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch task" };
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post("/", taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create task" };
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      const response = await apiClient.put(`/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update task" };
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete task" };
    }
  },

  // Get tasks by user
  getTasksByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user tasks" };
    }
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update task status" };
    }
  },
};
