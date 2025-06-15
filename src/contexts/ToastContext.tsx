import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastContextType {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showWarningToast: (message: string) => void;
  showInfoToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      type: 'success' | 'error' | 'warning' | 'info';
    }>
  >([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);
    },
    []
  );

  const showSuccessToast = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    (message: string) => {
      showToast(message, 'warning');
    },
    [showToast]
  );

  const showInfoToast = useCallback(
    (message: string) => {
      showToast(message, 'info');
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showSuccessToast,
        showErrorToast,
        showWarningToast,
        showInfoToast,
      }}
    >
      {children}
      <div className="fixed top-28 right-2 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-2 text-white shadow-lg transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-[#4a7b6f]'
                : toast.type === 'error'
                ? 'bg-[#b85c6a]'
                : toast.type === 'warning'
                ? 'bg-[#d97706]'
                : 'bg-[#4b6b8b]'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
