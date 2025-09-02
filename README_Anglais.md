# Task Management Application (Todo List)

This full stack application allows you to manage personal tasks with an authentication system, notifications, and real-time task management.

## Project Architecture

The project is divided into two main parts we talk here on frontend:


### Frontend (Vue.js)

- **Framework**: Vue.js 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Real-time**: Laravel Echo with Pusher

## Features

- **Authentication**: Registration, login, and logout
- **Profile Management**: Display and modification of user information
- **Task Management**:
  - Create, read, update, and delete tasks
  - Filter by status and priority
  - Search tasks
  - Mark tasks as completed
- **Notifications**: Real-time notifications for important actions


## Installation and Configuration
### 1. Frontend Configuration

```bash
cd ../todo-frontend

# Install dependencies
npm install

# Verify that the .env file points to the backend API
# VITE_API_URL=http://localhost:8000/api
```

## Starting the Application



### 1. Start the Frontend

```bash
cd todo-frontend
npm run dev
```

The frontend application will be accessible at: http://localhost:5173


## Contribution

To contribute to the project, please follow these steps:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is under MIT license.
