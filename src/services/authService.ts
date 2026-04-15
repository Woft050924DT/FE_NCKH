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
    const response = await apiClient.post<{ success: boolean; data: LoginResponse; message: string }>('/api/auth/login', credentials, false);
    
    // Extract data from new response format
    const loginData = response.data;
    
    // Store token in localStorage
    if (loginData.token) {
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
    }
    
    return loginData;
  },

  /**
   * Logout from the system
   * POST /api/auth/logout
   */
  async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<{ success: boolean; data: LogoutResponse; message: string }>('/api/auth/logout', undefined, false);
    
    // Clear token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return response.data;
  },

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(userId: number, role: 'student' | 'instructor'): Promise<Profile> {
    const queryParams = `?user_id=${userId}&role=${role}`;
    const response = await apiClient.get<{ success: boolean; data: Profile; message: string }>(`/api/auth/profile${queryParams}`);
    return response.data;
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
