import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/me', authController.verifyToken, authController.getCurrentUser);
router.put(
  '/profile',
  authController.verifyToken,
  authController.updateProfile
);

// Admin only routes
router.get(
  '/users',
  authController.verifyToken,
  authController.requireAdmin,
  authController.getCurrentUser
);

export default router;
