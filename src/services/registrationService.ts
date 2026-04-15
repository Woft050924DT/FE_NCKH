import { apiClient } from './apiClient';
import type {
  InstructorReviewRequest,
  HeadReviewRequest,
  StandardResponse,
} from './types';

export const registrationService = {
  /**
   * Get registrations for instructor (Instructor only)
   * GET /api/instructor/registrations
   */
  async getInstructorRegistrations(
    params?: { status?: string; roundId?: number }
  ): Promise<StandardResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.roundId) queryParams.append('roundId', params.roundId.toString());
    
    const queryString = queryParams.toString();
    return apiClient.get<StandardResponse<any[]>>(
      `/api/instructor/registrations${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Instructor approve/reject registration (Instructor only)
   * PATCH /api/registrations/:registrationId/instructor-review
   */
  async instructorReview(
    registrationId: number,
    data: InstructorReviewRequest
  ): Promise<StandardResponse<any>> {
    return apiClient.patch<StandardResponse<any>>(
      `/api/registrations/${registrationId}/instructor-review`,
      data
    );
  },

  /**
   * Get registrations for department head (Department Head only)
   * GET /api/head/registrations
   */
  async getHeadRegistrations(
    params?: { roundId?: number; instructorStatus?: string; headStatus?: string }
  ): Promise<StandardResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.roundId) queryParams.append('roundId', params.roundId.toString());
    if (params?.instructorStatus) queryParams.append('instructorStatus', params.instructorStatus);
    if (params?.headStatus) queryParams.append('headStatus', params.headStatus);
    
    const queryString = queryParams.toString();
    return apiClient.get<StandardResponse<any[]>>(
      `/api/head/registrations${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Head approve/reject/override registration (Department Head only)
   * PATCH /api/registrations/:registrationId/head-review
   */
  async headReview(
    registrationId: number,
    data: HeadReviewRequest
  ): Promise<StandardResponse<any>> {
    return apiClient.patch<StandardResponse<any>>(
      `/api/registrations/${registrationId}/head-review`,
      data
    );
  },
};
