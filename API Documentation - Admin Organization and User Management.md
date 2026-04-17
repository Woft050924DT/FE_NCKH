# API Documentation - Quản lý Tổ chức và Người dùng (Admin)

## Overview
API quản lý tổ chức (Khoa, Bộ môn, Lớp học) và Người dùng cho Admin

## Base URL
```
http://localhost:3000/api
```

## Authentication
Tất cả các endpoint yêu cầu xác thực (JWT token) trong header:
```
Authorization: Bearer <token>
```

---

## 1. Quản lý Khoa (Faculty Management)

### 1.1 Lấy danh sách tất cả khoa
Lấy danh sách tất cả các khoa trong hệ thống.

**Endpoint:** `GET /api/admin/faculties`

**Roles Required:** `ADMIN`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "faculty_code": "CNTT",
    "faculty_name": "Khoa Công nghệ thông tin",
    "description": "Đào tạo các chuyên ngành CNTT",
    "established_date": "2000-09-01",
    "dean_id": 5,
    "status": "ACTIVE",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "departments": [
      {
        "id": 1,
        "department_code": "PM",
        "department_name": "Bộ môn Phần mềm"
      }
    ]
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

### 1.2 Lấy thông tin khoa theo ID
Lấy thông tin chi tiết của một khoa cụ thể.

**Endpoint:** `GET /api/admin/faculties/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của khoa

**Example Request:**
```
GET /api/admin/faculties/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "faculty_code": "CNTT",
  "faculty_name": "Khoa Công nghệ thông tin",
  "description": "Đào tạo các chuyên ngành CNTT",
  "established_date": "2000-09-01",
  "dean_id": 5,
  "status": "ACTIVE",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z",
  "departments": [...]
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy khoa
- `500 Internal Server Error`: Lỗi server

---

### 1.3 Tạo khoa mới
Tạo một khoa mới trong hệ thống.

**Endpoint:** `POST /api/admin/faculties`

**Roles Required:** `ADMIN`

**Request Body:**
```json
{
  "faculty_code": "KT",
  "faculty_name": "Khoa Kinh tế",
  "description": "Đào tạo các chuyên ngành kinh tế",
  "established_date": "2005-09-01",
  "dean_id": 10
}
```

**Field Descriptions:**
- `faculty_code` (string, required): Mã khoa (unique)
- `faculty_name` (string, required): Tên khoa
- `description` (string, optional): Mô tả về khoa
- `established_date` (date, optional): Ngày thành lập (format: YYYY-MM-DD)
- `dean_id` (integer, optional): ID của trưởng khoa (user có role là department_head)

**Response (201 Created):**
```json
{
  "id": 2,
  "faculty_code": "KT",
  "faculty_name": "Khoa Kinh tế",
  "description": "Đào tạo các chuyên ngành kinh tế",
  "established_date": "2005-09-01",
  "dean_id": 10,
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ hoặc faculty_code đã tồn tại
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

### 1.4 Cập nhật thông tin khoa
Cập nhật thông tin của một khoa.

**Endpoint:** `PUT /api/admin/faculties/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của khoa

**Request Body:**
```json
{
  "faculty_name": "Khoa Kinh tế và Quản trị",
  "description": "Đào tạo các chuyên ngành kinh tế và quản trị",
  "dean_id": 15,
  "status": "ACTIVE"
}
```

**Field Descriptions:**
- `faculty_name` (string, optional): Tên khoa mới
- `description` (string, optional): Mô tả mới
- `established_date` (date, optional): Ngày thành lập
- `dean_id` (integer, optional): ID của trưởng khoa mới
- `status` (string, optional): Trạng thái (`ACTIVE` hoặc `INACTIVE`)

**Response (200 OK):**
```json
{
  "id": 2,
  "faculty_code": "KT",
  "faculty_name": "Khoa Kinh tế và Quản trị",
  "description": "Đào tạo các chuyên ngành kinh tế và quản trị",
  "established_date": "2005-09-01",
  "dean_id": 15,
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T12:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy khoa
- `500 Internal Server Error`: Lỗi server

---

### 1.5 Xóa khoa
Xóa một khoa khỏi hệ thống.

**Endpoint:** `DELETE /api/admin/faculties/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của khoa

**Response (200 OK):**
```json
{
  "message": "Đã xóa khoa thành công"
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy khoa
- `409 Conflict`: Khoa đang có bộ môn hoặc không thể xóa
- `500 Internal Server Error`: Lỗi server

---

## 2. Quản lý Bộ môn (Department Management)

### 2.1 Lấy danh sách bộ môn
Lấy danh sách tất cả các bộ môn, có thể lọc theo khoa.

**Endpoint:** `GET /api/admin/departments`

**Roles Required:** `ADMIN`

**Query Parameters:**
- `faculty_id` (integer, optional): Lọc theo khoa ID

**Example Request:**
```
GET /api/admin/departments?faculty_id=1
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "department_code": "PM",
    "department_name": "Bộ môn Phần mềm",
    "description": "Chuyên về phát triển phần mềm",
    "faculty_id": 1,
    "head_id": 3,
    "status": "ACTIVE",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "faculties": {
      "id": 1,
      "faculty_code": "CNTT",
      "faculty_name": "Khoa Công nghệ thông tin"
    },
    "instructors": [
      {
        "id": 1,
        "instructor_code": "GV001",
        "users": {
          "full_name": "Nguyễn Văn A"
        }
      }
    ],
    "students": [...]
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

### 2.2 Lấy thông tin bộ môn theo ID
Lấy thông tin chi tiết của một bộ môn.

**Endpoint:** `GET /api/admin/departments/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của bộ môn

**Response (200 OK):**
```json
{
  "id": 1,
  "department_code": "PM",
  "department_name": "Bộ môn Phần mềm",
  "description": "Chuyên về phát triển phần mềm",
  "faculty_id": 1,
  "head_id": 3,
  "status": "ACTIVE",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z",
  "faculties": {...},
  "instructors": [...],
  "students": [...]
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy bộ môn
- `500 Internal Server Error`: Lỗi server

---

### 2.3 Tạo bộ môn mới
Tạo một bộ môn mới trong hệ thống.

**Endpoint:** `POST /api/admin/departments`

**Roles Required:** `ADMIN`

**Request Body:**
```json
{
  "department_code": "AI",
  "department_name": "Bộ môn Trí tuệ nhân tạo",
  "description": "Chuyên về AI và Machine Learning",
  "faculty_id": 1,
  "head_id": 8
}
```

**Field Descriptions:**
- `department_code` (string, required): Mã bộ môn (unique trong cùng khoa)
- `department_name` (string, required): Tên bộ môn
- `description` (string, optional): Mô tả về bộ môn
- `faculty_id` (integer, required): ID của khoa
- `head_id` (integer, optional): ID của trưởng bộ môn (user có role là head)

**Response (201 Created):**
```json
{
  "id": 3,
  "department_code": "AI",
  "department_name": "Bộ môn Trí tuệ nhân tạo",
  "description": "Chuyên về AI và Machine Learning",
  "faculty_id": 1,
  "head_id": 8,
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ hoặc department_code đã tồn tại
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy khoa
- `500 Internal Server Error`: Lỗi server

---

### 2.4 Cập nhật thông tin bộ môn
Cập nhật thông tin của một bộ môn.

**Endpoint:** `PUT /api/admin/departments/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của bộ môn

**Request Body:**
```json
{
  "department_name": "Bộ môn AI và Data Science",
  "description": "Chuyên về AI, ML và Data Science",
  "head_id": 12,
  "status": "ACTIVE"
}
```

**Field Descriptions:**
- `department_name` (string, optional): Tên bộ môn mới
- `description` (string, optional): Mô tả mới
- `head_id` (integer, optional): ID của trưởng bộ môn mới
- `status` (string, optional): Trạng thái (`ACTIVE` hoặc `INACTIVE`)

**Response (200 OK):**
```json
{
  "id": 3,
  "department_code": "AI",
  "department_name": "Bộ môn AI và Data Science",
  "description": "Chuyên về AI, ML và Data Science",
  "faculty_id": 1,
  "head_id": 12,
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T12:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy bộ môn
- `500 Internal Server Error`: Lỗi server

---

### 2.5 Xóa bộ môn
Xóa một bộ môn khỏi hệ thống.

**Endpoint:** `DELETE /api/admin/departments/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của bộ môn

**Response (200 OK):**
```json
{
  "message": "Đã xóa bộ môn thành công"
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy bộ môn
- `409 Conflict`: Bộ môn đang có giảng viên/sinh viên hoặc không thể xóa
- `500 Internal Server Error`: Lỗi server

---

## 3. Quản lý Lớp học (Class Management)

### 3.1 Lấy danh sách lớp học
Lấy danh sách tất cả các lớp học, có thể lọc theo bộ môn.

**Endpoint:** `GET /api/admin/classes`

**Roles Required:** `ADMIN`

**Query Parameters:**
- `department_id` (integer, optional): Lọc theo bộ môn ID

**Example Request:**
```
GET /api/admin/classes?department_id=1
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "class_code": "CNTT-K15",
    "class_name": "Lớp Công nghệ thông tin K15",
    "department_id": 1,
    "academic_year": "2024-2025",
    "semester": 1,
    "status": "ACTIVE",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "departments": {
      "id": 1,
      "department_code": "PM",
      "department_name": "Bộ môn Phần mềm"
    },
    "students": [
      {
        "id": 1,
        "student_code": "SV001",
        "users": {
          "full_name": "Nguyễn Văn B"
        }
      }
    ]
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

### 3.2 Lấy thông tin lớp học theo ID
Lấy thông tin chi tiết của một lớp học.

**Endpoint:** `GET /api/admin/classes/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của lớp học

**Response (200 OK):**
```json
{
  "id": 1,
  "class_code": "CNTT-K15",
  "class_name": "Lớp Công nghệ thông tin K15",
  "department_id": 1,
  "academic_year": "2024-2025",
  "semester": 1,
  "status": "ACTIVE",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z",
  "departments": {...},
  "students": [...]
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy lớp học
- `500 Internal Server Error`: Lỗi server

---

### 3.3 Tạo lớp học mới
Tạo một lớp học mới trong hệ thống.

**Endpoint:** `POST /api/admin/classes`

**Roles Required:** `ADMIN`

**Request Body:**
```json
{
  "class_code": "CNTT-K16",
  "class_name": "Lớp Công nghệ thông tin K16",
  "department_id": 1,
  "academic_year": "2025-2026",
  "semester": 1
}
```

**Field Descriptions:**
- `class_code` (string, required): Mã lớp học (unique)
- `class_name` (string, required): Tên lớp học
- `department_id` (integer, required): ID của bộ môn
- `academic_year` (string, required): Năm học (format: YYYY-YYYY)
- `semester` (integer, required): Học kỳ (1, 2, hoặc 3)

**Response (201 Created):**
```json
{
  "id": 2,
  "class_code": "CNTT-K16",
  "class_name": "Lớp Công nghệ thông tin K16",
  "department_id": 1,
  "academic_year": "2025-2026",
  "semester": 1,
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ hoặc class_code đã tồn tại
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy bộ môn
- `500 Internal Server Error`: Lỗi server

---

### 3.4 Cập nhật thông tin lớp học
Cập nhật thông tin của một lớp học.

**Endpoint:** `PUT /api/admin/classes/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của lớp học

**Request Body:**
```json
{
  "class_name": "Lớp CNTT K16 - Chuyên ngành Phần mềm",
  "status": "ACTIVE"
}
```

**Field Descriptions:**
- `class_name` (string, optional): Tên lớp học mới
- `status` (string, optional): Trạng thái (`ACTIVE` hoặc `INACTIVE`)

**Response (200 OK):**
```json
{
  "id": 2,
  "class_code": "CNTT-K16",
  "class_name": "Lớp CNTT K16 - Chuyên ngành Phần mềm",
  "department_id": 1,
  "academic_year": "2025-2026",
  "semester": 1,
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T12:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy lớp học
- `500 Internal Server Error`: Lỗi server

---

### 3.5 Xóa lớp học
Xóa một lớp học khỏi hệ thống.

**Endpoint:** `DELETE /api/admin/classes/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của lớp học

**Response (200 OK):**
```json
{
  "message": "Đã xóa lớp học thành công"
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy lớp học
- `409 Conflict`: Lớp học đang có sinh viên hoặc không thể xóa
- `500 Internal Server Error`: Lỗi server

---

## 4. Quản lý Người dùng (User Management)

### 4.1 Lấy danh sách người dùng
Lấy danh sách tất cả người dùng, có thể lọc theo vai trò, trạng thái và tìm kiếm.

**Endpoint:** `GET /api/admin/users`

**Roles Required:** `ADMIN`

**Query Parameters:**
- `role` (string, optional): Lọc theo vai trò (`student`, `instructor`, `head`, `department_head`, `admin`)
- `status` (string, optional): Lọc theo trạng thái (`ACTIVE`, `INACTIVE`, `PENDING`)
- `search` (string, optional): Tìm kiếm theo tên hoặc email

**Example Request:**
```
GET /api/admin/users?role=student&status=ACTIVE&search=Nguyen
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "email": "nguyenvanb@example.com",
    "full_name": "Nguyễn Văn B",
    "role": "student",
    "status": "ACTIVE",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "last_login": "2026-04-17T10:00:00.000Z",
    "student": {
      "id": 1,
      "student_code": "SV001",
      "class_name": "CNTT-K15",
      "departments": {
        "department_name": "Bộ môn Phần mềm"
      }
    }
  },
  {
    "id": 2,
    "email": "nguyenvana@example.com",
    "full_name": "Nguyễn Văn A",
    "role": "instructor",
    "status": "ACTIVE",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "last_login": "2026-04-17T09:00:00.000Z",
    "instructor": {
      "id": 1,
      "instructor_code": "GV001",
      "departments": {
        "department_name": "Bộ môn Phần mềm"
      },
      "degree": "Tiến sĩ",
      "academic_title": "Giảng viên chính"
    }
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

### 4.2 Lấy thông tin người dùng theo ID
Lấy thông tin chi tiết của một người dùng.

**Endpoint:** `GET /api/admin/users/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của người dùng

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "nguyenvanb@example.com",
  "full_name": "Nguyễn Văn B",
  "role": "student",
  "status": "ACTIVE",
  "created_at": "2026-01-01T00:00:00.000Z",
  "updated_at": "2026-01-01T00:00:00.000Z",
  "last_login": "2026-04-17T10:00:00.000Z",
  "student": {
    "id": 1,
    "student_code": "SV001",
    "class_name": "CNTT-K15",
    "departments": {
      "department_name": "Bộ môn Phần mềm"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy người dùng
- `500 Internal Server Error`: Lỗi server

---

### 4.3 Tạo người dùng mới
Tạo một người dùng mới (chỉ tạo user, không tạo student/instructor).

**Endpoint:** `POST /api/admin/users`

**Roles Required:** `ADMIN`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "SecurePassword123",
  "full_name": "Người dùng mới",
  "role": "admin",
  "phone": "0901234567"
}
```

**Field Descriptions:**
- `email` (string, required): Email người dùng (unique)
- `username` (string, required): Tên đăng nhập (unique)
- `password` (string, required): Mật khẩu (tối thiểu 8 ký tự)
- `full_name` (string, required): Họ tên đầy đủ
- `role` (string, required): Vai trò (`student`, `instructor`, `head`, `department_head`, `admin`)
- `phone` (string, optional): Số điện thoại

**Response (201 Created):**
```json
{
  "id": 10,
  "email": "newuser@example.com",
  "full_name": "Người dùng mới",
  "role": "admin",
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ hoặc email/username đã tồn tại
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

### 4.4 Cập nhật thông tin người dùng
Cập nhật thông tin của một người dùng.

**Endpoint:** `PUT /api/admin/users/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của người dùng

**Request Body:**
```json
{
  "full_name": "Người dùng đã cập nhật",
  "email": "updated@example.com",
  "phone": "0912345678",
  "role": "instructor",
  "status": "ACTIVE"
}
```

**Field Descriptions:**
- `full_name` (string, optional): Họ tên mới
- `email` (string, optional): Email mới
- `phone` (string, optional): Số điện thoại mới
- `role` (string, optional): Vai trò mới
- `status` (string, optional): Trạng thái (`ACTIVE`, `INACTIVE`, `PENDING`)

**Response (200 OK):**
```json
{
  "id": 10,
  "email": "updated@example.com",
  "full_name": "Người dùng đã cập nhật",
  "role": "instructor",
  "status": "ACTIVE",
  "created_at": "2026-04-17T00:00:00.000Z",
  "updated_at": "2026-04-17T12:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ hoặc email đã tồn tại
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy người dùng
- `500 Internal Server Error`: Lỗi server

---

### 4.5 Xóa người dùng
Xóa một người dùng khỏi hệ thống.

**Endpoint:** `DELETE /api/admin/users/:id`

**Roles Required:** `ADMIN`

**Path Parameters:**
- `id` (integer, required): ID của người dùng

**Response (200 OK):**
```json
{
  "message": "Đã xóa người dùng thành công"
}
```

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy người dùng
- `409 Conflict`: Người dùng đang có dữ liệu liên quan hoặc không thể xóa
- `500 Internal Server Error`: Lỗi server

---

## 5. Tạo Sinh viên (Create Student)

### 5.1 Tạo sinh viên mới
Tạo sinh viên mới kèm theo user account.

**Endpoint:** `POST /api/admin/students`

**Roles Required:** `ADMIN`

**Request Body:**
```json
{
  "student_code": "SV002",
  "class_id": 1,
  "department_id": 1,
  "user": {
    "email": "student2@example.com",
    "username": "student2",
    "password": "SecurePassword123",
    "full_name": "Sinh viên mới",
    "role": "student",
    "phone": "0901234568"
  }
}
```

**Field Descriptions:**
- `student_code` (string, required): Mã sinh viên (unique)
- `class_id` (integer, required): ID của lớp học
- `department_id` (integer, required): ID của bộ môn
- `user` (object, required): Thông tin user account
  - `email` (string, required): Email
  - `username` (string, required): Tên đăng nhập
  - `password` (string, required): Mật khẩu
  - `full_name` (string, required): Họ tên
  - `role` (string, required): Phải là `student`
  - `phone` (string, optional): Số điện thoại

**Response (201 Created):**
```json
{
  "id": 2,
  "student_code": "SV002",
  "class_id": 1,
  "department_id": 1,
  "user_id": 15,
  "created_at": "2026-04-17T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy lớp học hoặc bộ môn
- `500 Internal Server Error`: Lỗi server

---

## 6. Tạo Giảng viên (Create Instructor)

### 6.1 Tạo giảng viên mới
Tạo giảng viên mới kèm theo user account.

**Endpoint:** `POST /api/admin/instructors`

**Roles Required:** `ADMIN`

**Request Body:**
```json
{
  "instructor_code": "GV002",
  "department_id": 1,
  "degree": "Thạc sĩ",
  "academic_title": "Giảng viên",
  "specialization": "Lập trình Web",
  "years_of_experience": 5,
  "user": {
    "email": "instructor2@example.com",
    "username": "instructor2",
    "password": "SecurePassword123",
    "full_name": "Giảng viên mới",
    "role": "instructor",
    "phone": "0901234569"
  }
}
```

**Field Descriptions:**
- `instructor_code` (string, required): Mã giảng viên (unique)
- `department_id` (integer, required): ID của bộ môn
- `degree` (string, optional): Bằng cấp (Cử nhân, Thạc sĩ, Tiến sĩ)
- `academic_title` (string, optional): Chức danh học thuật (Giảng viên, Phó Giáo sư, Giáo sư)
- `specialization` (string, optional): Chuyên môn
- `years_of_experience` (integer, optional): Số năm kinh nghiệm
- `user` (object, required): Thông tin user account
  - `email` (string, required): Email
  - `username` (string, required): Tên đăng nhập
  - `password` (string, required): Mật khẩu
  - `full_name` (string, required): Họ tên
  - `role` (string, required): Phải là `instructor`
  - `phone` (string, optional): Số điện thoại

**Response (201 Created):**
```json
{
  "id": 2,
  "instructor_code": "GV002",
  "department_id": 1,
  "degree": "Thạc sĩ",
  "academic_title": "Giảng viên",
  "specialization": "Lập trình Web",
  "years_of_experience": 5,
  "user_id": 16,
  "created_at": "2026-04-17T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Dữ liệu không hợp lệ
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Không tìm thấy bộ môn
- `500 Internal Server Error`: Lỗi server

---

## 7. Thống kê hệ thống (System Statistics)

### 7.1 Lấy thống kê hệ thống
Lấy các số liệu thống kê tổng quan về hệ thống.

**Endpoint:** `GET /api/admin/statistics`

**Roles Required:** `ADMIN`

**Response (200 OK):**
```json
{
  "totalUsers": 1500,
  "totalStudents": 1200,
  "totalInstructors": 250,
  "totalFaculties": 5,
  "totalDepartments": 20,
  "totalClasses": 50
}
```

**Field Descriptions:**
- `totalUsers`: Tổng số người dùng
- `totalStudents`: Tổng số sinh viên
- `totalInstructors`: Tổng số giảng viên
- `totalFaculties`: Tổng số khoa
- `totalDepartments`: Tổng số bộ môn
- `totalClasses`: Tổng số lớp học

**Error Responses:**
- `401 Unauthorized`: Token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `500 Internal Server Error`: Lỗi server

---

## Status Values

### User Status
- `ACTIVE`: Hoạt động
- `INACTIVE`: Ngừng hoạt động
- `PENDING`: Chờ kích hoạt

### Organization Status
- `ACTIVE`: Hoạt động
- `INACTIVE`: Ngừng hoạt động

### User Roles
- `student`: Sinh viên
- `instructor`: Giảng viên
- `head`: Trưởng bộ môn
- `department_head`: Trưởng khoa
- `admin`: Quản trị viên

---

## Example Requests

### cURL - Tạo khoa mới
```bash
curl -X POST http://localhost:3000/api/admin/faculties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "faculty_code": "KT",
    "faculty_name": "Khoa Kinh tế",
    "description": "Đào tạo các chuyên ngành kinh tế",
    "established_date": "2005-09-01",
    "dean_id": 10
  }'
```

### cURL - Lấy danh sách người dùng
```bash
curl -X GET "http://localhost:3000/api/admin/users?role=student&status=ACTIVE" \
  -H "Authorization: Bearer <token>"
```

### JavaScript (fetch) - Tạo sinh viên
```javascript
fetch('http://localhost:3000/api/admin/students', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    student_code: 'SV002',
    class_id: 1,
    department_id: 1,
    user: {
      email: 'student2@example.com',
      username: 'student2',
      password: 'SecurePassword123',
      full_name: 'Sinh viên mới',
      role: 'student',
      phone: '0901234568'
    }
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Notes

1. **Quy trình xóa:**
   - Khi xóa khoa, tất cả bộ môn thuộc khoa sẽ bị xóa (cascade delete)
   - Khi xóa bộ môn, tất cả giảng viên và sinh viên thuộc bộ môn cần được xử lý
   - Khi xóa lớp học, sinh viên trong lớp cần được chuyển sang lớp khác hoặc xóa
   - Khi xóa người dùng, các dữ liệu liên quan (đồ án, báo cáo, v.v.) cần được xử lý

2. **Validation:**
   - `faculty_code`, `department_code`, `class_code` phải là unique
   - `email` và `username` phải là unique trong bảng users
   - `faculty_id` phải tồn tại khi tạo bộ môn
   - `department_id` phải tồn tại khi tạo lớp học

3. **Role restrictions:**
   - Tất cả endpoints chỉ accessible bởi role `admin`
   - Dean phải có role `department_head`
   - Head của department phải có role `head`

---

## Error Response Format
```json
{
  "error": "Error message here"
}
```
