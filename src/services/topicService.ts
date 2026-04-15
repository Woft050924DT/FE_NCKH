import { apiClient } from './apiClient';
import type {
  CreateTopicRequest,
  ProposedTopic,
  StandardResponse,
} from './types';

export const topicService = {
  /**
   * Create a new topic for a thesis round (Instructor only)
   * POST /api/thesis-rounds/:roundId/topics
   */
  async createTopic(roundId: number, data: CreateTopicRequest): Promise<StandardResponse<ProposedTopic>> {
    return apiClient.post<StandardResponse<ProposedTopic>>(
      `/api/thesis-rounds/${roundId}/topics`,
      data
    );
  },

  /**
   * Get topics for a thesis round
   * GET /api/thesis-rounds/:roundId/topics
   */
  async getTopics(
    roundId: number,
    params?: { isTaken?: boolean; instructorId?: number }
  ): Promise<StandardResponse<ProposedTopic[]>> {
    const queryParams = new URLSearchParams();
    if (params?.isTaken !== undefined) queryParams.append('isTaken', params.isTaken.toString());
    if (params?.instructorId) queryParams.append('instructorId', params.instructorId.toString());
    
    const queryString = queryParams.toString();
    return apiClient.get<StandardResponse<ProposedTopic[]>>(
      `/api/thesis-rounds/${roundId}/topics${queryString ? `?${queryString}` : ''}`
    );
  },
};
