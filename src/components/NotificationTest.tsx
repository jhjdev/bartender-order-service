import React, { useEffect, useState } from 'react';
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from 'firebase/functions';
import { requestNotificationPermission } from '../utils/notifications';

const NotificationTest: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          );
          console.log('Service Worker registered:', registration);
        }
      } catch (error) {
        console.error('Error registering service worker:', error);
      }
    };

    registerServiceWorker();
  }, []);

  // Connect to the local emulator if running on localhost
  useEffect(() => {
    const functions = getFunctions();
    if (window.location.hostname === 'localhost') {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      const token = await requestNotificationPermission();
      setToken(token);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to get notification token'
      );
    }
  };

  const handleSendTestNotification = async () => {
    if (!token) {
      setError('No notification token available');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const functions = getFunctions();
      if (window.location.hostname === 'localhost') {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      const sendTestNotification = httpsCallable(
        functions,
        'sendTestNotification'
      );
      const result = await sendTestNotification({ token });
      console.log('Test notification sent:', result.data);
    } catch (error) {
      console.error('Error sending test notification:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to send test notification'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notification Test</h1>

      <div className="space-y-4">
        <button
          onClick={handleRequestPermission}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Request Notification Permission
        </button>

        {token && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold">Notification Token:</p>
              <p className="break-all">{token}</p>
            </div>

            <button
              onClick={handleSendTestNotification}
              disabled={sending}
              className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                sending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {sending ? 'Sending...' : 'Send Test Notification'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTest;
