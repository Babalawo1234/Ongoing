import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2" role="list">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <HomeIcon className="h-5 w-5" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRightIcon
                className="h-4 w-4 text-muted-foreground/50"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="h-4 w-4" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="flex items-center gap-1 text-foreground font-semibold"
                  aria-current="page"
                >
                  {item.icon && (
                    <span className="h-4 w-4" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
