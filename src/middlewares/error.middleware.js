const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    statusCode = 409;
    message = `A resource with this unique ${field} already exists.`; // 🔑 Key change here
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  } else if (err.isJoi) {
    statusCode = 400;
    message = err.details.map(detail => detail.message).join(', ');
  }

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
