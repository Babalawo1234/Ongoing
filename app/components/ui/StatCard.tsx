import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'yellow';
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-muted',
    icon: 'text-primary',
    border: 'border-border',
    gradient: 'from-primary to-primary',
  },
  green: {
    bg: 'bg-muted',
    icon: 'text-primary',
    border: 'border-border',
    gradient: 'from-primary to-primary',
  },
  purple: {
    bg: 'bg-muted',
    icon: 'text-primary',
    border: 'border-border',
    gradient: 'from-primary to-primary',
  },
  orange: {
    bg: 'bg-muted',
    icon: 'text-primary',
    border: 'border-border',
    gradient: 'from-primary to-primary',
  },
  red: {
    bg: 'bg-muted',
    icon: 'text-destructive',
    border: 'border-border',
    gradient: 'from-destructive to-destructive',
  },
  indigo: {
    bg: 'bg-muted',
    icon: 'text-primary',
    border: 'border-border',
    gradient: 'from-primary to-primary',
  },
  pink: {
    bg: 'bg-muted',
    icon: 'text-primary',
    border: 'border-border',
    gradient: 'from-primary to-primary',
  },
  yellow: {
    bg: 'bg-muted',
    icon: 'text-primary',
    border: 'border-border',
    gradient: 'from-primary to-primary',
  },
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'blue',
  onClick,
  loading = false,
  className = '',
}: StatCardProps) {
  const colors = colorClasses[color];
  const isClickable = !!onClick;

  const CardContent = () => (
    <>
      {/* Icon and Trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110`}>
          <div className={`h-6 w-6 ${colors.icon}`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend.isPositive
                ? 'bg-muted text-foreground'
                : 'bg-destructive/10 text-destructive'
            }`}
            aria-label={`${trend.isPositive ? 'Increased' : 'Decreased'} by ${trend.value}%`}
          >
            {trend.isPositive ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1" id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
          {title}
        </p>
        {loading ? (
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        ) : (
          <p
            className="text-3xl font-bold text-foreground mb-1"
            aria-labelledby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {value}
          </p>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend?.label && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend.label}
          </p>
        )}
      </div>

      {/* Hover indicator for clickable cards */}
      {isClickable && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" 
             style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
             className={`bg-gradient-to-r ${colors.gradient}`} />
      )}
    </>
  );

  const baseClasses = `
    relative
    bg-card
    text-card-foreground
    rounded-xl
    shadow-sm
    border border-border
    p-6
    transition-all
    duration-300
    group
    ${isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1' : ''}
    ${className}
  `;

  if (isClickable) {
    return (
      <button
        onClick={onClick}
        className={baseClasses}
        aria-label={`View details for ${title}: ${value}`}
        type="button"
      >
        <CardContent />
      </button>
    );
  }

  return (
    <div className={baseClasses} role="article" aria-label={`${title}: ${value}`}>
      <CardContent />
    </div>
  );
}
