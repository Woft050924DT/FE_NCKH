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
};
