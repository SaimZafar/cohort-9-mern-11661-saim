const logger = require('../utils/logger');

// Custom error class so controllers can throw errors with a specific status code
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Must have 4 params (err, req, res, next) for Express to treat it as an error handler
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  logger.error({ err, path: req.path, method: req.method }, err.message);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message,
  });
}

module.exports = { errorHandler, AppError };