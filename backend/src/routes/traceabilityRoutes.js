import { Router } from 'express';
import { traceabilityController } from '../controllers/traceabilityController.js';
import { validateSerialParam } from '../middleware/validationMiddleware.js';

const router = Router();

/**
 * GET /api/traceability/:serialNumber
 * Retrieve complete consolidated manufacturing provenance
 */
router.get('/:serialNumber', validateSerialParam, traceabilityController.getTraceability);

export default router;
