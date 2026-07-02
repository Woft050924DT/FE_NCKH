import { apiClient } from './apiClient';

export interface Content {
  id: string;
  title: string;
  body: string;
  type: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export const cmsService = {
  /**
   * Get all content
   * GET /api/content
   * Headers: Authorization: Bearer <token>
   */
  async getContent(params?: {
    type?: string;
    authorId?: string;
    limit?: number;
  }): Promise<Content[]> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.authorId) queryParams.append('authorId', params.authorId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    return apiClient.get<Content[]>(
      `/api/content${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get content by ID
   * GET /api/content/:id
   * Headers: Authorization: Bearer <token>
   */
  async getContentById(id: string): Promise<Content> {
    return apiClient.get<Content>(`/api/content/${id}`);
  },

  /**
   * Create new content
   * POST /api/content
   * Headers: Authorization: Bearer <token>
   */
  async createContent(data: {
    title: string;
    body: string;
    type: string;
    authorId: string;
  }): Promise<Content> {
    return apiClient.post<Content>('/api/content', data);
  },

  /**
   * Update content
   * PUT /api/content/:id
   * Headers: Authorization: Bearer <token>
   */
  async updateContent(id: string, data: Partial<Content>): Promise<Content> {
    return apiClient.put<Content>(`/api/content/${id}`, data);
  },

  /**
   * Delete content
   * DELETE /api/content/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteContent(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/content/${id}`);
  },
};
