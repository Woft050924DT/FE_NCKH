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
   * Request body includes: group_name, thesis_round_id, group_type, min_members, max_members, student_id
   */
  async createThesisGroup(data: CreateThesisGroupRequest): Promise<ThesisGroup> {
    return apiClient.post<ThesisGroup>('/api/thesis-groups', data);
  },

  /**
   * Get thesis groups
   * GET /api/thesis-groups
   * Query params: student_id (optional), thesis_round_id (optional)
   */
  async getThesisGroups(studentId?: number, thesisRoundId?: number): Promise<ThesisGroup[]> {
    const params = new URLSearchParams();
    if (studentId) params.append('student_id', studentId.toString());
    if (thesisRoundId) params.append('thesis_round_id', thesisRoundId.toString());
    const queryParams = params.toString();
    return apiClient.get<ThesisGroup[]>(`/api/thesis-groups${queryParams ? '?' + queryParams : ''}`);
  },

  /**
   * Create a group invitation (Student - LEADER only)
   * POST /api/thesis-groups/invitations
   * Request body includes: thesis_group_id, invited_student_id, invitation_message, student_id
   */
  async createGroupInvitation(data: CreateGroupInvitationRequest): Promise<GroupInvitation> {
    return apiClient.post<GroupInvitation>('/api/thesis-groups/invitations', data);
  },

  /**
   * Accept a group invitation (Student only)
   * PUT /api/thesis-groups/invitations/:id/accept
   * Request body includes: student_id
   */
  async acceptInvitation(id: number, studentId: number): Promise<GroupInvitation> {
    return apiClient.put<GroupInvitation>(`/api/thesis-groups/invitations/${id}/accept`, { student_id: studentId });
  },

  /**
   * Reject a group invitation (Student only)
   * PUT /api/thesis-groups/invitations/:id/reject
   * Request body includes: student_id
   */
  async rejectInvitation(id: number, studentId: number): Promise<GroupInvitation> {
    return apiClient.put<GroupInvitation>(`/api/thesis-groups/invitations/${id}/reject`, { student_id: studentId });
  },

  /**
   * Get invitations for current student
   * GET /api/thesis-groups/invitations
   * Query param: student_id (required)
   */
  async getInvitations(studentId: number): Promise<GroupInvitation[]> {
    return apiClient.get<GroupInvitation[]>(`/api/thesis-groups/invitations?student_id=${studentId}`);
  },
};
