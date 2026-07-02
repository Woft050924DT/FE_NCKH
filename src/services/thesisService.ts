import { apiClient } from './apiClient';

export interface Thesis {
  id: string;
  title: string;
  description: string;
  studentId: string;
  advisorId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicRegistration {
  id: string;
  thesisId: string;
  topic: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyReport {
  id: string;
  thesisId: string;
  weekNumber: number;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThesisTask {
  id: string;
  thesisId: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const thesisService = {
  // Legacy Routes for /api/thesis
  /**
   * Get all theses
   * GET /api/thesis
   * Headers: Authorization: Bearer <token>
   */
  async getTheses(): Promise<Thesis[]> {
    return apiClient.get<Thesis[]>('/api/thesis');
  },

  /**
   * Get thesis by ID
   * GET /api/thesis/:id
   * Headers: Authorization: Bearer <token>
   */
  async getThesisById(id: string): Promise<Thesis> {
    return apiClient.get<Thesis>(`/api/thesis/${id}`);
  },

  /**
   * Create new thesis
   * POST /api/thesis
   * Headers: Authorization: Bearer <token>
   */
  async createThesis(data: Partial<Thesis>): Promise<Thesis> {
    return apiClient.post<Thesis>('/api/thesis', data);
  },

  /**
   * Update thesis
   * PUT /api/thesis/:id
   * Headers: Authorization: Bearer <token>
   */
  async updateThesis(id: string, data: Partial<Thesis>): Promise<Thesis> {
    return apiClient.put<Thesis>(`/api/thesis/${id}`, data);
  },

  /**
   * Delete thesis
   * DELETE /api/thesis/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteThesis(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/thesis/${id}`);
  },

  // Legacy Routes for /api/topic-registrations
  /**
   * Get all topic registrations
   * GET /api/topic-registrations
   * Headers: Authorization: Bearer <token>
   */
  async getTopicRegistrations(): Promise<TopicRegistration[]> {
    return apiClient.get<TopicRegistration[]>('/api/topic-registrations');
  },

  /**
   * Create topic registration
   * POST /api/topic-registrations
   * Headers: Authorization: Bearer <token>
   */
  async createTopicRegistration(data: Partial<TopicRegistration>): Promise<TopicRegistration> {
    return apiClient.post<TopicRegistration>('/api/topic-registrations', data);
  },

  /**
   * Update topic registration
   * PUT /api/topic-registrations/:id
   * Headers: Authorization: Bearer <token>
   */
  async updateTopicRegistration(id: string, data: Partial<TopicRegistration>): Promise<TopicRegistration> {
    return apiClient.put<TopicRegistration>(`/api/topic-registrations/${id}`, data);
  },

  /**
   * Delete topic registration
   * DELETE /api/topic-registrations/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteTopicRegistration(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/topic-registrations/${id}`);
  },

  // Legacy Routes for /api/weekly-reports
  /**
   * Get all weekly reports
   * GET /api/weekly-reports
   * Headers: Authorization: Bearer <token>
   */
  async getWeeklyReports(): Promise<WeeklyReport[]> {
    return apiClient.get<WeeklyReport[]>('/api/weekly-reports');
  },

  /**
   * Create weekly report
   * POST /api/weekly-reports
   * Headers: Authorization: Bearer <token>
   */
  async createWeeklyReport(data: Partial<WeeklyReport>): Promise<WeeklyReport> {
    return apiClient.post<WeeklyReport>('/api/weekly-reports', data);
  },

  /**
   * Update weekly report
   * PUT /api/weekly-reports/:id
   * Headers: Authorization: Bearer <token>
   */
  async updateWeeklyReport(id: string, data: Partial<WeeklyReport>): Promise<WeeklyReport> {
    return apiClient.put<WeeklyReport>(`/api/weekly-reports/${id}`, data);
  },

  /**
   * Delete weekly report
   * DELETE /api/weekly-reports/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteWeeklyReport(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/weekly-reports/${id}`);
  },

  // Legacy Routes for /api/thesis-tasks
  /**
   * Get all thesis tasks
   * GET /api/thesis-tasks
   * Headers: Authorization: Bearer <token>
   */
  async getThesisTasks(): Promise<ThesisTask[]> {
    return apiClient.get<ThesisTask[]>('/api/thesis-tasks');
  },

  /**
   * Create thesis task
   * POST /api/thesis-tasks
   * Headers: Authorization: Bearer <token>
   */
  async createThesisTask(data: Partial<ThesisTask>): Promise<ThesisTask> {
    return apiClient.post<ThesisTask>('/api/thesis-tasks', data);
  },

  /**
   * Update thesis task
   * PUT /api/thesis-tasks/:id
   * Headers: Authorization: Bearer <token>
   */
  async updateThesisTask(id: string, data: Partial<ThesisTask>): Promise<ThesisTask> {
    return apiClient.put<ThesisTask>(`/api/thesis-tasks/${id}`, data);
  },

  /**
   * Delete thesis task
   * DELETE /api/thesis-tasks/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteThesisTask(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/thesis-tasks/${id}`);
  },
};
