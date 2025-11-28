import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  const hasError = !!error;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="h-5 w-5 text-muted-foreground">
              {icon}
            </div>
          </div>
        )}

        {/* Input Field */}
        <input
          id={inputId}
          className={`
            w-full
            px-4 py-2.5
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${hasError ? 'pr-10' : ''}
            border rounded-lg
            ${hasError 
              ? 'border-destructive focus:ring-destructive focus:border-destructive' 
              : 'border-input focus:ring-ring focus:border-primary'
            }
            bg-background
            text-foreground
            placeholder-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted
            transition-colors duration-200
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          required={required}
          {...props}
        />

        {/* Right Icon or Error Icon */}
        {hasError ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-destructive" aria-hidden="true" />
          </div>
        ) : icon && iconPosition === 'right' ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="h-5 w-5 text-muted-foreground">
              {icon}
            </div>
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-1 text-sm text-muted-foreground"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
