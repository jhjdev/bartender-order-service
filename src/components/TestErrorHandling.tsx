import React from 'react';
import api from '../services/axios';
import { showSuccessToast } from '../utils/errorHandler';

const TestErrorHandling: React.FC = () => {
  const testEndpoints = {
    '400 Bad Request': '/api/test/400',
    '401 Unauthorized': '/api/test/401',
    '403 Forbidden': '/api/test/403',
    '404 Not Found': '/api/test/404',
    '409 Conflict': '/api/test/409',
    '422 Unprocessable Entity': '/api/test/422',
    '429 Too Many Requests': '/api/test/429',
    '503 Service Unavailable': '/api/test/503',
  };

  const testSuccess = async () => {
    try {
      await api.get('/api/test/success');
      showSuccessToast('Test success message');
    } catch (error) {
      // Error is handled by the interceptor
    }
  };

  const testError = async (endpoint: string) => {
    try {
      await api.get(endpoint);
    } catch (error) {
      // Error is handled by the interceptor
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Error Handling</h2>

      <div className="mb-4">
        <button
          onClick={testSuccess}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Success Toast
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(testEndpoints).map(([name, endpoint]) => (
          <button
            key={endpoint}
            onClick={() => testError(endpoint)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Test {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestErrorHandling;
