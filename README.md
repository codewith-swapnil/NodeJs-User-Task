# Node.js User Task Management API

This is a Node.js application that provides an API for managing users and tasks with authentication (JWT), role-based access control (admin/user), and task management functionality (CRUD operations, assignment, filtering, and sorting).

## Features

- User authentication and authorization using JWT.
- Admin users can manage (create, update, delete) other users.
- Users can create, update, delete, and fetch tasks.
- Tasks can be assigned to users, with filtering and sorting capabilities.
- Data is stored in a PostgreSQL database.
- Automated tests using Jest for unit and integration testing.
- API documentation using Swagger.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (or a Docker container with PostgreSQL)
- npm (Node Package Manager)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/NodeJs-User-Task.git
cd NodeJs-User-Task
