const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize instance for PostgreSQL
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'postgres',  // Use PostgreSQL dialect
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
    logging: false, // Disable query logging
});

module.exports = sequelize; // Correctly export the sequelize instance
