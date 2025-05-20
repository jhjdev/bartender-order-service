import express, { Router } from 'express';
import { staffController } from '../controllers/staffController';
import { authController } from '../controllers/authController';

const router: Router = express.Router();

// Apply authentication middleware to all staff routes
router.use(authController.verifyToken);

// Get all staff members (admin only)
router.get('/', authController.requireAdmin, staffController.getAllStaff);

// Get current user's profile
router.get('/me', staffController.getCurrentUser);

// Get staff member by ID
router.get('/:id', staffController.getStaffById);

// Create new staff member (admin only)
router.post('/', authController.requireAdmin, staffController.createStaff);

// Update staff member
router.put('/:id', authController.requireAdmin, staffController.updateStaff);

// Delete staff member
router.delete('/:id', authController.requireAdmin, staffController.deleteStaff);

export default router;
