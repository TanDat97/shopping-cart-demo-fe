"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorInfo, ErrorContextType } from './types';

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const router = useRouter();

  const showError = (errorInfo: ErrorInfo) => {
    setError(errorInfo);

    // Route to appropriate error page based on status
    switch (errorInfo.status) {
      case 403:
        router.push('/error/403');
        break;
      case 404:
        router.push('/error/404');
        break;
      case 500:
        router.push('/error/500');
        break;
      case 400:
        // For 400 errors, just set the error state (will show popup)
        // Don't navigate away from current page
        break;
      default:
        // For other server errors (5xx), treat as 500
        if (errorInfo.status >= 500) {
          router.push('/error/500');
        }
        break;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: ErrorContextType = {
    showError,
    clearError,
    error,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
