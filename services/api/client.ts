import { clientEnv } from "@/libs/env";
import { ApiException, ApiResponse, RequestConfig, HttpMethod } from "./types";

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = `${clientEnv.API_URL}/api`;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, timeout = 10000 } = config;

    const url = `${this.baseURL}${endpoint}`;

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return {
        data,
        success: true,
        message: data.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiException) {
        throw error;
      }

      if ((error as Error).name === "AbortError") {
        throw new ApiException(408, "408", "Request timeout");
      }

      throw new ApiException(500, "500", "Network error occurred");
    }
  }

  private async handleErrorResponse(response: Response): Promise<void> {
    let errorCode = response.status.toString();
    let errorMessage = "An error occurred";
    let errorDetails = null;

    try {
      const errorData = await response.json();
      errorCode = errorData.errorCode || errorCode;
      errorMessage = errorData.message || errorMessage;
      errorDetails = errorData.details || null;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiException(response.status, errorCode, errorMessage, response.status.toString(), errorDetails);
  }

  private getAuthToken(): string | null {
    // Get token from localStorage, cookies, or wherever it's stored
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  // Public methods for different HTTP verbs
  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  public async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  public async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  public async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }

  public async patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }

  // Utility methods
  public setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  public clearAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
