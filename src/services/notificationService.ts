import { apiClient } from './apiClient';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  /**
   * Get all notifications
   * GET /api/notifications
   * Headers: Authorization: Bearer <token>
   * Query Parameters: ?read=true/false, ?limit=10
   */
  async getNotifications(params?: {
    read?: boolean;
    limit?: number;
  }): Promise<Notification[]> {
    const queryParams = new URLSearchParams();
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    return apiClient.get<Notification[]>(
      `/api/notifications${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get notification by ID
   * GET /api/notifications/:id
   * Headers: Authorization: Bearer <token>
   */
  async getNotificationById(id: string): Promise<Notification> {
    return apiClient.get<Notification>(`/api/notifications/${id}`);
  },

  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   * Headers: Authorization: Bearer <token>
   */
  async markAsRead(id: string): Promise<Notification> {
    return apiClient.put<Notification>(`/api/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   * Headers: Authorization: Bearer <token>
   */
  async markAllAsRead(): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>('/api/notifications/read-all');
  },

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteNotification(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/notifications/${id}`);
  },
};
