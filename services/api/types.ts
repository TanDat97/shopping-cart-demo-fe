export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  status: number;
  errorCode: string;
  message: string;
  code?: string;
  details?: any;
}

export class ApiException extends Error {
  public status: number;
  public errorCode: string;
  public code?: string;
  public details?: any;

  constructor(status: number, errorCode: string, message: string, code?: string, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.errorCode = errorCode;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}
