const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sequelize instance from the database configuration file

// Define the User model
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,  // Ensures email is unique
        allowNull: false,  // Email is required
        validate: {
            isEmail: true, // Ensures email format is valid
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Password is required
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user', // Default role is 'user'
    }
}, {
    // Additional options for the model
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: 'users' // Explicitly set the table name (optional, but good practice)
});

// Export the User model
module.exports = User;
