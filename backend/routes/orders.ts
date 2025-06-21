import express, { RequestHandler } from 'express';
import { orderController } from '../controllers/orderController';
import { authController } from '../controllers/authController';

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(authController.verifyToken as RequestHandler);

// Order routes
router.post('/', orderController.createOrder as RequestHandler);
router.get('/', orderController.getOrders as RequestHandler);
router.get('/:id', orderController.getOrderById as RequestHandler);
router.put('/:id', orderController.updateOrder as RequestHandler);
router.delete('/:id', orderController.deleteOrder as RequestHandler);

// Note routes
router.post('/:id/notes', orderController.addNote as RequestHandler);

export default router;
