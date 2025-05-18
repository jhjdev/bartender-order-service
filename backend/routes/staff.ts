import express from 'express';
import { staffController } from '../controllers/staffController';

const router = express.Router();

// Get all staff members
router.get('/', staffController.getAllStaff);

// Create a new staff member
router.post('/', staffController.createStaff);

// Update a staff member
router.put('/:id', staffController.updateStaff);

// Delete a staff member
router.delete('/:id', staffController.deleteStaff);

export default router;
