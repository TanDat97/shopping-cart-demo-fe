'use client';

import { useState } from 'react';
import { useError } from '@/components/ErrorBoundary/ErrorContext';
import { apiClient } from '@/services/api/client';
import { ApiException, ApiResponse } from '@/services/api/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (body?: any) => Promise<T | null>;
  reset: () => void;
}

interface ApiResponseFormat<T> {
  code: number;
  message: string;
  data: T;
}

export function useApi<T = any>(
  apiCall: (body?: any) => Promise<ApiResponse<ApiResponseFormat<T>>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { showError } = useError();

  const execute = async (body?: any): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall(body);
      const data = response.data?.data || null;
      setState({
        data: data,
        loading: false,
        error: null,
      });
      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));

      // Handle API errors through the error boundary system
      if (error instanceof ApiException) {
        showError({
          status: error.status,
          errorCode: error.errorCode,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      return null;
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    execute,
    reset,
  };
}

// Convenience hooks for different HTTP methods
export function useApiGet<T = any>(endpoint: string) {
  return useApi<T>(() => apiClient.get<ApiResponseFormat<T>>(endpoint));
}

export function useApiPost<T = any>(endpoint: string) {
  return useApi<T>((body?: any) => apiClient.post<ApiResponseFormat<T>>(endpoint, body));
}

export function useApiPut<T = any>(endpoint: string) {
  return useApi<T>((body?: any) => apiClient.put<ApiResponseFormat<T>>(endpoint, body));
}

export function useApiDelete<T = any>(endpoint: string) {
  return useApi<T>(() => apiClient.delete<ApiResponseFormat<T>>(endpoint));
}
