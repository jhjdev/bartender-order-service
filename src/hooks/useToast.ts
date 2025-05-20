import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  const showToast = useCallback(
    (message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
      const { duration = 3000 } = options;

      // Create toast element
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg transform transition-all duration-300 ease-in-out ${
        type === 'success'
          ? 'bg-green-500'
          : type === 'error'
          ? 'bg-red-500'
          : type === 'warning'
          ? 'bg-yellow-500'
          : 'bg-blue-500'
      } text-white`;
      toast.textContent = message;

      // Add to document
      document.body.appendChild(toast);

      // Remove after duration
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, duration);
    },
    []
  );

  return { showToast };
};
