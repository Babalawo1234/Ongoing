'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-card',
    borderColor: 'border-primary',
    iconColor: 'text-primary',
    textColor: 'text-card-foreground',
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-card',
    borderColor: 'border-destructive',
    iconColor: 'text-destructive',
    textColor: 'text-card-foreground',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-card',
    borderColor: 'border-primary',
    iconColor: 'text-primary',
    textColor: 'text-card-foreground',
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-card',
    borderColor: 'border-primary',
    iconColor: 'text-primary',
    textColor: 'text-card-foreground',
  },
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
};

export default function Toast({
  type,
  message,
  description,
  duration = 5000,
  onClose,
  position = 'top-right',
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className={`
          ${config.bgColor}
          ${config.textColor}
          border-l-4 ${config.borderColor}
          rounded-lg shadow-lg
          p-4 pr-12
          max-w-md
          relative
        `}
      >
        <div className="flex items-start gap-3">
          <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0`} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{message}</p>
            {description && (
              <p className="text-xs mt-1 opacity-90">{description}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleClose}
          className={`absolute top-2 right-2 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${config.iconColor}`}
          aria-label="Close notification"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Toast Container for managing multiple toasts
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

export function ToastContainer({ toasts, onRemove, position = 'top-right' }: ToastContainerProps) {
  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-2`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          description={toast.description}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
}
