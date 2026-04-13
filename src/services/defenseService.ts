import { apiClient } from './apiClient';
import type {
  CreateDefenseCouncilRequest,
  DefenseCouncil,
  AddCouncilMemberRequest,
  CouncilMember,
  CreateDefenseAssignmentRequest,
  DefenseAssignment,
  SubmitDefenseResultRequest,
  DefenseResult,
  DefenseSchedule,
  DefenseResults,
} from './types';

export const defenseService = {
  /**
   * Create a defense council (Admin only)
   * POST /api/defense-councils
   */
  async createDefenseCouncil(data: CreateDefenseCouncilRequest): Promise<DefenseCouncil> {
    return apiClient.post<DefenseCouncil>('/api/defense-councils', data);
  },

  /**
   * Add a member to defense council (Admin only)
   * POST /api/defense-councils/:id/members
   */
  async addCouncilMember(id: number, data: AddCouncilMemberRequest): Promise<CouncilMember> {
    return apiClient.post<CouncilMember>(`/api/defense-councils/${id}/members`, data);
  },

  /**
   * Create a defense assignment (Admin only)
   * POST /api/defense-assignments
   */
  async createDefenseAssignment(data: CreateDefenseAssignmentRequest): Promise<DefenseAssignment> {
    return apiClient.post<DefenseAssignment>('/api/defense-assignments', data);
  },

  /**
   * Submit defense result (Instructor only)
   * POST /api/defense-results
   */
  async submitDefenseResult(data: SubmitDefenseResultRequest): Promise<DefenseResult> {
    return apiClient.post<DefenseResult>('/api/defense-results', data);
  },

  /**
   * Complete a defense council (Admin only)
   * PUT /api/defense-councils/:id/complete
   */
  async completeDefenseCouncil(id: number): Promise<DefenseCouncil> {
    return apiClient.put<DefenseCouncil>(`/api/defense-councils/${id}/complete`);
  },

  /**
   * Get defense schedule for a thesis
   * GET /api/defense-schedule/:thesisId
   */
  async getDefenseSchedule(thesisId: number): Promise<DefenseSchedule> {
    return apiClient.get<DefenseSchedule>(`/api/defense-schedule/${thesisId}`);
  },

  /**
   * Get defense results for a thesis
   * GET /api/defense-results/:thesisId
   */
  async getDefenseResults(thesisId: number): Promise<DefenseResults> {
    return apiClient.get<DefenseResults>(`/api/defense-results/${thesisId}`);
  },

  /**
   * Finalize a thesis (Admin only)
   * PUT /api/theses/:id/finalize
   */
  async finalizeThesis(id: number): Promise<any> {
    return apiClient.put(`/api/theses/${id}/finalize`);
  },
};
