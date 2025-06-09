// Demo scenarios and seed data for microservices integration
const { createTaskNotification, createUserNotification } = require('./notificationHelpers');

// Demo users data (would be in database)
const demoUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@company.com",
    role: "Project Manager",
    department: "Engineering"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@company.com", 
    role: "Senior Developer",
    department: "Engineering"
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@company.com",
    role: "UI/UX Designer", 
    department: "Design"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@company.com",
    role: "QA Engineer",
    department: "Quality Assurance"
  }
];

// Demo tasks with realistic scenarios
const demoTasks = [
  {
    id: 1,
    title: "Design new user dashboard",
    description: "Create wireframes and mockups for the new user dashboard interface",
    status: "in-progress",
    priority: "high",
    assignedTo: 3, // Carol (Designer)
    createdBy: 1, // Alice (PM)
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    tags: ["design", "frontend", "dashboard"],
    estimatedHours: 16
  },
  {
    id: 2,
    title: "Implement user authentication API",
    description: "Develop JWT-based authentication system with refresh tokens",
    status: "completed",
    priority: "high",
    assignedTo: 2, // Bob (Developer)
    createdBy: 1, // Alice (PM)
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    tags: ["backend", "security", "api"],
    estimatedHours: 24,
    actualHours: 20
  },
  {
    id: 3,
    title: "Write unit tests for task service",
    description: "Create comprehensive unit tests for all task service endpoints",
    status: "pending",
    priority: "medium",
    assignedTo: 4, // David (QA)
    createdBy: 2, // Bob (Developer)
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    tags: ["testing", "backend", "quality"],
    estimatedHours: 12
  },
  {
    id: 4,
    title: "Setup CI/CD pipeline",
    description: "Configure automated deployment pipeline for all microservices",
    status: "pending",
    priority: "low",
    assignedTo: 2, // Bob (Developer)
    createdBy: 1, // Alice (PM)
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    tags: ["devops", "automation", "deployment"],
    estimatedHours: 20
  },
  {
    id: 5,
    title: "Performance optimization review",
    description: "Analyze and optimize database queries and API response times",
    status: "overdue",
    priority: "high",
    assignedTo: 2, // Bob (Developer)
    createdBy: 1, // Alice (PM)
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (overdue)
    tags: ["performance", "optimization", "database"],
    estimatedHours: 16
  }
];

// Create realistic notification scenarios
const initializeDemoScenarios = () => {
  console.log('🎭 Initializing demo scenarios...');

  // Scenario 1: New user onboarding workflow
  demoUsers.forEach(user => {
    createUserNotification('USER_REGISTERED', user, user.id);
  });

  // Scenario 2: Task assignment notifications
  demoTasks.forEach(task => {
    if (task.assignedTo) {
      createTaskNotification('TASK_ASSIGNED', task, task.assignedTo);
    }
  });

  // Scenario 3: Task completion notifications  
  const completedTasks = demoTasks.filter(task => task.status === 'completed');
  completedTasks.forEach(task => {
    createTaskNotification('TASK_COMPLETED', task, task.createdBy);
    createTaskNotification('TASK_COMPLETED', task, task.assignedTo);
  });

  // Scenario 4: Overdue task warnings
  const overdueTasks = demoTasks.filter(task => task.status === 'overdue');
  overdueTasks.forEach(task => {
    createTaskNotification('TASK_OVERDUE', task, task.assignedTo);
    createTaskNotification('TASK_OVERDUE', task, task.createdBy);
  });

  // Scenario 5: Tasks due soon reminders
  const tasksDueSoon = demoTasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    const daysUntilDue = (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntilDue <= 2 && daysUntilDue > 0;
  });
  
  tasksDueSoon.forEach(task => {
    createTaskNotification('TASK_DUE_SOON', task, task.assignedTo);
  });

  // Scenario 6: Project milestone notifications
  createTaskNotification('TASK_CREATED', {
    id: 999,
    title: "Project Kickoff Meeting",
    status: "pending",
    priority: "high"
  }, 1); // Notify Alice (PM)

  console.log('✅ Demo scenarios initialized successfully!');
};

// Workflow scenarios for testing integration
const workflowScenarios = {
  // Scenario: Complete task workflow
  completeTaskWorkflow: (taskId, userId) => {
    console.log(`🔄 Starting complete task workflow for task ${taskId}`);
    
    // Step 1: User starts working on task
    createTaskNotification('TASK_STATUS_CHANGED', {
      id: taskId,
      title: "Sample Task",
      status: "in-progress",
      priority: "medium"
    }, userId);

    // Step 2: Task completed
    setTimeout(() => {
      createTaskNotification('TASK_COMPLETED', {
        id: taskId,
        title: "Sample Task",
        status: "completed", 
        priority: "medium"
      }, userId);
    }, 2000);
  },

  // Scenario: New user onboarding
  newUserOnboarding: (userData) => {
    console.log(`👋 Starting onboarding for ${userData.name}`);
    
    // Welcome notification
    createUserNotification('USER_REGISTERED', userData, userData.id);
    
    // Assign first task after welcome
    setTimeout(() => {
      createTaskNotification('TASK_ASSIGNED', {
        id: 1001,
        title: "Complete your profile setup",
        status: "pending",
        priority: "medium"
      }, userData.id);
    }, 1000);
  },

  // Scenario: Team collaboration
  teamCollaboration: () => {
    console.log('👥 Starting team collaboration scenario');
    
    // Alice assigns task to Bob
    createTaskNotification('TASK_ASSIGNED', {
      id: 1002,
      title: "Review pull request #42",
      status: "pending",
      priority: "high"
    }, 2); // Bob

    // Bob completes the task
    setTimeout(() => {
      createTaskNotification('TASK_COMPLETED', {
        id: 1002,
        title: "Review pull request #42",
        status: "completed",
        priority: "high"
      }, 1); // Notify Alice
    }, 3000);
  }
};

module.exports = {
  demoUsers,
  demoTasks,
  initializeDemoScenarios,
  workflowScenarios
};
