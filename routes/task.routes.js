const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware'); // Authentication middleware

const router = express.Router();

// Create a new task (Authenticated users only)
router.post('/', auth, createTask);

// Get all tasks with filtering, sorting, and pagination (Admins see all, users see their own)
router.get('/', auth, getTasks);

// Update a task (Only assigned user or admin can update)
router.put('/:id', auth, updateTask);

// Delete a task (Only assigned user or admin can delete)
router.delete('/:id', auth, deleteTask);

module.exports = router;
