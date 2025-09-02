// Export API client and types
export { default as apiClient } from './client';
export * from './types';

// Export server API client
export { serverApiClient, fetchData, postData, putData, deleteData } from './server';

// Export error handling
export { ErrorProvider, useError } from '@/components/ErrorBoundary/ErrorContext';
export { default as ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

// Export hooks
export * from '@/hooks/useApi';
