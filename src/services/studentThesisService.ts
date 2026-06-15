import { apiClient } from './apiClient';
import type {
  ThesisRound,
  ProposedTopic,
  TopicRegistration,
  StandardResponse,
} from './types';

export const studentThesisService = {
  /**
   * Get all thesis rounds for student
   * GET /api/thesis/thesis-rounds
   */
  async getAllThesisRounds(): Promise<StandardResponse<ThesisRound[]>> {
    return apiClient.get<StandardResponse<ThesisRound[]>>('/api/thesis/thesis-rounds');
  },

  /**
   * Get available topics for student
   * GET /api/thesis/available-topics
   */
  async getAvailableTopics(): Promise<StandardResponse<ProposedTopic[]>> {
    return apiClient.get<StandardResponse<ProposedTopic[]>>('/api/thesis/available-topics');
  },

  /**
   * Get student's registrations
   * GET /api/thesis/my-registrations
   */
  async getMyRegistrations(): Promise<StandardResponse<TopicRegistration[]>> {
    return apiClient.get<StandardResponse<TopicRegistration[]>>('/api/thesis/my-registrations');
  },
};
