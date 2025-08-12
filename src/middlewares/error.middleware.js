// src/middlewares/error.middleware.js
const { CustomError } = require('../utils/errors'); // Assuming a file with custom error classes exists

module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  // Handle custom errors with specific status codes
  if (err instanceof CustomError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({ error: err.details[0].message });
  }

  // Handle unexpected errors gracefully
  console.error(err);
  return res.status(500).json({ error: 'Internal Server Error' });
};