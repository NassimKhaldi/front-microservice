const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/database");
require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : [
          "http://localhost:5000",
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5175",
          "http://localhost:4200",
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const notificationRoutes = require("./routes/notifications");
const dashboardRoutes = require("./routes/dashboard");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Backend Microservice",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend Microservice API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      tasks: "/api/tasks",
      notifications: "/api/notifications",
      health: "/health",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.originalUrl} does not exist`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend Microservice running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API endpoints: http://localhost:${PORT}/`);
});

module.exports = app;
