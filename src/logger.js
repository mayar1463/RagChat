// logger.js
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Ensure the logs directory exists
const logDir = path.join(__dirname, 'logs');

// This console.log will now confirm the path to your log directory
console.log(`Attempting to write logs to directory: ${logDir}`);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a write stream for the access log file in append mode
const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'),
  { flags: 'a' }
);

// Create a morgan logger for file logging (combined format)
const morganFileLogger = morgan('combined', { stream: accessLogStream });

// Create a morgan logger for console logging (dev format)
const morganConsoleLogger = morgan('dev');

/**
 * A single HTTP logger middleware that combines console and file logging.
 * This function will be used in app.js as a single middleware.
 */
const httpLogger = (req, res, next) => {
  // Call the console logger first...
  morganConsoleLogger(req, res, () => {
    // ...then call the file logger inside its callback.
    // The file logger's 'next' will be called after both have run.
    morganFileLogger(req, res, next);
  });
};

// A simple utility logger for non-HTTP logging
const logger = {
  info: (msg) => console.log(`INFO: ${msg}`),
  error: (msg) => console.error(`ERROR: ${msg}`),
};

// Export the combined httpLogger and the utility logger
module.exports = { httpLogger, logger };
