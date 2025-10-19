'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient,
  trend,
  delay = 0 
}: StatCardProps) {
  return (
    <div 
      className="stat-card group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Gradient Background Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />
        
        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 tracking-wide uppercase">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-all duration-300 group-hover:scale-105">
                {value}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                  {subtitle}
                  {trend && (
                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                      trend.isPositive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                  )}
                </p>
              )}
            </div>
            
            {/* Icon with gradient background */}
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
              <div className="text-white w-7 h-7">
                {icon}
              </div>
            </div>
          </div>

          {/* Animated Bottom Border */}
          <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${gradient}`} />
        </div>
      </div>
    </div>
  );
}
