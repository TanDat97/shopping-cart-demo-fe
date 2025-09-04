export interface ErrorInfo {
  status: number;
  errorCode: string;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ErrorContextType {
  showError: (error: ErrorInfo) => void;
  clearError: () => void;
  error: ErrorInfo | null;
}

export type ErrorPageType = '403' | '404' | '500' | null;
