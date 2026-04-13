import { apiClient } from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  Profile,
  User,
} from './types';

export const authService = {
  /**
   * Login to the system
   * POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials, false);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  /**
   * Logout from the system
   * POST /api/auth/logout
   */
  async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>('/api/auth/logout', undefined, false);
    
    // Clear token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return response;
  },

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(): Promise<Profile> {
    return apiClient.get<Profile>('/api/auth/profile');
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Get stored token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
