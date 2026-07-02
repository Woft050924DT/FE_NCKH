const BASE_URL = 'http://localhost:3000';

// Custom API Error class for better error handling
class ApiError extends Error {
  status: number;
  response?: any;
  statusText?: string;

  constructor(message: string, status: number, response?: any, statusText?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
    this.statusText = statusText;
  }
}

class ApiClient {
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Read the body only once
      const bodyText = await response.text();
      
      let errorData: any;
      try {
        errorData = JSON.parse(bodyText);
      } catch (e) {
        // If not JSON, use the text directly
        errorData = { error: bodyText || `HTTP error! status: ${response.status}` };
      }
      
      const errorMessage = errorData.error || errorData.message || bodyText || `HTTP error! status: ${response.status}`;
      
      // Handle specific error types
      if (response.status === 401) {
        // Unauthorized - clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      throw new ApiError(errorMessage, response.status, errorData, response.statusText);
    }

    return response.json();
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Health check for API Gateway
   * GET /health
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API Gateway health check failed: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
