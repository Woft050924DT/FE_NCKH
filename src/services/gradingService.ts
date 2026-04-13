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
} from './types';

export const gradingService = {
  /**
   * Create a review assignment (Admin only)
   * POST /api/review-assignments
   */
  async createReviewAssignment(data: CreateReviewAssignmentRequest): Promise<ReviewAssignment> {
    return apiClient.post<ReviewAssignment>('/api/review-assignments', data);
  },

  /**
   * Submit a review result (Instructor only)
   * POST /api/review-results
   */
  async submitReviewResult(data: SubmitReviewResultRequest): Promise<ReviewResult> {
    return apiClient.post<ReviewResult>('/api/review-results', data);
  },

  /**
   * Submit a supervision comment (Instructor only)
   * POST /api/supervision-comments
   */
  async submitSupervisionComment(data: SubmitSupervisionCommentRequest): Promise<SupervisionComment> {
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
   * Review a weekly report (Instructor only)
   * PUT /api/weekly-reports/:id/review
   */
  async reviewWeeklyReport(id: number, data: ReviewWeeklyReportRequest): Promise<any> {
    return apiClient.put(`/api/weekly-reports/${id}/review`, data);
  },

  /**
   * Get thesis scores
   * GET /api/thesis-scores/:thesisId
   */
  async getThesisScores(thesisId: number): Promise<ThesisScores> {
    return apiClient.get<ThesisScores>(`/api/thesis-scores/${thesisId}`);
  },
};
