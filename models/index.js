const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres', // Change dialect to 'postgres'
    logging: false, // Set to true to log SQL queries
});

// Import models
const User = require('./user.model')(sequelize);
const Task = require('./task.model')(sequelize);

// Define relationships
User.hasMany(Task, { foreignKey: 'assigned_to', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });

// Sync database
const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        await sequelize.sync({ alter: true }); // Updates table structure without deleting data
        console.log('Models synchronized');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

module.exports = { sequelize, User, Task, initDB };
