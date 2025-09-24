import { useEffect, useState } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300);
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`toast ${type} ${isLeaving ? 'toast-leaving' : ''}`}>
      <span className="toast-icon">{getToastIcon()}</span>
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Close notification">
        ✕
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
