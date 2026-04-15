import { apiClient } from './apiClient';
import type {
  StudentInstructor,
  GetInstructorsParams,
} from './types';

export const studentService = {
  /**
   * Get list of instructors for students
   * GET /api/students/instructors
   * Authentication required
   */
  async getInstructors(params?: GetInstructorsParams): Promise<StudentInstructor[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.thesis_round_id) {
      queryParams.append('thesis_round_id', params.thesis_round_id.toString());
    }
    if (params?.department_id) {
      queryParams.append('department_id', params.department_id.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/api/students/instructors${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<StudentInstructor[]>(endpoint);
  },
};
