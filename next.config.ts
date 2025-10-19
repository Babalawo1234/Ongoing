import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  },
  // Alternative: Configure font loading with fallbacks
  async rewrites() {
    return [];
  }
};

export default nextConfig;
