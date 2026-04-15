import { apiClient } from './apiClient';
import type {
  CreateThesisGroupRequest,
  ThesisGroup,
  CreateGroupInvitationRequest,
  GroupInvitation,
  InviteMemberRequest,
  RespondInvitationRequest,
  RegisterTopicRequest,
  StandardResponse,
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

  /**
   * Create group in thesis round (Student only)
   * POST /api/thesis-rounds/:roundId/groups
   */
  async createGroupInRound(
    roundId: number,
    data: { groupName?: string; groupType: 'INDIVIDUAL' | 'GROUP' }
  ): Promise<StandardResponse<ThesisGroup>> {
    return apiClient.post<StandardResponse<ThesisGroup>>(
      `/api/thesis-rounds/${roundId}/groups`,
      data
    );
  },

  /**
   * Invite member to group (Student - LEADER only)
   * POST /api/groups/:groupId/invite
   */
  async inviteMember(groupId: number, data: InviteMemberRequest): Promise<StandardResponse<GroupInvitation>> {
    return apiClient.post<StandardResponse<GroupInvitation>>(
      `/api/groups/${groupId}/invite`,
      data
    );
  },

  /**
   * Respond to group invitation (Student only)
   * PATCH /api/invitations/:invitationId/respond
   */
  async respondInvitation(
    invitationId: number,
    data: RespondInvitationRequest
  ): Promise<StandardResponse<GroupInvitation>> {
    return apiClient.patch<StandardResponse<GroupInvitation>>(
      `/api/invitations/${invitationId}/respond`,
      data
    );
  },

  /**
   * Register topic for group (Student - LEADER only)
   * POST /api/groups/:groupId/register-topic
   */
  async registerTopic(groupId: number, data: RegisterTopicRequest): Promise<StandardResponse<any>> {
    return apiClient.post<StandardResponse<any>>(
      `/api/groups/${groupId}/register-topic`,
      data
    );
  },
};
