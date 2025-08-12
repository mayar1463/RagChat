// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { swaggerUi, swaggerSpec } = require('./swagger');

const sessionRoutes = require('./routes/session.routes');
const messageRoutes = require('./routes/message.routes');
const errorHandler = require('./middlewares/error.middleware');
const auth = require('./middlewares/auth.middleware');
const rate = require('./middlewares/rate.middleware');

const app = express();

// Define log directory and file path
const logDir = path.join(__dirname, 'logs');
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

// Ensure log directory exists
fs.existsSync(logDir) || fs.mkdirSync(logDir);

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// A function to skip logging requests to the Swagger UI path
const skipSwagger = (req, res) => {
  return req.originalUrl.startsWith('/api-docs');
};

// Use morgan for console logging with the skip function
app.use(morgan('dev', { skip: skipSwagger }));

// Use morgan for file logging (all requests)
app.use(morgan('combined', { stream: accessLogStream }));

// Apply rate limiting to prevent abuse
app.use(rate);

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const API_BASE_PATH = process.env.API_BASE_PATH || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';

const baseRoute = `${API_BASE_PATH}/${API_VERSION}`;

// Move the health check endpoint here, before the auth middleware.
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Apply authentication middleware to all subsequent routes
app.use(auth);

// Define API routes for sessions and messages
app.use(`${baseRoute}/sessions`, sessionRoutes);
app.use(`${baseRoute}/sessions`, messageRoutes);

// 404 Not Found handler - must be placed before the error handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Global error handler - must be the last middleware
app.use(errorHandler);

module.exports = app;
