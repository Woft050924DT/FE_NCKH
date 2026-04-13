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
  async getThesisGroups(thesisRoundId?: number): Promise<ThesisGroup[]> {
    const queryParams = thesisRoundId ? `?thesis_round_id=${thesisRoundId}` : '';
    return apiClient.get<ThesisGroup[]>(`/api/thesis-groups${queryParams}`);
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
  async acceptInvitation(id: number): Promise<GroupInvitation> {
    return apiClient.put<GroupInvitation>(`/api/thesis-groups/invitations/${id}/accept`);
  },

  /**
   * Reject a group invitation (Student only)
   * PUT /api/thesis-groups/invitations/:id/reject
   */
  async rejectInvitation(id: number): Promise<GroupInvitation> {
    return apiClient.put<GroupInvitation>(`/api/thesis-groups/invitations/${id}/reject`);
  },

  /**
   * Get invitations for current student
   * GET /api/thesis-groups/invitations
   */
  async getInvitations(): Promise<GroupInvitation[]> {
    return apiClient.get<GroupInvitation[]>('/api/thesis-groups/invitations');
  },
};
