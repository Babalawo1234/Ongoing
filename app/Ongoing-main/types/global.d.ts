/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  export * from 'react';
  export { default } from 'react';
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function redirect(url: string): never;
}

declare module 'next/link' {
  import { ComponentType, ReactNode } from 'react';
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children: ReactNode;
    [key: string]: any;
  }
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module '@heroicons/react/24/outline' {
  import { ComponentType, SVGProps } from 'react';
  export const HomeIcon: ComponentType<SVGProps<SVGSVGElement>>;
  export const BookOpenIcon: ComponentType<SVGProps<SVGSVGElement>>;
  export const ChartBarIcon: ComponentType<SVGProps<SVGSVGElement>>;
  export const UserIcon: ComponentType<SVGProps<SVGSVGElement>>;
  export const ArrowRightIcon: ComponentType<SVGProps<SVGSVGElement>>;
  export const UserGroupIcon: ComponentType<SVGProps<SVGSVGElement>>;
  export const DocumentDuplicateIcon: ComponentType<SVGProps<SVGSVGElement>>;
}

declare module 'clsx' {
  function clsx(...args: any[]): string;
  export default clsx;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
