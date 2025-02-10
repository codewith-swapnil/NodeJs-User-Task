const Task = require('../models/task.model');
const User = require('../models/user.model');

/**
 * Create a new task
 */
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, due_date, assigned_to } = req.body;

        // Ensure the assigned user exists
        if (assigned_to) {
            const assignedUser = await User.findByPk(assigned_to);
            if (!assignedUser) return res.status(404).json({ message: "Assigned user not found" });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            due_date,
            assigned_to
        });

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get tasks with filtering, sorting, and pagination
 */
exports.getTasks = async (req, res) => {
    try {
        let { page = 1, limit = 10, status, priority, due_date, sortBy = 'createdAt', order = 'ASC' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const whereClause = {};
        if (status) whereClause.status = status;
        if (priority) whereClause.priority = priority;
        if (due_date) whereClause.due_date = due_date;

        // If user is not an admin, only return their assigned tasks
        if (req.user.role !== 'admin') whereClause.assigned_to = req.user.id;

        const tasks = await Task.findAndCountAll({
            where: whereClause,
            limit,
            offset: (page - 1) * limit,
            order: [[sortBy, order.toUpperCase()]],
            include: [{ model: User, as: 'assignedUser', attributes: ['id', 'email'] }]
        });

        res.json({
            totalTasks: tasks.count,
            totalPages: Math.ceil(tasks.count / limit),
            currentPage: page,
            tasks: tasks.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update a task (Only assigned user or admin can update)
 */
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, due_date, assigned_to } = req.body;

        let task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Only assigned user or admin can update
        if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this task" });
        }

        // Ensure assigned user exists
        if (assigned_to) {
            const assignedUser = await User.findByPk(assigned_to);
            if (!assignedUser) return res.status(404).json({ message: "Assigned user not found" });
        }

        await task.update({ title, description, status, priority, due_date, assigned_to });

        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete a task (Only assigned user or admin can delete)
 */
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        let task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Only assigned user or admin can delete
        if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this task" });
        }

        await task.destroy();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
