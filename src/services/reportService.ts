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
   * GET /api/thesis-progress/:thesisId
   */
  async getThesisProgress(thesisId: number): Promise<ThesisProgress> {
    return apiClient.get<ThesisProgress>(`/api/thesis-progress/${thesisId}`);
  },
};
