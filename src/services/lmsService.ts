import { apiClient } from './apiClient';

export interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  credits: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
}

export const lmsService = {
  /**
   * Get all courses
   * GET /api/courses
   * Headers: Authorization: Bearer <token>
   */
  async getCourses(): Promise<Course[]> {
    return apiClient.get<Course[]>('/api/courses');
  },

  /**
   * Get course by ID
   * GET /api/courses/:id
   * Headers: Authorization: Bearer <token>
   */
  async getCourseById(id: string): Promise<Course> {
    return apiClient.get<Course>(`/api/courses/${id}`);
  },

  /**
   * Create a new course
   * POST /api/courses
   * Headers: Authorization: Bearer <token>
   */
  async createCourse(data: {
    name: string;
    description: string;
    instructor: string;
    credits: number;
  }): Promise<Course> {
    return apiClient.post<Course>('/api/courses', data);
  },

  /**
   * Update a course
   * PUT /api/courses/:id
   * Headers: Authorization: Bearer <token>
   */
  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    return apiClient.put<Course>(`/api/courses/${id}`, data);
  },

  /**
   * Delete a course
   * DELETE /api/courses/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteCourse(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/courses/${id}`);
  },

  /**
   * Get enrollments for a course
   * GET /api/courses/:id/enrollments
   * Headers: Authorization: Bearer <token>
   */
  async getCourseEnrollments(id: string): Promise<Enrollment[]> {
    return apiClient.get<Enrollment[]>(`/api/courses/${id}/enrollments`);
  },

  /**
   * Enroll in a course
   * POST /api/courses/:id/enroll
   * Headers: Authorization: Bearer <token>
   */
  async enrollInCourse(id: string): Promise<Enrollment> {
    return apiClient.post<Enrollment>(`/api/courses/${id}/enroll`);
  },
};
