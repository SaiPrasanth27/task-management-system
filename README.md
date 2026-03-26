
# Task Tracker Web App

A Full Stack Task Management System built with the MERN stack (MongoDB, Express, React, Node.js). 
This app allows users to create tasks, track progress, filter, sort, and search tasks, and view analytics on a dashboard. It includes JWT authentication and a responsive dark mode UI.

## Setup Steps

### Prerequisites
- Node.js installed
- MongoDB installed locally or an Atlas connection string

### 1. Navigate into the directories
```bash
cd Time-management
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure environment variables in `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_tracker
JWT_SECRET=super_secret_jwt_key_12345
```
Run the backend server:
```bash
node server.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user and receive JWT

### Tasks (Protected Routes)
- `GET /api/tasks`: Get all tasks (Supports queries: `keyword`, `status`, `priority`, `sort`, `page`, `limit`)
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update an existing task
- `DELETE /api/tasks/:id`: Delete a task
- `GET /api/tasks/analytics`: Get task statistics (Total, Completed, Pending)

## Design Decisions
- **Architecture**: Decoupled frontend (React/Vite) and backend (Node.js/Express) communicating via RESTful JSON APIs.
- **State Management**: React Context API used for managing global authentication state (`AuthContext`).
- **Styling**: Vanilla CSS with comprehensive CSS Variables to allow simple and fast global Dark Mode toggling and easy maintainability without heavy UI frameworks. 
- **Database Optimization**: Mongoose compound indexing applied to frequently queried fields (user, status, priority, dueDate) to improve read performance globally, and text indexes for fast title/description searching.
- **Error Handling**: Global error middleware in Express intercepts failed promises to return a unified JSON structure across all API endpoints.
- **Security**: Passwords securely hashed with `bcryptjs`. JSON Web Tokens are implemented for secure stateless request authorizations.
