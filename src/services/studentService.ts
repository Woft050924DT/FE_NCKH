import { apiClient } from './apiClient';
import type {
  StudentInstructor,
  GetInstructorsParams,
  StudentClass,
  StudentClassDetail,
  GetClassesParams,
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

  /**
   * Get all classes
   * GET /api/students/classes
   * Public endpoint - no authentication required
   */
  async getClasses(params?: GetClassesParams): Promise<StudentClass[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.department_id) {
      queryParams.append('department_id', params.department_id.toString());
    }
    if (params?.major_id) {
      queryParams.append('major_id', params.major_id.toString());
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/api/students/classes${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<StudentClass[]>(endpoint);
  },

  /**
   * Get class by ID with students
   * GET /api/students/classes/:id
   * Public endpoint - no authentication required
   */
  async getClassById(id: number): Promise<StudentClassDetail> {
    return apiClient.get<StudentClassDetail>(`/api/students/classes/${id}`);
  },
};
