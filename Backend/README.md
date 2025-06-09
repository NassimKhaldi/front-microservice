# Backend Microservice

A RESTful API backend microservice built with Express.js for managing users, tasks, and notifications.

## Features

- **User Management**: CRUD operations for users
- **Task Management**: Create, update, delete, and track tasks
- **Notifications**: Push notifications and messaging system
- **RESTful API**: Clean, consistent API endpoints
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Helmet.js for security headers, CORS support
- **Environment Configuration**: Flexible environment setup

## Project Structure

```
/backend
├── /routes
│   ├── users.js          # User API endpoints
│   ├── tasks.js          # Task API endpoints
│   └── notifications.js  # Notification API endpoints
├── /controllers
│   ├── userController.js        # User business logic
│   ├── taskController.js        # Task business logic
│   └── notificationController.js # Notification business logic
├── /models
│   ├── User.js           # User data model
│   ├── Task.js           # Task data model
│   └── Notification.js   # Notification data model
├── server.js             # Main application entry point
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check

- `GET /health` - Server health status
- `GET /` - API information and available endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks

- `GET /api/tasks` - Get all tasks (with filtering)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task

### Notifications

- `GET /api/notifications` - Get all notifications (with filtering)
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create new notification
- `PUT /api/notifications/:id` - Update notification
- `PATCH /api/notifications/:id/read` - Mark as read/unread
- `POST /api/notifications/bulk-read` - Bulk mark as read
- `DELETE /api/notifications/:id` - Delete notification

## API Usage Examples

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the backend microservice",
    "priority": "high",
    "assignedTo": 1,
    "dueDate": "2025-06-15T10:00:00Z"
  }'
```

### Get User Tasks

```bash
curl "http://localhost:3000/api/tasks?assignedTo=1"
```

### Create a Notification

```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Task Reminder",
    "message": "Your task is due tomorrow",
    "type": "reminder"
  }'
```

## Query Parameters

### Tasks

- `status` - Filter by status (pending, in-progress, completed, cancelled)
- `priority` - Filter by priority (low, medium, high, urgent)
- `assignedTo` - Filter by assigned user ID

### Notifications

- `userId` - Filter by user ID
- `type` - Filter by type (info, warning, error, success, task, reminder)
- `read` - Filter by read status (true/false)

## Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "count": 10
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Database Integration

The project includes model files ready for database integration. Choose your preferred database:

### MongoDB with Mongoose

```bash
npm install mongoose
```

### PostgreSQL with Sequelize

```bash
npm install sequelize pg pg-hstore
```

### MySQL with Sequelize

```bash
npm install sequelize mysql2
```

Uncomment the relevant database operations in the model files and configure your connection in the `.env` file.

## Environment Variables

Key environment variables (see `.env.example`):

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- Database connection strings
- JWT secret for authentication
- CORS origins
- Rate limiting settings

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Adding New Features

1. Create route handlers in `/routes`
2. Add business logic in `/controllers`
3. Define data models in `/models`
4. Update this README with new endpoints

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request data validation
- **Error Handling**: Secure error responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
