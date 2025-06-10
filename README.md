# Task Management Platform - Microservice Architecture

A modern task management platform built using microservice architecture with React, Angular, and Node.js, demonstrating micro-frontend integration and service orchestration.

## 🏗️ Architecture Overview

This project demonstrates a **microservice architecture** with **micro-frontend** integration, where each service is independently developed, deployed, and maintained while working together as a cohesive application.

### Architecture Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                    MicroserviceShell                         │
│                 (Main Application Shell)                     │
│                     React + Vite                             │
│                      Port: 5000                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────────────────────────────┐
    │             │                                     │
    ▼             ▼                                     ▼
┌─────────┐  ┌─────────┐  ┌─────────────────┐  ┌─────────────┐
│  User   │  │  Task   │  │  Notifications  │  │   Backend   │
│Service  │  │Service  │  │    Service      │  │   Service   │
│(React)  │  │(React)  │  │   (Angular)     │  │ (Node.js)   │
│Port:5173│  │Port:5174│  │   Port: 4200    │  │ Port: 3000  │
└─────────┘  └─────────┘  └─────────────────┘  └─────────────┘
```

## 🚀 Services Overview

### 1. **MicroserviceShell** (Application Shell)
- **Technology**: React 19 + Vite
- **Port**: 5000
- **Purpose**: Main application shell that orchestrates all micro-frontends
- **Key Features**:
  - Authentication management
  - Service discovery and routing
  - Micro-frontend loader with iframe integration
  - Global state management
  - Protected routing
  - Service status monitoring

### 2. **UserService** (User Management)
- **Technology**: React 19 + Bootstrap + Vite
- **Port**: 5173 (development)
- **Purpose**: Handles user authentication, registration, and profile management
- **Key Features**:
  - User registration and login
  - Password validation and security
  - Profile management
  - JWT token handling
  - Responsive UI with Bootstrap styling

### 3. **TaskService** (Task Management)
- **Technology**: React 19 + Vite
- **Port**: 5174 (development)
- **Purpose**: Manages task creation, editing, and organization
- **Key Features**:
  - Task CRUD operations
  - Task categorization and filtering
  - Task status management
  - User-specific task views

### 4. **NotificationsService** (Notification System)
- **Technology**: Angular 16 + Bootstrap
- **Port**: 4200 (development)
- **Purpose**: Handles real-time notifications and alerts
- **Key Features**:
  - Real-time notification dashboard
  - Notification history
  - User preference management
  - Cross-service notification integration

### 5. **Backend** (API Gateway & Data Layer)
- **Technology**: Node.js + Express + MongoDB
- **Port**: 3000
- **Purpose**: Centralized API and database management
- **Key Features**:
  - RESTful API endpoints
  - JWT authentication middleware
  - MongoDB integration with Mongoose
  - CORS configuration for micro-frontends
  - Data validation and sanitization

## 🔧 Technology Stack

### Frontend Technologies
- **React 19**: Modern React with hooks and concurrent features
- **Angular 16**: Component-based architecture with TypeScript
- **Vite**: Fast build tool and development server
- **Bootstrap 5**: Responsive UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

### Backend Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
miniprojet microservice/
├── Backend/                          # Node.js API Server
│   ├── config/                       # Database configuration
│   ├── controllers/                  # API route handlers
│   ├── middleware/                   # Authentication & validation
│   ├── models/                       # MongoDB models
│   ├── routes/                       # API endpoints
│   ├── schemas/                      # Data validation schemas
│   └── utils/                        # Helper functions
├── MicroserviceShell/                # Main Application Shell
│   ├── src/
│   │   ├── components/
│   │   │   ├── MicroFrontendLoader.jsx  # Iframe-based micro-frontend loader
│   │   │   ├── ProtectedRoute.jsx       # Route protection
│   │   │   └── UserDashboard.jsx        # Main dashboard
│   │   └── context/
│   │       └── AuthContext.jsx          # Global authentication state
├── UserService/                      # User Management Micro-frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── Profile.jsx
│   │   └── context/
│   │       └── AuthContext.jsx
├── TaskService/                      # Task Management Micro-frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskDashboard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   └── services/
│   │       └── taskService.js
└── NotificationsService/             # Notifications Micro-frontend (Angular)
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   └── notification-dashboard/
    │   │   └── services/
    │   │       └── auth.service.ts
    └── angular.json
```

## 🔄 Communication Flow

### 1. **Authentication Flow**
```
User → UserService → Backend API → JWT Token → MicroserviceShell → All Services
```

### 2. **Inter-Service Communication**
- **Frontend-to-Backend**: REST API calls via Axios
- **Service-to-Service**: Event-driven communication through the shell
- **State Management**: Shared through localStorage and context providers

### 3. **Micro-Frontend Integration**
- **Iframe-based**: Each service runs independently and is loaded via iframes
- **Authentication Sharing**: JWT tokens passed between services
- **Event Communication**: PostMessage API for cross-iframe communication

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local or Atlas)
- Angular CLI (for NotificationsService)

### 1. Clone the Repository
```powershell
git clone <repository-url>
cd "miniprojet microservice"
```

### 2. Setup Backend Service
```powershell
cd Backend
npm install
# Create .env file with your MongoDB connection string
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/taskmanagement
# JWT_SECRET=your-secret-key
npm run dev
```

### 3. Setup MicroserviceShell (Main App)
```powershell
cd MicroserviceShell
npm install
npm run dev
```

### 4. Setup UserService
```powershell
cd UserService
npm install
npm run dev
```

### 5. Setup TaskService
```powershell
cd TaskService
npm install
npm run dev
```

### 6. Setup NotificationsService
```powershell
cd NotificationsService
npm install
ng serve
```

## 🌐 Service Endpoints

### Backend API (Port 3000)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/notifications` - Get notifications

### Frontend Services
- **Main Shell**: http://localhost:5000
- **User Service**: http://localhost:5173
- **Task Service**: http://localhost:5174
- **Notifications**: http://localhost:4200

## 🔐 Security Features

### Authentication & Authorization
- **JWT-based authentication**
- **Password hashing with bcryptjs**
- **Protected routes and middleware**
- **CORS configuration for cross-origin requests**
- **Helmet for security headers**

### Data Protection
- **Input validation and sanitization**
- **MongoDB injection protection**
- **Environment variable configuration**
- **Secure token storage and transmission**

## 🎯 Key Benefits of This Architecture

### 1. **Independent Development**
- Each service can be developed by different teams
- Technology diversity (React + Angular + Node.js)
- Independent deployment cycles

### 2. **Scalability**
- Services can be scaled independently
- Load balancing at service level
- Resource optimization per service needs

### 3. **Maintainability**
- Isolated codebases
- Clear service boundaries
- Easier debugging and testing

### 4. **Technology Flexibility**
- Different frameworks per service
- Technology stack evolution per service
- Best tool for each job

## 🚀 Development Workflow

### 1. **Local Development**
```powershell
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Main Shell
cd MicroserviceShell && npm run dev

# Terminal 3 - User Service
cd UserService && npm run dev

# Terminal 4 - Task Service
cd TaskService && npm run dev

# Terminal 5 - Notifications
cd NotificationsService && ng serve
```

### 2. **Service Integration**
- Each micro-frontend runs independently
- Main shell loads services via iframe
- Authentication tokens shared across services
- Real-time communication via PostMessage API

## 📊 Performance Considerations

### 1. **Lazy Loading**
- Micro-frontends loaded on demand
- Resource optimization
- Faster initial load times

### 2. **Caching Strategy**
- Browser caching for static assets
- API response caching
- Service worker implementation (future enhancement)

### 3. **Bundle Optimization**
- Vite for fast builds and HMR
- Code splitting per service
- Tree shaking for unused code

## 🔮 Future Enhancements

### 1. **Service Mesh**
- Implement service discovery
- Load balancing
- Circuit breaker pattern

### 2. **Real-time Features**
- WebSocket integration
- Real-time task updates
- Live notifications

### 3. **Monitoring & Logging**
- Distributed tracing
- Centralized logging
- Performance monitoring

### 4. **Deployment**
- Docker containerization
- Kubernetes orchestration
- CI/CD pipeline setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch for each service
3. Make changes following service-specific conventions
4. Test changes across all services
5. Submit pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Microservice Architecture**

This project demonstrates modern web development practices with microservice architecture, showcasing how different technologies can work together to create a scalable, maintainable application.
