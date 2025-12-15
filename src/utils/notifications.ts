// NOTE: Firebase Cloud Messaging (FCM) is not wired up in this repo yet.
// This file keeps the notification API surface without requiring firebase deps.

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    // TODO: Implement FCM token retrieval once firebase is added/configured.
    return null;
  } catch (error) {
    console.error('Error in requestNotificationPermission:', error);
    return null;
  }
}

export async function getNotificationToken(): Promise<string | null> {
  // TODO: Implement FCM token retrieval once firebase is added/configured.
  return null;
}
