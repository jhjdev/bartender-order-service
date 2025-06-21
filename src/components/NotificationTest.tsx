import React, { useState } from 'react';
import axios from 'axios';

const NotificationTest: React.FC = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const sendTestNotification = async () => {
    if (!token.trim()) {
      setResult('Please enter a token');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await axios.post('/api/notifications/send-test', {
        token: token.trim(),
      });

      setResult(
        `Success: ${response.data.message} (ID: ${response.data.messageId})`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setResult(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Notification Test (Local Development)
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            FCM Token (for testing)
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter FCM token for testing..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={sendTestNotification}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Test Notification'}
        </button>

        {result && (
          <div
            className={`p-3 rounded-md ${
              result.startsWith('Success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {result}
          </div>
        )}

        <div className="text-sm text-gray-600 mt-4">
          <p>
            <strong>Note:</strong> This is running in local development mode.
          </p>
          <p>
            When you upgrade to Firebase Blaze plan, this will automatically
            switch to use Firebase Cloud Functions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;
