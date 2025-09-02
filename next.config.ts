import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    implementation: 'sass', // default using SASS to achieve SCSS support
  },
  
  // Images configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'orderfoodonline.deno.dev',
        port: '',
        pathname: '/public/images/**',
      },
    ],
  },
  
  // Environment variables configuration
  env: {
    // Custom environment variables can be defined here
    // These will be available at build time
  },
  
  // Public runtime config (deprecated in favor of NEXT_PUBLIC_ env vars)
  // Use NEXT_PUBLIC_ prefix for client-side environment variables
  
  // Configure which environment files to load
  experimental: {
    // Enable experimental features if needed
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
