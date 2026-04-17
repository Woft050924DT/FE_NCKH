import { apiClient } from './apiClient';
import type {
  Faculty,
  CreateFacultyRequest,
  UpdateFacultyRequest,
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  Class,
  CreateClassRequest,
  UpdateClassRequest,
  UserManagement,
  CreateUserRequest,
  UpdateUserRequest,
  CreateStudentRequest,
  CreateInstructorRequest,
} from './types';

export const adminService = {
  // Faculty Management
  /**
   * Get all faculties
   * GET /api/admin/faculties
   */
  async getFaculties(): Promise<Faculty[]> {
    return apiClient.get<Faculty[]>('/api/admin/faculties');
  },

  /**
   * Get faculty by ID
   * GET /api/admin/faculties/:id
   */
  async getFacultyById(id: number): Promise<Faculty> {
    return apiClient.get<Faculty>(`/api/admin/faculties/${id}`);
  },

  /**
   * Create faculty
   * POST /api/admin/faculties
   */
  async createFaculty(data: CreateFacultyRequest): Promise<Faculty> {
    return apiClient.post<Faculty>('/api/admin/faculties', data);
  },

  /**
   * Update faculty
   * PUT /api/admin/faculties/:id
   */
  async updateFaculty(id: number, data: UpdateFacultyRequest): Promise<Faculty> {
    return apiClient.put<Faculty>(`/api/admin/faculties/${id}`, data);
  },

  /**
   * Delete faculty
   * DELETE /api/admin/faculties/:id
   */
  async deleteFaculty(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/faculties/${id}`);
  },

  // Department Management
  /**
   * Get all departments
   * GET /api/admin/departments
   */
  async getDepartments(params?: { faculty_id?: number }): Promise<Department[]> {
    const queryParams = new URLSearchParams();
    if (params?.faculty_id) {
      queryParams.append('faculty_id', params.faculty_id.toString());
    }
    const queryString = queryParams.toString();
    return apiClient.get<Department[]>(
      `/api/admin/departments${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get department by ID
   * GET /api/admin/departments/:id
   */
  async getDepartmentById(id: number): Promise<Department> {
    return apiClient.get<Department>(`/api/admin/departments/${id}`);
  },

  /**
   * Create department
   * POST /api/admin/departments
   */
  async createDepartment(data: CreateDepartmentRequest): Promise<Department> {
    return apiClient.post<Department>('/api/admin/departments', data);
  },

  /**
   * Update department
   * PUT /api/admin/departments/:id
   */
  async updateDepartment(id: number, data: UpdateDepartmentRequest): Promise<Department> {
    return apiClient.put<Department>(`/api/admin/departments/${id}`, data);
  },

  /**
   * Delete department
   * DELETE /api/admin/departments/:id
   */
  async deleteDepartment(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/departments/${id}`);
  },

  // Class Management
  /**
   * Get all classes
   * GET /api/admin/classes
   */
  async getClasses(params?: { major_id?: number }): Promise<Class[]> {
    const queryParams = new URLSearchParams();
    if (params?.major_id) {
      queryParams.append('major_id', params.major_id.toString());
    }
    const queryString = queryParams.toString();
    return apiClient.get<Class[]>(
      `/api/admin/classes${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get class by ID
   * GET /api/admin/classes/:id
   */
  async getClassById(id: number): Promise<Class> {
    return apiClient.get<Class>(`/api/admin/classes/${id}`);
  },

  /**
   * Create class
   * POST /api/admin/classes
   */
  async createClass(data: CreateClassRequest): Promise<Class> {
    return apiClient.post<Class>('/api/admin/classes', data);
  },

  /**
   * Update class
   * PUT /api/admin/classes/:id
   */
  async updateClass(id: number, data: UpdateClassRequest): Promise<Class> {
    return apiClient.put<Class>(`/api/admin/classes/${id}`, data);
  },

  /**
   * Delete class
   * DELETE /api/admin/classes/:id
   */
  async deleteClass(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/classes/${id}`);
  },

  // User Management
  /**
   * Get all users
   * GET /api/admin/users
   */
  async getUsers(params?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<UserManagement[]> {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return apiClient.get<UserManagement[]>(
      `/api/admin/users${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get user by ID
   * GET /api/admin/users/:id
   */
  async getUserById(id: number): Promise<UserManagement> {
    return apiClient.get<UserManagement>(`/api/admin/users/${id}`);
  },

  /**
   * Create user
   * POST /api/admin/users
   */
  async createUser(data: CreateUserRequest): Promise<UserManagement> {
    return apiClient.post<UserManagement>('/api/admin/users', data);
  },

  /**
   * Update user
   * PUT /api/admin/users/:id
   */
  async updateUser(id: number, data: UpdateUserRequest): Promise<UserManagement> {
    return apiClient.put<UserManagement>(`/api/admin/users/${id}`, data);
  },

  /**
   * Delete user
   * DELETE /api/admin/users/:id
   */
  async deleteUser(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/admin/users/${id}`);
  },

  /**
   * Create student with user
   * POST /api/admin/students
   */
  async createStudent(data: CreateStudentRequest): Promise<any> {
    return apiClient.post<any>('/api/admin/students', data);
  },

  /**
   * Create instructor with user
   * POST /api/admin/instructors
   */
  async createInstructor(data: CreateInstructorRequest): Promise<any> {
    return apiClient.post<any>('/api/admin/instructors', data);
  },

  /**
   * Get system statistics
   * GET /api/admin/statistics
   */
  async getStatistics(): Promise<{
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalFaculties: number;
    totalDepartments: number;
    totalClasses: number;
  }> {
    return apiClient.get<any>('/api/admin/statistics');
  },
};
