import { apiClient } from './apiClient';
import type {
  CreateCouncilRequest,
  Council,
  UpdateCouncilRequest,
  DeleteCouncilResponse,
  StandardResponse,
} from './types';

export const councilService = {
  /**
   * Create a new defense council (public endpoint - no auth required)
   * POST /api/councils
   */
  async createCouncil(data: CreateCouncilRequest): Promise<Council> {
    return apiClient.post<Council>('/api/councils', data, false);
  },

  /**
   * Get list of defense councils with optional filters
   * GET /api/councils
   */
  async getCouncils(params?: {
    thesis_round_id?: number;
    status?: string;
    council_code?: string;
  }): Promise<Council[]> {
    const queryParams = new URLSearchParams();
    if (params?.thesis_round_id) queryParams.append('thesis_round_id', params.thesis_round_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.council_code) queryParams.append('council_code', params.council_code);
    
    const queryString = queryParams.toString();
    return apiClient.get<Council[]>(
      `/api/councils${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get council details by ID
   * GET /api/councils/:id
   */
  async getCouncilById(id: number): Promise<Council> {
    return apiClient.get<Council>(`/api/councils/${id}`);
  },

  /**
   * Update council information (ADMIN only)
   * PUT /api/councils/:id
   */
  async updateCouncil(id: number, data: UpdateCouncilRequest): Promise<Council> {
    return apiClient.put<Council>(`/api/councils/${id}`, data);
  },

  /**
   * Delete a council (ADMIN only)
   * DELETE /api/councils/:id
   */
  async deleteCouncil(id: number): Promise<DeleteCouncilResponse> {
    return apiClient.delete<DeleteCouncilResponse>(`/api/councils/${id}`);
  },
};
