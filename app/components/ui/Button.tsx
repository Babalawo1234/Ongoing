import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const { className = '', disabled, ...restProps } = props;
  
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-background
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-primary
      hover:bg-primary/90
      text-primary-foreground shadow-lg hover:shadow-xl
      focus:ring-ring
      active:scale-95
    `,
    secondary: `
      bg-secondary
      hover:bg-secondary/80
      text-secondary-foreground
      focus:ring-ring
      active:scale-95
    `,
    success: `
      bg-primary
      hover:bg-primary/90
      text-primary-foreground shadow-lg hover:shadow-xl
      focus:ring-ring
      active:scale-95
    `,
    danger: `
      bg-destructive
      hover:bg-destructive/90
      text-destructive-foreground shadow-lg hover:shadow-xl
      focus:ring-ring
      active:scale-95
    `,
    warning: `
      bg-primary
      hover:bg-primary/90
      text-primary-foreground shadow-lg hover:shadow-xl
      focus:ring-ring
      active:scale-95
    `,
    ghost: `
      bg-transparent
      hover:bg-accent
      text-foreground
      focus:ring-ring
    `,
    outline: `
      bg-transparent border-2
      border-input
      hover:bg-accent
      text-foreground
      focus:ring-ring
      active:scale-95
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7',
  };

  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${iconSizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...restProps}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={iconSizeClasses[size]} aria-hidden="true">
              {icon}
            </span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className={iconSizeClasses[size]} aria-hidden="true">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
