const BASE_URL = 'http://localhost:3000';

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
      
      const errorMessage = errorData.error || bodyText || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage) as any;
      error.status = response.status;
      error.response = errorData;
      error.statusText = response.statusText;
      throw error;
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
}

export const apiClient = new ApiClient();
