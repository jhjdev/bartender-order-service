import { Request, Response } from 'express';

interface NotificationData {
  token: string;
}

export const sendTestNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body as NotificationData;

    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    // Mock notification sending for local development
    const message = {
      notification: {
        title: 'Test Notification',
        body: 'This is a test notification from local backend',
      },
      token: token,
    };

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('Mock notification sent:', message);

    // Return success response similar to Firebase function
    res.json({
      success: true,
      messageId: `local-${Date.now()}`,
      message: 'Notification sent (local development mode)',
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Error sending notification' });
  }
};

// Health check for notification service
export const notificationHealth = (_req: Request, res: Response): void => {
  res.json({
    status: 'OK',
    service: 'notification',
    mode: 'local-development',
    timestamp: new Date().toISOString(),
  });
};
