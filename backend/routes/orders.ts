import express, { Request, Response } from 'express';
import { authController } from '../controllers/authController';

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(authController.verifyToken);

// TODO: Add order controller and routes
// For now, just a placeholder route
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Orders routes - To be implemented' });
});

export default router;
