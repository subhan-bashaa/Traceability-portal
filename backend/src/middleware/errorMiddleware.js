import { env } from '../config/env.js';

/**
 * 404 Route Not Found Handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist on this server.`,
  });
}

/**
 * Global Error Handler Middleware
 */
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  // Securely log the error internally
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - Status: ${status} - Message: ${message}`);
  if (status === 500 && err.stack) {
    console.error(err.stack);
  }

  // Never leak credentials or sensitive database connection strings
  let sanitizedMessage = message;
  if (sanitizedMessage.includes('password') || sanitizedMessage.includes('postgresql://')) {
    sanitizedMessage = 'Database connection error. Please contact the administrator.';
  }

  res.status(status).json({
    success: false,
    message: sanitizedMessage,
    ...(env.NODE_ENV === 'development' && status === 500 ? { stack: err.stack } : {}),
  });
}

export default {
  notFoundHandler,
  errorHandler,
};
