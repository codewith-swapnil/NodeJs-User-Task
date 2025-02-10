const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

// Define the Task model
const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false, // Title is required
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Description is optional
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending', // Default status is 'pending'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false, // Priority is required
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false, // Due date is required
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    tableName: 'tasks', // Explicitly define table name (optional)
});

// Define the relationship
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });

// Export the Task model
module.exports = Task;
