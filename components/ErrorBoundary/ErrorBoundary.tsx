"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ApiException } from '@/services/api/types';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; errorInfo?: ErrorInfo }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Handle API errors specifically
    if (error instanceof ApiException) {
      this.handleApiError(error);
    }
  }

  private handleApiError(apiError: ApiException) {
    // For API errors, we can trigger specific error handling
    // This would typically involve the error context
    console.error('API Error:', {
      status: apiError.status,
      message: apiError.message,
      code: apiError.code,
      details: apiError.details,
    });
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            errorInfo={this.state.errorInfo} 
          />
        );
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <h2>Oops! Something went wrong</h2>
            <p>We&apos;re sorry, but something unexpected happened.</p>
            <button 
              onClick={() => window.location.reload()}
              className="error-boundary__refresh-btn"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-boundary__details">
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error?.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
