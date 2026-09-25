import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

export default router;
