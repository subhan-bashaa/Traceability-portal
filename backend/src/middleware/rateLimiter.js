import rateLimit from 'express-rate-limit';

/**
 * Standard Rate Limiter for general API endpoints
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * Stricter Rate Limiter for external AI operations
 * 20 requests per 15 minutes per IP
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request quota reached for this IP. Please try again after 15 minutes.',
  },
});

export default {
  apiLimiter,
  aiLimiter,
};
