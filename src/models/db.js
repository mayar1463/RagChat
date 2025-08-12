// src/models/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'rag_chat',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '', // Correctly includes the password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    logging: false, // Set to true to see SQL queries
    pool: {
      max: 10, // Maximum number of connections in pool
      min: 0, // Minimum number of connections in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get a connection before throwing an error
      idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
    },
  }
);

module.exports = sequelize;