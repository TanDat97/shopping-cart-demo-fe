import { clientEnv } from "@/libs/env";
import { ApiException, ApiResponse } from "./types";

/**
 * Server-side API functions for use in Server Components,
 * Server Actions, and Route Handlers
 */

class ServerApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = `${clientEnv.API_URL}/api`;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, ...restOptions } = options;

    const url = `${this.baseURL}${endpoint}`;

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        ...restOptions,
      });

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
      if (error instanceof ApiException) {
        throw error;
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

  // Server-side HTTP methods
  public async get<T>(endpoint: string, options?: Omit<RequestInit, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", ...options });
  }

  public async post<T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  public async put<T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  public async delete<T>(endpoint: string, options?: Omit<RequestInit, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", ...options });
  }

  public async patch<T>(endpoint: string, body?: any, options?: Omit<RequestInit, "method" | "body">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }
}

// Export singleton instance for server-side use
export const serverApiClient = new ServerApiClient();

// Convenience functions for server components
export async function fetchData<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await serverApiClient.get<T>(endpoint);
    return response?.data;
  } catch (error) {
    console.error(`Server API Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function postData<T>(endpoint: string, body?: any): Promise<T | null> {
  try {
    const response = await serverApiClient.post<T>(endpoint, body);
    return response?.data;
  } catch (error) {
    console.error(`Server API Error posting to ${endpoint}:`, error);
    return null;
  }
}

export async function putData<T>(endpoint: string, body?: any): Promise<T | null> {
  try {
    const response = await serverApiClient.put<T>(endpoint, body);
    return response?.data;
  } catch (error) {
    console.error(`Server API Error putting to ${endpoint}:`, error);
    return null;
  }
}

export async function deleteData<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await serverApiClient.delete<T>(endpoint);
    return response?.data;
  } catch (error) {
    console.error(`Server API Error deleting ${endpoint}:`, error);
    return null;
  }
}
