import { apiClient } from './apiClient';
import type {
  CreateThesisGroupRequest,
  ThesisGroup,
  CreateGroupInvitationRequest,
  GroupInvitation,
} from './types';

export const thesisGroupsService = {
  /**
   * Create a thesis group (Student only)
   * POST /api/thesis-groups
   */
  async createThesisGroup(data: CreateThesisGroupRequest): Promise<ThesisGroup> {
    return apiClient.post<ThesisGroup>('/api/thesis-groups', data);
  },

  /**
   * Get thesis groups
   * GET /api/thesis-groups
   */
  async getThesisGroups(studentId?: number, thesisRoundId?: number): Promise<ThesisGroup[]> {
    const params = new URLSearchParams();
    if (studentId) params.append('student_id', studentId.toString());
    if (thesisRoundId) params.append('thesis_round_id', thesisRoundId.toString());
    const queryParams = params.toString();
    return apiClient.get<ThesisGroup[]>(`/api/thesis-groups${queryParams ? '?' + queryParams : ''}`);
  },

  /**
   * Create a group invitation (Student only)
   * POST /api/thesis-groups/invitations
   */
  async createGroupInvitation(data: CreateGroupInvitationRequest): Promise<GroupInvitation> {
    return apiClient.post<GroupInvitation>('/api/thesis-groups/invitations', data);
  },

  /**
   * Accept a group invitation (Student only)
   * PUT /api/thesis-groups/invitations/:id/accept
   */
  async acceptInvitation(id: number, studentId: number): Promise<GroupInvitation> {
    return apiClient.put<GroupInvitation>(`/api/thesis-groups/invitations/${id}/accept`, { student_id: studentId });
  },

  /**
   * Reject a group invitation (Student only)
   * PUT /api/thesis-groups/invitations/:id/reject
   */
  async rejectInvitation(id: number, studentId: number): Promise<GroupInvitation> {
    return apiClient.put<GroupInvitation>(`/api/thesis-groups/invitations/${id}/reject`, { student_id: studentId });
  },

  /**
   * Get invitations for current student
   * GET /api/thesis-groups/invitations
   */
  async getInvitations(studentId: number): Promise<GroupInvitation[]> {
    return apiClient.get<GroupInvitation[]>(`/api/thesis-groups/invitations?student_id=${studentId}`);
  },
};
