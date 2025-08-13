require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // Best practice: Explicitly configure the connection pool
    pool: {
      max: 20, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // The maximum time (in ms) that pool will try to get a connection before throwing an error
      idle: 10000, // The maximum time (in ms) a connection can be idle before being released
      evict: 30000, // The time (in ms) after which a connection is forcefully closed
    },
    // Optional: Log all SQL queries to the console for development
    logging: console.log,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // Configure pool for production
    pool: {
      max: 50, // A higher max for production traffic, but still less than the database's max connections
      min: 5,
      acquire: 60000,
      idle: 20000,
      evict: 30000,
    },
    // Best practice: Disable logging in production
    logging: false,
  },
};