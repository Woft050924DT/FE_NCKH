import { apiClient } from './apiClient';

export const instructorService = {
  /**
   * Get instructors
   * GET /api/instructors
   * No authentication required
   */
  async getInstructors(params?: {
    thesis_round_id?: number;
    search?: string;
    department_id?: number;
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.thesis_round_id) queryParams.append('thesis_round_id', params.thesis_round_id.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department_id) queryParams.append('department_id', params.department_id.toString());
    
    const queryString = queryParams.toString();
    return apiClient.get<any[]>(`/api/instructors${queryString ? `?${queryString}` : ''}`, false);
  },

  /**
   * Get instructor by ID
   * GET /api/instructors/:id
   * No authentication required
   */
  async getInstructorById(id: number): Promise<any> {
    return apiClient.get<any>(`/api/instructors/${id}`, false);
  },

  /**
   * Get instructor by user ID
   * GET /api/instructors/by-user/:user_id
   * No authentication required
   */
  async getInstructorByUserId(userId: number): Promise<any> {
    return apiClient.get<any>(`/api/instructors/by-user/${userId}`, false);
  },

  /**
   * Create instructor
   * POST /api/instructors
   * No authentication required
   */
  async createInstructor(data: {
    instructor_code: string;
    department_id: number;
    degree: string;
    academic_title: string;
    specialization: string;
    years_of_experience: number;
    username: string;
    password: string;
    email: string;
    full_name: string;
    phone: string;
  }): Promise<any> {
    return apiClient.post<any>(`/api/instructors`, data, false);
  },

  /**
   * Get active thesis rounds for instructors
   * GET /api/instructors/thesis-rounds/active
   * Authentication required
   */
  async getActiveThesisRounds(): Promise<any[]> {
    return apiClient.get<any[]>(`/api/instructors/thesis-rounds/active`, true);
  },

  /**
   * Get supervised students for an instructor
   * GET /api/instructors/:id/supervised-students
   * Authentication required
   */
  async getSupervisedStudents(
    instructorId: number,
    params?: {
      thesis_round_id?: number;
      status?: string;
    }
  ): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.thesis_round_id) queryParams.append('thesis_round_id', params.thesis_round_id.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return apiClient.get<any[]>(
      `/api/instructors/${instructorId}/supervised-students${queryString ? `?${queryString}` : ''}`,
      true
    );
  },
};
