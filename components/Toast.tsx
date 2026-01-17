'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const toastStyles = {
  success: {
    bg: 'bg-gradient-to-r from-emerald-500 to-green-600',
    iconBg: 'bg-white/20',
    progress: 'bg-white/40',
  },
  error: {
    bg: 'bg-gradient-to-r from-red-500 to-rose-600',
    iconBg: 'bg-white/20',
    progress: 'bg-white/40',
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    iconBg: 'bg-white/20',
    progress: 'bg-white/40',
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    iconBg: 'bg-white/20',
    progress: 'bg-white/40',
  },
};

function Toast({ id, type, title, message, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const styles = toastStyles[type];

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl shadow-2xl min-w-[320px] max-w-md
        transform transition-all duration-300 ease-out
        ${styles.bg}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4 text-white">
        <div className={`flex-shrink-0 p-2 rounded-lg ${styles.iconBg}`}>
          {toastIcons[type]}
        </div>
        <div className="flex-1 pt-1">
          <p className="font-semibold text-white">{title}</p>
          {message && (
            <p className="mt-1 text-sm text-white/80">{message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
        <div
          className={`h-full ${styles.progress} animate-progress`}
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-progress {
          animation: progress linear forwards;
        }
      `}</style>
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Custom hook for toast management
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>>([]);

  const addToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, message?: string) => addToast('success', title, message);
  const error = (title: string, message?: string) => addToast('error', title, message);
  const warning = (title: string, message?: string) => addToast('warning', title, message);
  const info = (title: string, message?: string) => addToast('info', title, message);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

export default Toast;
