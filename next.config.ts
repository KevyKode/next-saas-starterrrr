import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    newDevOverlay: true
  },
  serverRuntimeConfig: {
    // Increase timeout for API routes (in milliseconds)
    apiBodyTimeout: 120000, // 2 minutes
  }
};

export default nextConfig;