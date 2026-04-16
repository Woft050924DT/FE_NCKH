import { apiClient } from './apiClient';
import type {
  CreateProposedTopicRequest,
  ProposedTopic,
  CreateTopicRegistrationRequest,
  TopicRegistration,
  ApproveRegistrationRequest,
  HeadApproveRegistrationRequest,
} from './types';

export const topicRegistrationService = {
  /**
   * Create a proposed topic (Instructor only)
   * POST /api/topic-registrations/proposed-topics
   */
  async createProposedTopic(data: CreateProposedTopicRequest): Promise<ProposedTopic> {
    return apiClient.post<ProposedTopic>('/api/topic-registrations/proposed-topics', data, false);
  },

  /**
   * Get proposed topics
   * GET /api/topic-registrations/proposed-topics
   */
  async getProposedTopics(thesisRoundId?: number): Promise<ProposedTopic[]> {
    const queryParams = thesisRoundId ? `?thesis_round_id=${thesisRoundId}` : '';
    return apiClient.get<ProposedTopic[]>(`/api/topic-registrations/proposed-topics${queryParams}`, false);
  },

  /**
   * Get proposed topics by instructor
   * GET /api/topic-registrations/proposed-topics?instructor_id=X
   */
  async getProposedTopicsByInstructor(instructorId: number, thesisRoundId?: number): Promise<ProposedTopic[]> {
    const params = new URLSearchParams();
    params.append('instructor_id', instructorId.toString());
    if (thesisRoundId) params.append('thesis_round_id', thesisRoundId.toString());
    const queryParams = params.toString();
    return apiClient.get<ProposedTopic[]>(`/api/topic-registrations/proposed-topics?${queryParams}`, false);
  },

  /**
   * Create a topic registration (Student only)
   * POST /api/topic-registrations
   */
  async createTopicRegistration(data: CreateTopicRegistrationRequest): Promise<TopicRegistration> {
    return apiClient.post<TopicRegistration>('/api/topic-registrations', data, false);
  },

  /**
   * Get topic registrations for current student
   * GET /api/topic-registrations
   */
  async getTopicRegistrations(studentId?: number, status?: string): Promise<TopicRegistration[]> {
    const params = new URLSearchParams();
    if (studentId) params.append('student_id', studentId.toString());
    if (status) params.append('status', status);
    const queryParams = params.toString();
    return apiClient.get<TopicRegistration[]>(`/api/topic-registrations${queryParams ? '?' + queryParams : ''}`, false);
  },

  /**
   * Get pending registrations (Instructor only)
   * GET /api/topic-registrations/pending
   */
  async getPendingRegistrations(instructorId: number): Promise<TopicRegistration[]> {
    return apiClient.get<TopicRegistration[]>(`/api/topic-registrations/pending?instructor_id=${instructorId}`, false);
  },

  /**
   * Approve/reject a registration (Instructor only)
   * PUT /api/topic-registrations/:id/approve
   */
  async approveRegistration(
    id: number,
    data: ApproveRegistrationRequest
  ): Promise<TopicRegistration> {
    return apiClient.put<TopicRegistration>(`/api/topic-registrations/${id}/approve`, data, false);
  },

  /**
   * Approve/reject a registration (Head only)
   * PUT /api/topic-registrations/:id/head-approve
   */
  async headApproveRegistration(
    id: number,
    data: HeadApproveRegistrationRequest
  ): Promise<TopicRegistration> {
    return apiClient.put<TopicRegistration>(`/api/topic-registrations/${id}/head-approve`, data, false);
  },

  /**
   * Get pending registrations for department head
   * GET /api/topic-registrations/pending/head
   */
  async getPendingRegistrationsForHead(departmentId: number): Promise<TopicRegistration[]> {
    return apiClient.get<TopicRegistration[]>(`/api/topic-registrations/pending/head?department_id=${departmentId}`, false);
  },
};
