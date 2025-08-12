// src/utils/errors.js
class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}

class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409);
  }
}

module.exports = {
  CustomError,
  ValidationError,
  NotFoundError,
  ConflictError
};