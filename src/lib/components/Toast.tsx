'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastComponentProps extends ToastProps {
  onClose: (id: string) => void;
}

const ToastComponent = ({ id, message, type, duration = 5000, onClose }: ToastComponentProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, id, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-100';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-400 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-400 dark:text-yellow-100';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-100';
    }
  };

  return (
    <div 
      className={`min-w-[300px] border-l-4 p-4 rounded shadow-lg animate-fadeIn ${getToastStyles()}`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <div className="flex-grow">{message}</div>
        <button
          className="ml-4 text-sm opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => onClose(id)}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast context and provider
let toastCount = 0;

export const toast = {
  success: (message: string, duration?: number) => {
    const toastEvent = new CustomEvent('toast', {
      detail: {
        id: `toast-${toastCount++}`,
        message,
        type: 'success',
        duration,
      },
    });
    document.dispatchEvent(toastEvent);
  },
  error: (message: string, duration?: number) => {
    const toastEvent = new CustomEvent('toast', {
      detail: {
        id: `toast-${toastCount++}`,
        message,
        type: 'error',
        duration,
      },
    });
    document.dispatchEvent(toastEvent);
  },
  warning: (message: string, duration?: number) => {
    const toastEvent = new CustomEvent('toast', {
      detail: {
        id: `toast-${toastCount++}`,
        message,
        type: 'warning',
        duration,
      },
    });
    document.dispatchEvent(toastEvent);
  },
  info: (message: string, duration?: number) => {
    const toastEvent = new CustomEvent('toast', {
      detail: {
        id: `toast-${toastCount++}`,
        message,
        type: 'info',
        duration,
      },
    });
    document.dispatchEvent(toastEvent);
  },
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastProps>;
      setToasts((prev) => [...prev, customEvent.detail]);
    };

    document.addEventListener('toast', handleToast);

    return () => {
      document.removeEventListener('toast', handleToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Use createPortal to render toasts at the top level of the DOM
  // This is safe because ToastContainer is only used on the client
  if (typeof window !== 'undefined') {
    return createPortal(
      <div className="fixed bottom-4 right-4 flex flex-col-reverse gap-2 z-50">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>,
      document.body
    );
  }

  return null;
}; 