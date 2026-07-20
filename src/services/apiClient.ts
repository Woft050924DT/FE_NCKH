import axiosInstance from '@/plugins/axios';

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
  private async handleRequest<T>(request: Promise<any>): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.error || errorData?.message || `HTTP error! status: ${error.response.status}`;
        throw new ApiError(errorMessage, error.response.status, errorData, error.response.statusText);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.handleRequest<T>(axiosInstance.get(endpoint));
  }

  async post<T>(endpoint: string, data?: any, includeAuth: boolean = true, customHeaders?: HeadersInit): Promise<T> {
    return this.handleRequest<T>(axiosInstance.post(endpoint, data));
  }

  async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    return this.handleRequest<T>(axiosInstance.put(endpoint, data));
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.handleRequest<T>(axiosInstance.delete(endpoint));
  }
}

export const apiClient = new ApiClient();
