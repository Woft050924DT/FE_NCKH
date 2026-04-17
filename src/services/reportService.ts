import { apiClient } from './apiClient';
import type {
  CreateThesisTaskRequest,
  UpdateThesisTaskRequest,
  ThesisTask,
  CreateWeeklyReportRequest,
  UpdateWeeklyReportRequest,
  WeeklyReport,
  AddContributionRequest,
  WeeklyReportContribution,
  SubmitFinalReportRequest,
  ThesisProgress,
  SubmitWeeklyReportRequest,
  WeeklyReportFeedbackRequest,
  StandardResponse,
} from './types';

export const reportService = {
  /**
   * Create a thesis task (Student only)
   * POST /api/thesis-tasks
   */
  async createThesisTask(data: CreateThesisTaskRequest): Promise<ThesisTask> {
    return apiClient.post<ThesisTask>('/api/thesis-tasks', data);
  },

  /**
   * Update a thesis task
   * PUT /api/thesis-tasks/:id
   */
  async updateThesisTask(id: number, data: UpdateThesisTaskRequest): Promise<ThesisTask> {
    return apiClient.put<ThesisTask>(`/api/thesis-tasks/${id}`, data);
  },

  /**
   * Get thesis tasks
   * GET /api/thesis-tasks
   */
  async getThesisTasks(thesisId?: number): Promise<ThesisTask[]> {
    const queryParams = thesisId ? `?thesis_id=${thesisId}` : '';
    return apiClient.get<ThesisTask[]>(`/api/thesis-tasks${queryParams}`);
  },

  /**
   * Create a weekly report (Student only)
   * POST /api/weekly-reports
   */
  async createWeeklyReport(data: CreateWeeklyReportRequest): Promise<WeeklyReport> {
    return apiClient.post<WeeklyReport>('/api/weekly-reports', data);
  },

  /**
   * Update a weekly report
   * PUT /api/weekly-reports/:id
   */
  async updateWeeklyReport(id: number, data: UpdateWeeklyReportRequest): Promise<WeeklyReport> {
    return apiClient.put<WeeklyReport>(`/api/weekly-reports/${id}`, data);
  },

  /**
   * Get weekly reports
   * GET /api/weekly-reports
   */
  async getWeeklyReports(thesisId?: number): Promise<WeeklyReport[]> {
    const queryParams = thesisId ? `?thesis_id=${thesisId}` : '';
    return apiClient.get<WeeklyReport[]>(`/api/weekly-reports${queryParams}`);
  },

  /**
   * Add individual contribution to weekly report (Student only)
   * POST /api/weekly-report-contributions
   */
  async addContribution(data: AddContributionRequest): Promise<WeeklyReportContribution> {
    return apiClient.post<WeeklyReportContribution>('/api/weekly-report-contributions', data);
  },

  /**
   * Submit final report (Student only)
   * PUT /api/theses/:id/submit-final-report
   */
  async submitFinalReport(id: number, data: SubmitFinalReportRequest): Promise<any> {
    return apiClient.put(`/api/theses/${id}/submit-final-report`, data);
  },

  /**
   * Get thesis progress
   * GET /api/reports/thesis-progress/:thesisId
   */
  async getThesisProgress(thesisId: number): Promise<ThesisProgress> {
    return apiClient.get<ThesisProgress>(`/api/reports/thesis-progress/${thesisId}`);
  },

  /**
   * Submit weekly report for thesis (Student only)
   * POST /api/theses/:thesisId/weekly-reports
   */
  async submitWeeklyReport(thesisId: number, data: SubmitWeeklyReportRequest): Promise<StandardResponse<WeeklyReport>> {
    return apiClient.post<StandardResponse<WeeklyReport>>(
      `/api/theses/${thesisId}/weekly-reports`,
      data
    );
  },

  /**
   * Get weekly reports for thesis (Student member or Instructor supervisor)
   * GET /api/theses/:thesisId/weekly-reports
   */
  async getThesisWeeklyReports(thesisId: number): Promise<StandardResponse<WeeklyReport[]>> {
    return apiClient.get<StandardResponse<WeeklyReport[]>>(
      `/api/theses/${thesisId}/weekly-reports`
    );
  },

  /**
   * Provide feedback on weekly report (Instructor only)
   * PATCH /api/weekly-reports/:reportId/feedback
   */
  async provideWeeklyReportFeedback(
    reportId: number,
    data: WeeklyReportFeedbackRequest
  ): Promise<StandardResponse<WeeklyReport>> {
    return apiClient.patch<StandardResponse<WeeklyReport>>(
      `/api/weekly-reports/${reportId}/feedback`,
      data
    );
  },

  /**
   * Get individual thesis reports for a student
   * GET /api/reports/individual-thesis-reports
   */
  async getIndividualThesisReports(studentId: number): Promise<StandardResponse<any[]>> {
    return apiClient.get<StandardResponse<any[]>>(
      `/api/reports/individual-thesis-reports?student_id=${studentId}`
    );
  },
};
