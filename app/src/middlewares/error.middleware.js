const { sendResponse } = require('../utils/response');
const logger = require('../config/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return sendResponse(res, 400, false, 'Validation error', {
      errors: err.errors.map(e => e.message),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendResponse(res, 409, false, 'Resource already exists');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendResponse(res, 401, false, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendResponse(res, 401, false, 'Token expired');
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  return sendResponse(res, statusCode, false, message);
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res) => {
  return sendResponse(res, 404, false, 'Route not found');
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
