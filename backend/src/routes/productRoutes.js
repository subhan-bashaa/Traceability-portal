import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { validateIdParam } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/', productController.getAll);
router.get('/stats/dashboard', productController.getStats);
router.get('/:id', validateIdParam, productController.getById);
router.get('/:id/components', validateIdParam, productController.getComponents);
router.get('/:id/route-history', validateIdParam, productController.getRouteHistory);
router.get('/:id/defects', validateIdParam, productController.getDefects);
router.get('/:id/inspections', validateIdParam, productController.getInspections);
router.get('/:id/shipment', validateIdParam, productController.getShipment);

export default router;
