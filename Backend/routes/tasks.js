const express = require("express");
const router = express.Router();
const { createTaskNotification } = require("../utils/notificationHelpers");

// Mock data for demonstration
let tasks = [
  {
    id: 1,
    title: "Complete project setup",
    description: "Set up the backend microservice structure",
    status: "completed",
    priority: "high",
    assignedTo: 1,
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: 2,
    title: "Implement user authentication",
    description: "Add JWT authentication for users",
    status: "in-progress",
    priority: "medium",
    assignedTo: 2,
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  },
];

// GET /api/tasks - Get all tasks
router.get("/", (req, res) => {
  const { status, priority, assignedTo } = req.query;
  let filteredTasks = tasks;

  if (status) {
    filteredTasks = filteredTasks.filter((task) => task.status === status);
  }

  if (priority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === priority);
  }

  if (assignedTo) {
    filteredTasks = filteredTasks.filter(
      (task) => task.assignedTo === parseInt(assignedTo)
    );
  }

  res.json({
    success: true,
    data: filteredTasks,
    count: filteredTasks.length,
  });
});

// GET /api/tasks/:id - Get task by ID
router.get("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.json({
    success: true,
    data: task,
  });
});

// POST /api/tasks - Create new task
router.post("/", (req, res) => {
  const {
    title,
    description,
    priority = "medium",
    assignedTo,
    dueDate,
  } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description: description || "",
    status: "pending",
    priority,
    assignedTo: assignedTo || null,
    createdAt: new Date(),
    dueDate: dueDate ? new Date(dueDate) : null,
  };
  tasks.push(newTask);

  // Create notification for task creation
  createTaskNotification('TASK_CREATED', newTask, newTask.assignedTo || 1);
  
  // If task is assigned to someone, create assignment notification
  if (newTask.assignedTo) {
    createTaskNotification('TASK_ASSIGNED', newTask, newTask.assignedTo);
  }

  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully",
  });
});

// PUT /api/tasks/:id - Update task
router.put("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }
  const { title, description, status, priority, assignedTo, dueDate } =
    req.body;

  const originalTask = { ...tasks[taskIndex] };

  if (title) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;
  if (status) tasks[taskIndex].status = status;
  if (priority) tasks[taskIndex].priority = priority;
  if (assignedTo !== undefined) tasks[taskIndex].assignedTo = assignedTo;
  if (dueDate) tasks[taskIndex].dueDate = new Date(dueDate);
  tasks[taskIndex].updatedAt = new Date();

  const updatedTask = tasks[taskIndex];

  // Create notifications for task updates
  if (status && status !== originalTask.status) {
    createTaskNotification('TASK_STATUS_CHANGED', updatedTask, updatedTask.assignedTo || 1);
    
    if (status === 'completed') {
      createTaskNotification('TASK_COMPLETED', updatedTask, updatedTask.assignedTo || 1);
    }
  }

  // If task was reassigned, notify the new assignee
  if (assignedTo && assignedTo !== originalTask.assignedTo) {
    createTaskNotification('TASK_ASSIGNED', updatedTask, assignedTo);
  }

  res.json({
    success: true,
    data: updatedTask,
    message: "Task updated successfully",
  });
});

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  tasks.splice(taskIndex, 1);

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});

// PATCH /api/tasks/:id/status - Update task status
router.patch("/:id/status", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date();

  res.json({
    success: true,
    data: tasks[taskIndex],
    message: "Task status updated successfully",
  });
});

// POST /api/tasks/demo/create-scenario - Create realistic task scenarios
router.post("/demo/create-scenario", (req, res) => {
  const { scenario } = req.body;
  
  try {
    let newTasks = [];
    
    switch (scenario) {
      case 'sprint-planning':
        // Create a set of tasks for a 2-week sprint
        const sprintTasks = [
          {
            id: tasks.length + 1,
            title: "Sprint Planning Meeting",
            description: "Plan tasks for the upcoming 2-week sprint",
            status: "completed",
            priority: "high",
            assignedTo: 1,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            tags: ["planning", "meeting"],
            estimatedHours: 2
          },
          {
            id: tasks.length + 2,
            title: "Implement user profile page",
            description: "Create responsive user profile page with edit functionality",
            status: "in-progress",
            priority: "high",
            assignedTo: 2,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            tags: ["frontend", "user-interface"],
            estimatedHours: 12
          },
          {
            id: tasks.length + 3,
            title: "Database migration for notifications",
            description: "Update notification schema to support rich content",
            status: "pending",
            priority: "medium",
            assignedTo: 2,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            tags: ["backend", "database"],
            estimatedHours: 8
          }
        ];
        
        sprintTasks.forEach(task => {
          tasks.push(task);
          createTaskNotification('TASK_CREATED', task, task.assignedTo);
          if (task.assignedTo !== 1) {
            createTaskNotification('TASK_ASSIGNED', task, task.assignedTo);
          }
        });
        newTasks = sprintTasks;
        break;
        
      case 'urgent-bug-fix':
        // Create urgent bug fix scenario
        const bugTask = {
          id: tasks.length + 1,
          title: "URGENT: Fix login authentication bug",
          description: "Users unable to login after recent security update",
          status: "pending",
          priority: "critical",
          assignedTo: 2,
          createdAt: new Date(),
          dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
          tags: ["bug", "security", "urgent"],
          estimatedHours: 3
        };
        
        tasks.push(bugTask);
        createTaskNotification('TASK_CREATED', bugTask, bugTask.assignedTo);
        createTaskNotification('TASK_ASSIGNED', bugTask, bugTask.assignedTo);
        newTasks = [bugTask];
        break;
        
      case 'feature-release':
        // Create feature release workflow
        const featureTasks = [
          {
            id: tasks.length + 1,
            title: "Code review for notification system",
            description: "Review pull request for new notification features",
            status: "pending",
            priority: "high",
            assignedTo: 1,
            createdAt: new Date(),
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            tags: ["review", "feature"],
            estimatedHours: 4
          },
          {
            id: tasks.length + 2,
            title: "Update documentation",
            description: "Document new notification API endpoints",
            status: "pending",
            priority: "medium",
            assignedTo: 3,
            createdAt: new Date(),
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            tags: ["documentation", "api"],
            estimatedHours: 6
          }
        ];
        
        featureTasks.forEach(task => {
          tasks.push(task);
          createTaskNotification('TASK_CREATED', task, task.assignedTo);
          createTaskNotification('TASK_ASSIGNED', task, task.assignedTo);
        });
        newTasks = featureTasks;
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: `Unknown scenario: ${scenario}`,
          availableScenarios: ['sprint-planning', 'urgent-bug-fix', 'feature-release']
        });
    }
    
    res.status(201).json({
      success: true,
      message: `${scenario} scenario created successfully`,
      data: newTasks,
      scenario: scenario
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create scenario",
      error: error.message
    });
  }
});

// PUT /api/tasks/:id/assign - Reassign task to different user
router.put("/:id/assign", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { assignedTo, reason } = req.body;
  
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }
  
  if (!assignedTo) {
    return res.status(400).json({
      success: false,
      message: "assignedTo is required",
    });
  }
  
  const oldAssignee = tasks[taskIndex].assignedTo;
  tasks[taskIndex].assignedTo = assignedTo;
  tasks[taskIndex].updatedAt = new Date();
  
  // Create notifications for reassignment
  createTaskNotification('TASK_ASSIGNED', tasks[taskIndex], assignedTo);
  
  // Notify old assignee if different
  if (oldAssignee && oldAssignee !== assignedTo) {
    createTaskNotification('TASK_STATUS_CHANGED', {
      ...tasks[taskIndex],
      title: `Task "${tasks[taskIndex].title}" reassigned`,
      status: 'reassigned'
    }, oldAssignee);
  }
  
  res.json({
    success: true,
    data: tasks[taskIndex],
    message: `Task reassigned successfully${reason ? ': ' + reason : ''}`,
  });
});

module.exports = router;
