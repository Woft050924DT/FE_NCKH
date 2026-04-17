import { apiClient } from './apiClient';
import type {
  CreateReviewAssignmentRequest,
  ReviewAssignment,
  SubmitReviewResultRequest,
  ReviewResult,
  SubmitSupervisionCommentRequest,
  SupervisionComment,
  SubmitPeerEvaluationRequest,
  PeerEvaluation,
  ReviewWeeklyReportRequest,
  ThesisScores,
  SupervisionStudent,
  ReviewStudent,
  SupervisionCommentRequest,
  SupervisionCommentResponse,
  ReviewResultRequest,
  ReviewResultResponse,
  ThesisScoresResponse,
  WeeklyReportReviewRequest,
  WeeklyReportReviewResponse,
} from './types';

export const gradingService = {
  /**
   * Get supervision students (Instructor only)
   * GET /api/supervision-students
   */
  async getSupervisionStudents(instructorId?: number, thesisRoundId?: number): Promise<SupervisionStudent[]> {
    const params = new URLSearchParams();
    if (instructorId) params.append('instructor_id', instructorId.toString());
    if (thesisRoundId) params.append('thesis_round_id', thesisRoundId.toString());
    const queryString = params.toString();
    return apiClient.get<SupervisionStudent[]>(`/api/supervision-students${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get review students (Instructor only)
   * GET /api/review-students
   */
  async getReviewStudents(instructorId?: number, thesisRoundId?: number): Promise<ReviewStudent[]> {
    const params = new URLSearchParams();
    if (instructorId) params.append('instructor_id', instructorId.toString());
    if (thesisRoundId) params.append('thesis_round_id', thesisRoundId.toString());
    const queryString = params.toString();
    return apiClient.get<ReviewStudent[]>(`/api/review-students${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Submit supervision comment (Instructor only)
   * POST /api/supervision-comments
   */
  async submitSupervisionComment(data: SupervisionCommentRequest): Promise<SupervisionCommentResponse> {
    return apiClient.post<SupervisionCommentResponse>('/api/supervision-comments', data);
  },

  /**
   * Submit review result (Instructor only)
   * POST /api/review-results
   */
  async submitReviewResult(data: ReviewResultRequest): Promise<ReviewResultResponse> {
    return apiClient.post<ReviewResultResponse>('/api/review-results', data);
  },

  /**
   * Get thesis scores
   * GET /api/thesis-scores/:thesisId
   */
  async getThesisScores(thesisId: number): Promise<ThesisScoresResponse> {
    return apiClient.get<ThesisScoresResponse>(`/api/thesis-scores/${thesisId}`);
  },

  /**
   * Review weekly report (Instructor only)
   * PUT /api/weekly-reports/:id/review
   */
  async reviewWeeklyReport(id: number, data: WeeklyReportReviewRequest): Promise<WeeklyReportReviewResponse> {
    return apiClient.put<WeeklyReportReviewResponse>(`/api/weekly-reports/${id}/review`, data);
  },

  /**
   * Create a review assignment (Admin only)
   * POST /api/review-assignments
   */
  async createReviewAssignment(data: CreateReviewAssignmentRequest): Promise<ReviewAssignment> {
    return apiClient.post<ReviewAssignment>('/api/review-assignments', data);
  },

  /**
   * Submit a review result (Instructor only) - legacy
   * POST /api/review-results
   */
  async submitReviewResultLegacy(data: SubmitReviewResultRequest): Promise<ReviewResult> {
    return apiClient.post<ReviewResult>('/api/review-results', data);
  },

  /**
   * Submit a supervision comment (Instructor only) - legacy
   * POST /api/supervision-comments
   */
  async submitSupervisionCommentLegacy(data: SubmitSupervisionCommentRequest): Promise<SupervisionComment> {
    return apiClient.post<SupervisionComment>('/api/supervision-comments', data);
  },

  /**
   * Submit a peer evaluation (Student only)
   * POST /api/peer-evaluations
   */
  async submitPeerEvaluation(data: SubmitPeerEvaluationRequest): Promise<PeerEvaluation> {
    return apiClient.post<PeerEvaluation>('/api/peer-evaluations', data);
  },

  /**
   * Review a weekly report (Instructor only) - legacy
   * PUT /api/weekly-reports/:id/review
   */
  async reviewWeeklyReportLegacy(id: number, data: ReviewWeeklyReportRequest): Promise<any> {
    return apiClient.put(`/api/weekly-reports/${id}/review`, data);
  },

  /**
   * Get thesis scores - legacy
   * GET /api/thesis-scores/:thesisId
   */
  async getThesisScoresLegacy(thesisId: number): Promise<ThesisScores> {
    return apiClient.get<ThesisScores>(`/api/thesis-scores/${thesisId}`);
  },
};
