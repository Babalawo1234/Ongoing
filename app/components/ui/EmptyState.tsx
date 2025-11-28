import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="mb-4 p-4 bg-muted rounded-full">
        <div className="h-12 w-12 text-muted-foreground">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:scale-95"
          aria-label={action.label}
        >
          {action.icon && (
            <span className="h-5 w-5" aria-hidden="true">
              {action.icon}
            </span>
          )}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
}
