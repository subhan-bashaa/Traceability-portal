import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { validateSerialBody } from '../middleware/validationMiddleware.js';

const router = Router();

/**
 * POST /api/ai/traceability-summary
 * Generates an executive AI summary from verified PostgreSQL provenance data.
 * Protected by stricter rate limiter and body validation.
 */
router.post('/traceability-summary', aiLimiter, validateSerialBody, aiController.getTraceabilitySummary);

export default router;
