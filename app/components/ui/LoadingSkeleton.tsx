import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'list' | 'text' | 'avatar' | 'stat';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  type = 'card',
  count = 1,
  className = '',
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-card rounded-xl shadow border border-border p-6 ${className}`}>
            <div className="animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-muted rounded-xl" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-32 bg-muted rounded" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
            </div>
          </div>
        );

      case 'stat':
        return (
          <div className={`bg-card rounded-xl shadow border border-border p-6 ${className}`}>
            <div className="animate-pulse">
              <div className="h-10 w-10 bg-muted rounded-lg mb-4" />
              <div className="h-4 w-20 bg-muted rounded mb-2" />
              <div className="h-8 w-24 bg-muted rounded" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={`bg-card rounded-lg shadow overflow-hidden ${className}`}>
            <div className="animate-pulse">
              {/* Header */}
              <div className="bg-muted/50 px-6 py-4 border-b border-border">
                <div className="flex gap-4">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-4 w-28 bg-muted rounded" />
                </div>
              </div>
              {/* Rows */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 border-b border-border">
                  <div className="flex gap-4">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-28 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg shadow p-4 border border-border"
              >
                <div className="animate-pulse flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
              <div className="h-4 w-4/6 bg-muted rounded" />
            </div>
          </div>
        );

      case 'avatar':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-16 w-16 bg-muted rounded-full" />
          </div>
        );

      default:
        return null;
    }
  };

  if (type === 'list' || type === 'text') {
    return renderSkeleton();
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
}
