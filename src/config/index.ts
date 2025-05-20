export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const config = {
  apiUrl: API_URL,
  authTokenKey: 'token',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
} as const;
