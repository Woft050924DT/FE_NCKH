import axios, { AxiosRequestConfig } from 'axios';
import { utils } from '../utils/Helper'; // Import utils từ file utils.ts
// 1. Định nghĩa hoặc import đối tượng utils ở đây

// 2. Thêm kiểu dữ liệu TypeScript cho createAPIHelper
const createAPIHelper = (api: string) => ({
  // Gộp params và option vào cùng 1 object cấu hình
  search: (params?: any, option?: AxiosRequestConfig) =>
    axios.get(api, { ...option, params: utils.filterObject(params) }),

  count: (params?: any, option?: AxiosRequestConfig) =>
    axios.get(`${api}/count`, {
      ...option,
      params: utils.filterObject(params),
    }),

  fetch: (params?: any, option?: AxiosRequestConfig) =>
    axios.get(api, { ...option, params: utils.filterObject(params) }),

  fetchOne: (id: string | number, option?: AxiosRequestConfig) =>
    axios.get(`${api}/${id}`, option), // Hàm này 2 tham số sẵn rồi nên giữ nguyên

  // Các hàm post, put bên dưới nhận 3 tham số (url, data, config) nên giữ nguyên:
  create: (params?: any, options?: AxiosRequestConfig) =>
    axios.post(api, utils.filterObject(params), options),

  update: (id: string | number, params?: any, option?: AxiosRequestConfig) =>
    axios.put(`${api}/${id}`, utils.filterObject(params), option),

  remove: (id: string | number, option?: AxiosRequestConfig) =>
    axios.delete(`${api}/${id}`, option),
});

// 3. Sửa tên hằng số cho đúng chính tả tiếng Anh (Endprints -> Endpoints)
export const API_ENDPOINTS = {
  // Faculty Management
  FACULTIES: '/api/admin/faculties',
  DEPARTMENTS: '/api/admin/departments',
  CLASSES: '/api/admin/classes',
  USERS: '/api/admin/users',
  STUDENT: '/api/admin/students',
  INSTRUCTOR: '/api/admin/instructors',
  STATISTICS: '/api/admin/statistics', // Thêm endpoint cho thống kê
  // Nên chỉ rõ endpoint cụ thể của faculties thay vì chỉ để chung chung là '/api/admin'
};

export const AdminRouter = {
  ...createAPIHelper(API_ENDPOINTS.FACULTIES),
  ...createAPIHelper(API_ENDPOINTS.DEPARTMENTS),
  ...createAPIHelper(API_ENDPOINTS.CLASSES),
  ...createAPIHelper(API_ENDPOINTS.USERS),

  // Faculty Management
  getFaculties: (data?: any) =>
    axios.get(API_ENDPOINTS.FACULTIES, { params: utils.filterObject(data) }),
  getFacultyById: (id: number) => axios.get(`${API_ENDPOINTS.FACULTIES}/${id}`),
  createFaculty: (data: any) =>
    axios.post(API_ENDPOINTS.FACULTIES, utils.filterObject(data)),
  updateFaculty: (id: number, data: any) =>
    axios.put(`${API_ENDPOINTS.FACULTIES}/${id}`, utils.filterObject(data)),
  deleteFaculty: (id: number) =>
    axios.delete(`${API_ENDPOINTS.FACULTIES}/${id}`),

  // Department Management
  getDepartments: (data?: any) =>
    axios.get(API_ENDPOINTS.DEPARTMENTS, { params: utils.filterObject(data) }),
  getDepartmentById: (id: number) =>
    axios.get(`${API_ENDPOINTS.DEPARTMENTS}/${id}`),
  createDepartment: (data: any) =>
    axios.post(API_ENDPOINTS.DEPARTMENTS, utils.filterObject(data)),
  updateDepartment: (id: number, data: any) =>
    axios.put(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, utils.filterObject(data)),
  deleteDepartment: (id: number) =>
    axios.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`),

  // Class Management
  getClasses: (data?: any) =>
    axios.get(API_ENDPOINTS.CLASSES, { params: utils.filterObject(data) }),
  getClassById: (id: number) => axios.get(`${API_ENDPOINTS.CLASSES}/${id}`),
  createClass: (data: any) =>
    axios.post(API_ENDPOINTS.CLASSES, utils.filterObject(data)),
  updateClass: (id: number, data: any) =>
    axios.put(`${API_ENDPOINTS.CLASSES}/${id}`, utils.filterObject(data)),
  deleteClass: (id: number) => axios.delete(`${API_ENDPOINTS.CLASSES}/${id}`),

  // User Management
  getUsers: (data?: any) =>
    axios.get(API_ENDPOINTS.USERS, { params: utils.filterObject(data) }),
  getUserById: (id: number) => axios.get(`${API_ENDPOINTS.USERS}/${id}`),
  createUser: (data: any) =>
    axios.post(API_ENDPOINTS.USERS, utils.filterObject(data)),
  updateUser: (id: number, data: any) =>
    axios.put(`${API_ENDPOINTS.USERS}/${id}`, utils.filterObject(data)),
  deleteUser: (id: number) => axios.delete(`${API_ENDPOINTS.USERS}/${id}`),

  // Student Management
  getStudents: (data?: any) =>
    axios.get(API_ENDPOINTS.STUDENT, { params: utils.filterObject(data) }),

  // Instructor Management
  getInstructors: (data?: any) =>
    axios.get(API_ENDPOINTS.INSTRUCTOR, { params: utils.filterObject(data) }),

  // Statistics
  getStatistics: (data?: any) =>
    axios.get(API_ENDPOINTS.STATISTICS, { params: utils.filterObject(data) }),
};
