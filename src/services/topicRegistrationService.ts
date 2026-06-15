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
    return apiClient.post<ProposedTopic>('/api/topic-registrations/proposed-topics', data);
  },

  /**
   * Get proposed topics
   * GET /api/topic-registrations/proposed-topics
   */
  async getProposedTopics(thesisRoundId?: number): Promise<any[]> {
    const queryParams = thesisRoundId ? `?thesisRoundId=${thesisRoundId}` : '';
    const response = await apiClient.get<any>(`/api/thesis/available-topics${queryParams}`, true);
    const topics = response.data || [];
    return topics.map((t: any) => ({
      id: t.id,
      topic_code: t.topic_code || `TOPIC-${t.id}`,
      topic_title: t.topicTitle || t.topic_title,
      topic_description: t.topicDescription || t.topic_description,
      is_taken: false,
      instructors: { id: t.instructor?.id }
    }));
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
    return apiClient.get<ProposedTopic[]>(`/api/topic-registrations/proposed-topics?${queryParams}`);
  },

  /**
   * Create a topic registration (Student only)
   * POST /api/topic-registrations
   */
  async createTopicRegistration(data: CreateTopicRegistrationRequest): Promise<TopicRegistration> {
    return apiClient.post<TopicRegistration>('/api/topic-registrations', data);
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
    return apiClient.get<TopicRegistration[]>(`/api/topic-registrations${queryParams ? '?' + queryParams : ''}`);
  },

  /**
   * Get pending registrations for instructor
   * GET /api/topic-registrations/pending
   */
  async getPendingRegistrations(instructorId: number): Promise<TopicRegistration[]> {
    return apiClient.get<TopicRegistration[]>(`/api/topic-registrations/pending?instructor_id=${instructorId}`);
  },

  /**
   * Approve/Reject registration (Instructor)
   * PUT /api/topic-registrations/:id/approve
   */
  async approveRegistration(id: number, data: ApproveRegistrationRequest): Promise<TopicRegistration> {
    return apiClient.put<TopicRegistration>(`/api/topic-registrations/${id}/approve`, data);
  },

  /**
   * Final approve/reject (Head of Dept)
   * PUT /api/topic-registrations/:id/head-approve
   */
  async headApproveRegistration(id: number, data: HeadApproveRegistrationRequest): Promise<TopicRegistration> {
    return apiClient.put<TopicRegistration>(`/api/topic-registrations/${id}/head-approve`, data);
  },

  /**
   * Get pending registrations for department head
   * GET /api/topic-registrations/pending/head
   */
  async getPendingRegistrationsForHead(departmentId: number): Promise<TopicRegistration[]> {
    return apiClient.get<TopicRegistration[]>(`/api/topic-registrations/pending/head?department_id=${departmentId}`);
  },

  /**
   * Get registration details
   * GET /api/topic-registrations/:id
   */
  async getTopicRegistrationById(id: number): Promise<TopicRegistration> {
    return apiClient.get<TopicRegistration>(`/api/topic-registrations/${id}`);
  },
};
