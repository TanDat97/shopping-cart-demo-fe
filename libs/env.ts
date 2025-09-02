/**
 * Environment Variables Configuration for Next.js
 * 
 * QUY TẮC QUAN TRỌNG CỦA NEXT.JS:
 * 1. Chỉ các biến có prefix NEXT_PUBLIC_ mới được expose ra client-side
 * 2. Các biến không có prefix chỉ available trên server-side
 * 3. File .env.local sẽ được load tự động trong development
 * 4. File .env.production chỉ load khi NODE_ENV=production
 */

// Server-side environment variables (không thể access từ browser)
export const serverEnv = {
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
  PORT: parseInt(process.env.PORT || '4000', 10),
  DATABASE_URL: process.env.DATABASE_URL,
  API_SECRET_KEY: process.env.API_SECRET_KEY,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
} as const;

// Client-side environment variables (có thể access từ browser)
// Lưu ý: Phải có prefix NEXT_PUBLIC_
export const clientEnv = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Shopping Cart Demo',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
} as const;

// Utility functions
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging';

/**
 * Validate environment variables
 */
export function validateEnv() {
  // Validate required client env vars
  if (!clientEnv.API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is required');
  }

  // Log environment info in development
  if (isDevelopment && typeof window === 'undefined') {
    console.log('🔧 Environment loaded:', {
      NODE_ENV: serverEnv.NODE_ENV,
      APP_ENV: clientEnv.APP_ENV,
      API_URL: clientEnv.API_URL,
    });
  }
}

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}