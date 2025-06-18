import { getToken } from 'firebase/messaging';
import { messaging } from '../config/firebase';

export async function requestNotificationPermission() {
  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Permission status:', permission);

    if (permission === 'granted') {
      console.log('Permission granted, getting token...');
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log('Successfully got token:', token);
      // TODO: Send this token to your server
      return token;
    } else {
      console.log('Permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error in requestNotificationPermission:', error);
    return null;
  }
}

export async function getNotificationToken() {
  try {
    console.log('Getting notification token...');
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    console.log('Successfully got token:', token);
    return token;
  } catch (error) {
    console.error('Error getting notification token:', error);
    return null;
  }
}
