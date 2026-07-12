import { apiClient } from './apiClient';
import type {
  CreateProposedTopicRequest,
  ProposedTopic,
  CreateTopicRegistrationRequest,
  TopicRegistration,
} from './types';

export const topicRegistrationService = {
  // ─── Proposed Topics ──────────────────────────────────────────────────────

  async createProposedTopic(data: CreateProposedTopicRequest): Promise<ProposedTopic> {
    return apiClient.post<ProposedTopic>('/api/topic-registrations/proposed-topics', data);
  },

  async getProposedTopics(thesisRoundId?: number): Promise<ProposedTopic[]> {
    const q = thesisRoundId ? `?thesis_round_id=${thesisRoundId}` : '';
    return apiClient.get<ProposedTopic[]>(`/api/topic-registrations/proposed-topics${q}`);
  },

  async getProposedTopicsByInstructor(instructorId: number, thesisRoundId?: number): Promise<ProposedTopic[]> {
    const p = new URLSearchParams({ instructor_id: instructorId.toString() });
    if (thesisRoundId) p.append('thesis_round_id', thesisRoundId.toString());
    return apiClient.get<ProposedTopic[]>(`/api/topic-registrations/proposed-topics?${p.toString()}`);
  },

  // ─── Student: Đăng ký đề tài ──────────────────────────────────────────────
  // Gateway: /api/topic-registrations/** → ThesisService /api/v1/thesis/student/topic-registrations/**

  async createTopicRegistration(data: CreateTopicRegistrationRequest): Promise<TopicRegistration> {
    return apiClient.post<TopicRegistration>('/api/topic-registrations', data);
  },

  async getTopicRegistrations(studentId?: number, status?: string): Promise<TopicRegistration[]> {
    const p = new URLSearchParams();
    if (studentId) p.append('student_id', studentId.toString());
    if (status) p.append('status', status);
    const q = p.toString();
    return apiClient.get<TopicRegistration[]>(`/api/topic-registrations${q ? '?' + q : ''}`);
  },

  async getTopicRegistrationById(id: number): Promise<TopicRegistration> {
    return apiClient.get<TopicRegistration>(`/api/topic-registrations/${id}`);
  },

  // ─── Instructor: Duyệt đề tài ─────────────────────────────────────────────
  // Đi thẳng qua gateway route: /api/v1/thesis/** → ThesisService /api/v1/thesis/**

  async getRegistrationsForInstructor(status?: string): Promise<TopicRegistration[]> {
    const res = await apiClient.get<{ success: boolean; data: TopicRegistration[] }>(
      `/api/v1/thesis/instructor/topic-registrations${status ? `?instructor_status=${status}` : ''}`
    );
    return res.data ?? [];
  },

  /** Giảng viên duyệt đề tài */
  async instructorApprove(id: number): Promise<any> {
    return apiClient.put(`/api/v1/thesis/instructor/topic-registrations/${id}/approve`);
  },

  /** Giảng viên từ chối đề tài */
  async instructorReject(id: number, reason: string): Promise<any> {
    return apiClient.put(`/api/v1/thesis/instructor/topic-registrations/${id}/reject`, { reason });
  },

  // ─── Trưởng Bộ Môn: Duyệt đề tài ─────────────────────────────────────────
  // Gateway: /api/admin/** → ThesisService /api/v1/thesis/admin/**

  async getRegistrationsForHead(params?: { instructor_status?: string; head_status?: string }): Promise<TopicRegistration[]> {
    const q = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const res = await apiClient.get<{ success: boolean; data: TopicRegistration[] }>(
      `/api/admin/topic-registrations${q}`
    );
    return res.data ?? [];
  },

  /** Trưởng bộ môn duyệt đề tài */
  async headApprove(id: number): Promise<any> {
    return apiClient.put(`/api/admin/topic-registrations/${id}/approve`);
  },

  /** Trưởng bộ môn từ chối đề tài */
  async headReject(id: number, reason: string): Promise<any> {
    return apiClient.put(`/api/admin/topic-registrations/${id}/reject`, { reason });
  },

  // ─── Backward compatibility (các page cũ dùng, sẽ dần thay thế) ─────────

  /** @deprecated dùng instructorApprove / instructorReject */
  async approveRegistration(id: number, data: { status: string; rejection_reason?: string }): Promise<any> {
    return data.status === 'APPROVED'
      ? this.instructorApprove(id)
      : this.instructorReject(id, data.rejection_reason || '');
  },

  /** @deprecated dùng headApprove / headReject */
  async headApproveRegistration(id: number, data: { status: string; rejection_reason?: string }): Promise<any> {
    return data.status === 'APPROVED'
      ? this.headApprove(id)
      : this.headReject(id, data.rejection_reason || '');
  },

  async getPendingRegistrations(_instructorId: number): Promise<TopicRegistration[]> {
    return this.getRegistrationsForInstructor('PENDING');
  },

  async getPendingRegistrationsForHead(_departmentId: number): Promise<TopicRegistration[]> {
    return this.getRegistrationsForHead({ instructor_status: 'APPROVED', head_status: 'PENDING' });
  },
};
