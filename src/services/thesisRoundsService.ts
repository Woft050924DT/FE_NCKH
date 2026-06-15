import { apiClient } from './apiClient';
import type {
  CreateThesisRoundRequest,
  ThesisRound,
  ThesisRoundClass,
  GuidanceProcess,
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
  // ==========================================
  // ADMIN / HEAD ROUTES (/api/admin/thesis-rounds)
  // ==========================================

  /**
   * Create a new thesis round
   * POST /api/admin/thesis-rounds
   */
  async createThesisRound(data: CreateThesisRoundRequest): Promise<ThesisRound> {
    return apiClient.post<ThesisRound>('/api/admin/thesis-rounds', data);
  },

  /**
   * Get all thesis rounds
   * GET /api/admin/thesis-rounds
   */
  async getThesisRounds(): Promise<ThesisRound[]> {
    return apiClient.get<ThesisRound[]>('/api/admin/thesis-rounds', false);
  },

  /**
   * Get active thesis rounds
   * GET /api/admin/thesis-rounds/active
   */
  async getActiveThesisRoundsForAdmin(): Promise<ThesisRound[]> {
    return apiClient.get<ThesisRound[]>('/api/admin/thesis-rounds/active');
  },

  /**
   * Get thesis round by ID
   * GET /api/admin/thesis-rounds/:id
   */
  async getThesisRoundById(id: number): Promise<ThesisRound> {
    return apiClient.get<ThesisRound>(`/api/admin/thesis-rounds/${id}`);
  },

  /**
   * Activate a thesis round
   * PUT /api/admin/thesis-rounds/:id/activate
   */
  async activateThesisRound(id: number): Promise<ThesisRound> {
    return apiClient.put<ThesisRound>(`/api/admin/thesis-rounds/${id}/activate`);
  },

  /**
   * Update thesis round status
   * PATCH /api/admin/thesis-rounds/:roundId/status
   */
  async updateThesisRoundStatus(
    roundId: number,
    data: UpdateThesisRoundStatusRequest
  ): Promise<StandardResponse<ThesisRound>> {
    return apiClient.patch<StandardResponse<ThesisRound>>(
      `/api/admin/thesis-rounds/${roundId}/status`,
      data
    );
  },

  /**
   * Auto-update status (cron job trigger)
   * POST /api/admin/thesis-rounds/auto-update-status
   */
  async autoUpdateStatus(): Promise<{ updated: number }> {
    return apiClient.post<{ updated: number }>('/api/admin/thesis-rounds/auto-update-status');
  },

  /**
   * Assign instructors to a thesis round
   * POST /api/admin/thesis-rounds/:id/assign-instructors
   */
  async assignInstructors(
    id: number,
    data: { instructorIds: number[]; supervisionQuota: number }
  ): Promise<any> {
    return apiClient.post<any>(
      `/api/admin/thesis-rounds/${id}/assign-instructors`,
      data
    );
  },

  /**
   * Get instructor assignments for a thesis round
   * GET /api/admin/thesis-rounds/:id/instructors
   */
  async getInstructorAssignments(id: number): Promise<StandardResponse<InstructorAssignment[]>> {
    return apiClient.get<StandardResponse<InstructorAssignment[]>>(
      `/api/admin/thesis-rounds/${id}/instructors`
    );
  },

  /**
   * Assign classes to a thesis round
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
   * Add guidance process to a thesis round
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

  // ==========================================
  // ALIASES FOR COMPATIBILITY WITH HEAD USAGE
  // ==========================================
  async createThesisRoundForHead(data: CreateThesisRoundRequest): Promise<ThesisRound> {
    return this.createThesisRound(data);
  },
  async assignInstructorsToRound(
    roundId: number,
    data: { instructorIds: number[]; supervisionQuota: number }
  ): Promise<StandardResponse<any>> {
    const result = await this.assignInstructors(roundId, data);
    return { data: result };
  },
  async getThesisRoundsForHead(): Promise<ThesisRound[]> {
    return this.getThesisRounds();
  },
  async getActiveThesisRoundsForHead(): Promise<StandardResponse<ThesisRound[]>> {
    const rounds = await this.getActiveThesisRoundsForAdmin();
    return { data: rounds };
  },
  async getThesisRoundByIdForHead(id: number): Promise<StandardResponse<ThesisRound>> {
    const round = await this.getThesisRoundById(id);
    return { data: round };
  },
  async activateThesisRoundForHead(id: number): Promise<ThesisRound> {
    return this.activateThesisRound(id);
  },
  async assignClassesForHead(id: number, data: AssignClassesRequest): Promise<StandardResponse<ThesisRoundClass[]>> {
    const classes = await this.assignClasses(id, data);
    return { data: classes as any };
  },
  async addGuidanceProcessForHead(id: number, data: AddGuidanceProcessRequest): Promise<StandardResponse<GuidanceProcess[]>> {
    const process = await this.addGuidanceProcess(id, data);
    return { data: process as any };
  },
  async updateThesisRoundForHead(id: number, data: any): Promise<ThesisRound> {
    return apiClient.put<ThesisRound>(`/api/admin/thesis-rounds/${id}`, data);
  },
  async startThesisRoundForHead(id: number): Promise<ThesisRound> {
    const res = await this.updateThesisRoundStatus(id, { status: 'Ongoing' } as any);
    return res.data as any;
  },

  // ==========================================
  // INSTRUCTOR ROUTES
  // ==========================================

  /**
   * Get active thesis rounds for instructor
   * GET /api/admin/thesis-rounds/active
   */
  async getThesisRoundsForInstructor(): Promise<ThesisRound[]> {
    return apiClient.get<ThesisRound[]>('/api/admin/thesis-rounds/active');
  },

  /**
   * Get active thesis rounds (for instructor grading)
   * GET /api/admin/thesis-rounds/active
   */
  async getActiveThesisRounds(): Promise<ThesisRound[]> {
    return apiClient.get<ThesisRound[]>('/api/admin/thesis-rounds/active');
  },

  // ==========================================
  // STUDENT ROUTES
  // ==========================================

  /**
   * Get active thesis rounds for student
   * GET /api/students/thesis-rounds
   */
  async getThesisRoundsForStudent(): Promise<StandardResponse<ThesisRound[]>> {
    try {
      const rounds = await apiClient.get<ThesisRound[]>('/api/admin/thesis-rounds/active');
      return { success: true, data: rounds, message: 'Success' } as any;
    } catch (error: any) {
      console.error('Error fetching student thesis rounds:', error);
      return { success: false, data: [], message: error.message } as any;
    }
  },
};
