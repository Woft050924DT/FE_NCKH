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
  UpdateThesisRoundStatusRequest,
  StandardResponse,
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
   * Create a new thesis round (Head of Department)
   * POST /api/department-head/thesis-rounds
   */
  async createThesisRoundForHead(data: CreateThesisRoundRequest): Promise<ThesisRound> {
    return apiClient.post<ThesisRound>('/api/department-head/thesis-rounds', data);
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
   * Assign instructors to a thesis round (Department Head)
   * POST /api/department-head/thesis-rounds/:id/assign-instructors
   */
  async assignInstructorsToRound(
    roundId: number,
    data: { instructorIds: number[]; supervisionQuota: number }
  ): Promise<StandardResponse<AssignedInstructor[]>> {
    return apiClient.post<StandardResponse<AssignedInstructor[]>>(
      `/api/department-head/thesis-rounds/${roundId}/assign-instructors`,
      data
    );
  },

  /**
   * Update thesis round status (Department Head)
   * PATCH /api/thesis-rounds/:roundId/status
   */
  async updateThesisRoundStatus(
    roundId: number,
    data: UpdateThesisRoundStatusRequest
  ): Promise<StandardResponse<ThesisRound>> {
    return apiClient.patch<StandardResponse<ThesisRound>>(
      `/api/thesis-rounds/${roundId}/status`,
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

  /**
   * Get all thesis rounds (Head of Department)
   * GET /api/department-head/thesis-rounds
   */
  async getThesisRoundsForHead(): Promise<ThesisRound[]> {
    return apiClient.get<ThesisRound[]>('/api/department-head/thesis-rounds');
  },

  /**
   * Activate thesis round (Preparing → Active) - Head of Department
   * PUT /api/department-head/thesis-rounds/:id/activate
   */
  async activateThesisRoundForHead(id: number): Promise<ThesisRound> {
    return apiClient.put<ThesisRound>(`/api/department-head/thesis-rounds/${id}/activate`);
  },

  /**
   * Start thesis round (Active → In Progress) - Head of Department
   * PUT /api/department-head/thesis-rounds/:id/start
   */
  async startThesisRoundForHead(id: number): Promise<ThesisRound> {
    return apiClient.put<ThesisRound>(`/api/department-head/thesis-rounds/${id}/start`);
  },

  /**
   * Auto-update status (cron job)
   * POST /api/department-head/thesis-rounds/auto-update-status
   */
  async autoUpdateStatus(): Promise<{ updated: number }> {
    return apiClient.post<{ updated: number }>('/api/department-head/thesis-rounds/auto-update-status');
  },

  /**
   * Get active thesis rounds for instructor
   * GET /api/instructor/thesis-rounds
   */
  async getThesisRoundsForInstructor(): Promise<ThesisRound[]> {
    return apiClient.get<ThesisRound[]>('/api/instructors/thesis-rounds');
  },

  /**
   * Get active thesis rounds for student
   * GET /api/students/thesis-rounds
   */
  async getThesisRoundsForStudent(): Promise<StandardResponse<ThesisRound[]>> {
    return apiClient.get<StandardResponse<ThesisRound[]>>('/api/students/thesis-rounds');
  },
};
