import { apiClient } from './apiClient';
import type {
  CreateThesisRoundRequest,
  ThesisRound,
  InstructorAssignment,
  AssignedInstructor,
  AssignClassesRequest,
  AssignedClass,
  AddGuidanceProcessRequest,
  GuidanceProcessResponse,
} from './types';

export const thesisRoundsService = {
  /**
   * Create a new thesis round (Admin only)
   * POST /api/admin/thesis-rounds
   */
  async createThesisRound(data: CreateThesisRoundRequest): Promise<ThesisRound> {
    return apiClient.post<ThesisRound>('/api/admin/thesis-rounds', data);
  },

  /**
   * Activate a thesis round (Admin only)
   * PUT /api/admin/thesis-rounds/:id/activate
   */
  async activateThesisRound(id: number): Promise<ThesisRound> {
    return apiClient.put<ThesisRound>(`/api/admin/thesis-rounds/${id}/activate`);
  },

  /**
   * Assign instructors to a thesis round (Admin only)
   * POST /api/admin/thesis-rounds/:id/assign-instructors
   */
  async assignInstructors(
    id: number,
    data: { instructors: InstructorAssignment[] }
  ): Promise<AssignedInstructor[]> {
    return apiClient.post<AssignedInstructor[]>(
      `/api/admin/thesis-rounds/${id}/assign-instructors`,
      data
    );
  },

  /**
   * Assign classes to a thesis round (Admin only)
   * POST /api/admin/thesis-rounds/:id/assign-classes
   */
  async assignClasses(
    id: number,
    data: AssignClassesRequest
  ): Promise<AssignedClass[]> {
    return apiClient.post<AssignedClass[]>(
      `/api/admin/thesis-rounds/${id}/assign-classes`,
      data
    );
  },

  /**
   * Add guidance process to a thesis round (Admin only)
   * POST /api/admin/thesis-rounds/:id/guidance-process
   */
  async addGuidanceProcess(
    id: number,
    data: AddGuidanceProcessRequest
  ): Promise<GuidanceProcessResponse[]> {
    return apiClient.post<GuidanceProcessResponse[]>(
      `/api/admin/thesis-rounds/${id}/guidance-process`,
      data
    );
  },

  /**
   * Get all thesis rounds (Admin only)
   * GET /api/admin/thesis-rounds
   */
  async getThesisRounds(): Promise<ThesisRound[]> {
    return apiClient.get<ThesisRound[]>('/api/admin/thesis-rounds');
  },

  /**
   * Get thesis round by ID (Admin only)
   * GET /api/admin/thesis-rounds/:id
   */
  async getThesisRoundById(id: number): Promise<ThesisRound> {
    return apiClient.get<ThesisRound>(`/api/admin/thesis-rounds/${id}`);
  },
};
