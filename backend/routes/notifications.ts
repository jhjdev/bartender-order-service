import express from 'express';
import {
  sendTestNotification,
  notificationHealth,
} from '../controllers/notificationController';

const router = express.Router();

// Health check endpoint
router.get('/health', notificationHealth);

// Send test notification endpoint
router.post('/send-test', sendTestNotification);

export default router;
