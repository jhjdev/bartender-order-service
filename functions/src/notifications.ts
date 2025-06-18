import { onCall, CallableRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface NotificationData {
  token: string;
}

export const sendTestNotification = onCall<NotificationData>(
  {
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  async (request: CallableRequest<NotificationData>) => {
    try {
      const { token } = request.data;

      if (!token) {
        throw new Error('Token is required');
      }

      const message = {
        notification: {
          title: 'Test Notification',
          body: 'This is a test notification from Firebase Cloud Functions',
        },
        token: token,
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Error sending notification');
    }
  }
);
