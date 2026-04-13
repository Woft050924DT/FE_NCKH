# 🎨 Figma + ReactJS UI Prompt — Hệ thống Quản lý Khóa luận Tốt nghiệp

---

## 🧭 TỔNG QUAN HỆ THỐNG

**Tên sản phẩm**: ThesisHub — Nền tảng quản lý khóa luận tốt nghiệp  
**Stack**: ReactJS + TypeScript + TailwindCSS + React Query + Zustand  
**Phong cách thiết kế**: Clean Academic — tối giản nhưng có chiều sâu, màu sắc chuyên nghiệp, typography rõ ràng, layout dạng dashboard hiện đại  
**Màu chủ đạo**:
- Primary: `#2563EB` (Blue-600) — hành động chính
- Secondary: `#0F172A` (Slate-900) — sidebar, header
- Accent: `#7C3AED` (Violet-600) — badge, highlight
- Success: `#059669` (Emerald-600)
- Warning: `#D97706` (Amber-600)
- Danger: `#DC2626` (Red-600)
- Background: `#F8FAFC` (Slate-50)
- Surface: `#FFFFFF`

**Font**: `Plus Jakarta Sans` (display/heading) + `DM Sans` (body/label)

---

## 👤 PHÂN QUYỀN & LAYOUT

Hệ thống có **4 vai trò** với layout riêng:

| Role | Sidebar items chính |
|------|-------------------|
| Admin | Tổ chức, Người dùng, Cấu hình hệ thống |
| Trưởng bộ môn (Head) | Đợt KL, Duyệt đề tài, Hội đồng, Báo cáo |
| Giảng viên (Instructor) | Đề tài của tôi, Sinh viên HD, Lịch phản biện |
| Sinh viên (Student) | Nhóm của tôi, Đề tài, Báo cáo tuần, Điểm số |

**Layout chung**: Left sidebar cố định (240px) + Main content area + Right panel tùy chọn

---

## 📐 COMPONENT LIBRARY CẦN THIẾT

### Base Components
```
Button (primary | secondary | ghost | danger | icon)
Input (text | search | date | file upload)
Select / MultiSelect / Combobox
Badge (status badges với màu sắc tương ứng)
Avatar (single + group stack)
Tabs (line | pill)
Modal / Drawer / Sheet
Table (sortable, filterable, pagination)
Card (default | elevated | bordered)
Toast / Notification
Tooltip
Dropdown Menu
Progress Bar / Step Indicator
Empty State (with illustration placeholder)
Loading Skeleton
```

### Status Badge Colors
```
thesis_rounds.status:
  "Preparing"   → Gray badge
  "Ongoing"     → Blue badge
  "Completed"   → Green badge
  "Cancelled"   → Red badge

thesis_groups.status:
  "FORMING"     → Amber badge
  "READY"       → Blue badge
  "REGISTERED"  → Violet badge
  "APPROVED"    → Green badge
  "LOCKED"      → Slate badge
  "DISSOLVED"   → Red badge

topic_registrations.instructor_status / head_status:
  "PENDING"     → Amber badge
  "APPROVED"    → Green badge
  "REJECTED"    → Red badge
  "OVERRIDDEN"  → Violet badge

theses.status:
  "IN_PROGRESS" → Blue badge
  "COMPLETED"   → Green badge
  "FAILED"      → Red badge
  "WITHDRAWN"   → Gray badge
```

---

## 🖥️ CÁC MÀN HÌNH CHI TIẾT

---

### SCREEN 01 — ĐĂNG NHẬP

**Route**: `/login`

**Layout**: Fullscreen split — Left 40% brand panel (gradient `#0F172A → #1e3a8a`) + Right 60% form

**Left panel**:
- Logo ThesisHub (svg icon + wordmark)
- Tagline: "Quản lý hành trình nghiên cứu của bạn"
- 3 feature bullets với icon

**Right panel (form)**:
- Heading: "Chào mừng trở lại"
- Input: Tên đăng nhập (`users.username`)
- Input: Mật khẩu (`users.password`) + toggle show/hide
- Checkbox: Ghi nhớ đăng nhập
- Button: "Đăng nhập" (primary, full width)
- Link: Quên mật khẩu

**States**: Default | Loading (spinner in button) | Error (shake animation + error message dưới input)

---

### SCREEN 02 — DASHBOARD (theo từng role)

**Route**: `/dashboard`

#### 2A — Dashboard Sinh viên
**Widgets hiển thị**:
- **Card: Nhóm hiện tại** — group_code, group_name, status badge, số thành viên / max_members (progress bar nhỏ)
- **Card: Đề tài** — topic_title, supervisor name + avatar, thesis status badge
- **Card: Tiến độ tuần** — week_number hiện tại, weekly_report status (nộp chưa / cần sửa / đã duyệt)
- **Card: Điểm số** — supervision_score | review_score | defense_score (3 số lớn cạnh nhau, màu theo ngưỡng)
- **Timeline: Deadline đợt KL** — topic_proposal_deadline, registration_deadline, report_submission_deadline (dạng horizontal timeline với dot indicators)
- **Mini-table: Công việc (thesis_tasks)** — 5 task gần nhất, cột: tên task, assigned_to avatar, due_date, status badge, progress %

#### 2B — Dashboard Giảng viên
**Widgets**:
- **Card: Hướng dẫn** — current_load / supervision_quota (dạng donut chart mini)
- **Card: Phản biện** — số luận văn cần phản biện (review_assignments.status = PENDING_REVIEW)
- **List: Sinh viên cần duyệt** — topic_registrations.instructor_status = PENDING, hiện tên SV, tên đề tài, button "Xem & Duyệt"
- **List: Báo cáo tuần chờ nhận xét** — weekly_reports.instructor_status = PENDING

#### 2C — Dashboard Trưởng bộ môn
**Widgets**:
- **Stat cards**: Tổng đề tài | Đang thực hiện | Hoàn thành | Tỷ lệ pass (%)
- **Bar chart**: Phân bố điểm số (0-4 | 4-6 | 6-8 | 8-10)
- **Table: Đề tài chờ duyệt** — head_status = PENDING
- **Table: Hội đồng sắp diễn ra** — defense_councils trong 7 ngày tới

---

### SCREEN 03 — QUẢN LÝ ĐỢT KHÓA LUẬN

**Route**: `/thesis-rounds`

**Danh sách**:
- Filter bar: năm học, học kỳ, khoa, trạng thái
- Table columns: Mã đợt | Tên đợt | Loại | Năm học | HK | Thời gian (start→end) | Trạng thái | Actions
- Row click → mở detail drawer

**Form tạo/sửa đợt** (Modal hoặc Page `/thesis-rounds/create`):

```
Section 1 — Thông tin cơ bản
  - Tên đợt khóa luận (thesis_rounds.round_name)
  - Loại khóa luận (thesis_type_id) — Select từ thesis_types
  - Bộ môn / Khoa (department_id | faculty_id)
  - Năm học (academic_year) — input text "2024-2025"
  - Học kỳ (semester) — Radio 3 options: HK1 | HK2 | HK3

Section 2 — Thời gian
  - Ngày bắt đầu / kết thúc (DateRangePicker)
  - Hạn đề xuất đề tài (topic_proposal_deadline)
  - Hạn đăng ký (registration_deadline)
  - Hạn nộp báo cáo (report_submission_deadline)
  - Timeline preview: hiển thị các mốc trực quan

Section 3 — Quy tắc mặc định (thesis_round_rules)
  - Chế độ nhóm (default_group_mode) — Radio: Cá nhân | Nhóm | Cả hai
  - Số thành viên tối thiểu / tối đa (min/max slider range)
  - Cho phép GV override? (allow_instructor_override) — Toggle
  - Cho phép Trưởng BM override? (allow_head_override) — Toggle

Section 4 — Lớp tham gia (thesis_round_classes)
  - MultiSelect lớp học (classes table)
  - Hiển thị tag list đã chọn

Section 5 — Phân công Giảng viên (instructor_assignments)
  - Table: Thêm GV + chỉ số supervision_quota
  - Inline editable quota
```

---

### SCREEN 04 — QUẢN LÝ ĐỀ TÀI DO GV ĐỀ XUẤT

**Route**: `/proposed-topics`

**Dành cho Giảng viên**:

**Danh sách đề tài của tôi**:
- Filter: đợt KL, trạng thái (is_taken)
- Card grid (2 cột) thay vì table — mỗi card:
  - Topic title (bold, 2 dòng truncate)
  - Badge: "Còn trống" (green) / "Đã có nhóm" (slate)
  - Chip: group_mode (Cá nhân | Nhóm | Cả hai)
  - Icon row: min-max members, technologies_used (tags)
  - Actions: Sửa | Xem | Xóa

**Form tạo đề tài** (`/proposed-topics/create`):
```
- Mã đề tài (topic_code) — auto-generate hoặc nhập tay
- Tên đề tài (topic_title) — textarea lớn
- Chọn đợt KL (thesis_round_id) — Select
- Mô tả đề tài (topic_description) — Rich text editor (React Quill hoặc Tiptap)
- Mục tiêu (objectives) — textarea
- Yêu cầu sinh viên (student_requirements) — textarea
- Công nghệ sử dụng (technologies_used) — Tag input
- Tài liệu tham khảo (topic_references) — textarea

Section: Quy tắc nhóm (proposed_topic_rules)
  - Chế độ nhóm — Radio
  - Khoảng thành viên — Range slider [min, max]
  - Lý do đặc biệt — textarea (optional)
```

---

### SCREEN 05 — QUẢN LÝ NHÓM SINH VIÊN

**Route**: `/groups`

#### 5A — Trang Sinh viên: Tìm nhóm & Tạo nhóm

**Layout 3 tab**:

**Tab "Nhóm của tôi"**:
- Nếu chưa có nhóm → Empty state với 2 CTA: "Tạo nhóm mới" | "Tìm nhóm để tham gia"
- Nếu đã có nhóm → Card lớn hiển thị:
  - Group info (code, name, status badge)
  - Member list: Avatar stack + tên + role badge (Leader/Member)
  - Nút: "Mời thành viên" (nếu còn slot) | "Rời nhóm"
  - Section: Lời mời đang chờ (thesis_group_invitations.status = PENDING gửi đi)

**Tab "Lời mời"** (thesis_group_invitations.invited_student_id = me):
- List card: Nhóm mời, người mời, thông điệp, thời hạn expires_at
- Actions: "Chấp nhận" (green) | "Từ chối" (ghost)

**Tab "Tìm nhóm"**:
- Search + Filter (đợt KL, số slot còn lại)
- Table: Mã nhóm | Trưởng nhóm | Số thành viên | Max | Status | Action "Gửi yêu cầu"

**Modal "Tạo nhóm"**:
```
- Tên nhóm (group_name)
- Loại nhóm: Cá nhân (INDIVIDUAL) | Nhóm (GROUP) — Radio
- Số thành viên tối thiểu / tối đa (nếu là GROUP)
- Ghi chú
→ Button: Tạo nhóm
```

**Modal "Mời thành viên"**:
```
- Search sinh viên theo mã SV hoặc tên
- Danh sách gợi ý (student_code, full_name, class)
- Input lời nhắn (invitation_message)
→ Button: Gửi lời mời
```

#### 5B — Trang Trưởng BM: Quản lý tất cả nhóm

- Filter: đợt, lớp, trạng thái
- Table: Mã nhóm | Trưởng nhóm | Thành viên | Đề tài đăng ký | Trạng thái | Actions
- Bulk actions: Khóa nhóm | Giải tán nhóm

---

### SCREEN 06 — ĐĂNG KÝ ĐỀ TÀI

**Route**: `/topic-registration`

**Dành cho Sinh viên (nhóm trưởng)**:

**Step wizard (3 bước)**:

```
Step 1 — Chọn Giảng viên hướng dẫn
  - Search/filter GV theo bộ môn, chuyên môn
  - Card GV: avatar, tên, học vị, chuyên ngành, quota còn lại (current_load/supervision_quota)
  - Click chọn → highlight card

Step 2 — Chọn Đề tài
  - Tab A: "Đề tài GV đề xuất"
    - List card: topic_title, mô tả ngắn, tags công nghệ, chế độ nhóm, is_taken badge
    - Filter: công nghệ, chế độ nhóm
    - Click chọn → hiện detail panel bên phải
  - Tab B: "Tự đề xuất đề tài"
    - Input: Tên đề tài (self_proposed_title)
    - Textarea: Mô tả (self_proposed_description)
    - Input: Lý do chọn đề tài (selection_reason)

Step 3 — Xác nhận & Nộp
  - Review card: Nhóm | GV | Đề tài | Chế độ nhóm | Số thành viên
  - Warning nếu nhóm chưa đủ điều kiện (group.status ≠ READY)
  - Button: "Nộp đăng ký"
```

**Tracking trạng thái** (sau khi đã nộp):
- Timeline 2 bước: Giảng viên duyệt → Trưởng BM duyệt
- Mỗi bước hiển thị: status badge + ngày duyệt + lý do từ chối (nếu có)
- Nếu bị từ chối → hiện lý do + nút "Đăng ký lại"

---

### SCREEN 07 — TRANG KHÓA LUẬN (thesis detail)

**Route**: `/theses/:id`

**Layout**: Main content (2/3) + Right sidebar (1/3)

**Main content tabs**:

**Tab "Tổng quan"**:
- Header: thesis_code | topic_title | status badge
- Info grid: GV hướng dẫn | Ngày bắt đầu | Ngày kết thúc
- Mô tả đề tài, mục tiêu, yêu cầu, công nghệ (formatted)
- File section: outline_file | final_report_file (upload/download)

**Tab "Thành viên"** (thesis_members):
- Table: Avatar + Tên | Vai trò | Điểm cá nhân | Điểm peer | Điểm GV | Điểm cuối | Xếp loại
- Score summary dạng radar chart hoặc horizontal bar

**Tab "Báo cáo tuần"** (weekly_reports):
- Accordion theo tuần: Week 1, Week 2...
- Mỗi tuần:
  - Student section: work_completed, results_achieved, difficulties, next_week_plan
  - Attachment file (nếu có)
  - Individual contributions: table thành viên + hours_spent + self_evaluation
  - Instructor feedback section: status badge + feedback text + weekly_score
- Button "Nộp báo cáo tuần N" (nếu chưa nộp)

**Tab "Công việc"** (thesis_tasks):
- Kanban board: PENDING | IN_PROGRESS | COMPLETED | OVERDUE
- Mỗi task card: task_name | assigned_to avatar | due_date | priority badge | progress bar
- Button "Thêm công việc" → Modal form

**Tab "Đánh giá chéo"** (peer_evaluations):
- Form đánh giá: 5 tiêu chí (teamwork, responsibility, technical_skill, communication, contribution) — Slider 0-10
- Textarea: strengths, weaknesses, suggestions
- Toggle: ẩn danh (is_anonymous)
- Kết quả tổng hợp: radar chart (nếu đã có đủ đánh giá)

**Right sidebar**:
- Card: Nhận xét giảng viên (supervision_comments) — score + defense_approval
- Card: Tiến độ guidance_processes (checklist theo tuần)
- Card: Điểm số tổng (supervision_score | review_score | defense_score)

---

### SCREEN 08 — PHẢN BIỆN (Review)

**Route**: `/reviews`

#### 8A — Danh sách phản biện (Giảng viên)

- Filter: đợt, trạng thái
- Table: Tên khóa luận | Nhóm SV | Deadline | Trạng thái | Action
- Click → Review detail page

#### 8B — Form nhận xét phản biện

**Route**: `/reviews/:review_assignment_id`

```
Header: thesis info summary (title, group, supervisor)
Xem file báo cáo (iframe PDF viewer hoặc download button)

Form nhận xét (review_results):
  - Nhận xét nội dung (review_content) — rich text
  - Đánh giá đề tài (topic_evaluation)
  - Đánh giá kết quả (result_evaluation)
  - Góp ý cải thiện (improvement_suggestions)
  - Điểm phản biện (review_score) — Slider 0-10 + số hiển thị to
  - Đồng ý cho bảo vệ? (defense_approval) — Toggle (Yes/No)
  - Lý do từ chối (rejection_reason) — hiện khi defense_approval = false
  - Upload file nhận xét (review_file)

Button: Lưu nháp | Nộp chính thức
```

---

### SCREEN 09 — HỘI ĐỒNG BẢO VỆ

**Route**: `/defense-councils`

#### 9A — Danh sách hội đồng

- Filter: đợt, ngày bảo vệ, trạng thái
- Card grid: mỗi card hiển thị:
  - council_code + council_name
  - defense_date + venue
  - Chủ tịch HĐ (chairman avatar + tên)
  - Status badge
  - Số luận văn bảo vệ
  - Actions: Xem | Sửa | Xóa

#### 9B — Chi tiết hội đồng

**Route**: `/defense-councils/:id`

```
Section 1 — Thông tin HĐ
  - Mã, tên, ngày, giờ bắt đầu/kết thúc, địa điểm (venue)

Section 2 — Thành viên HĐ (council_members)
  Table: Avatar | Tên GV | Vai trò (CHAIRMAN/SECRETARY/MEMBER/REVIEWER) | Order
  Button "Thêm thành viên" → Select GV modal

Section 3 — Danh sách bảo vệ (defense_assignments)
  Table: STT (defense_order) | Tên KL | Nhóm SV | Giờ bảo vệ | Status
  Click row → mở panel chấm điểm

Section 4 — Chấm điểm (defense_results)
  Mỗi luận văn: form cho từng thành viên HĐ nhập defense_score + comments
  Tổng hợp điểm trung bình tự động
```

---

### SCREEN 10 — TIẾN TRÌNH HƯỚNG DẪN

**Route**: `/guidance-processes`

**Dành cho Trưởng BM**:

- Quản lý guidance_processes theo đợt KL
- Table: Tuần | Tên giai đoạn | Mô tả công việc | Kết quả kỳ vọng | Status
- Inline edit
- Button "Thêm tuần" → append row

---

### SCREEN 11 — QUẢN LÝ TỔ CHỨC (Admin)

**Route**: `/admin/organization`

**Tab "Khoa"** (faculties):
```
Table: Mã | Tên | Trưởng khoa | SĐT | Email | Trạng thái | Actions
Form: faculty_code, faculty_name, dean_id (Select GV), address, phone, email
```

**Tab "Bộ môn"** (departments):
```
Table: Mã | Tên | Thuộc khoa | Trưởng BM | Mô tả | Trạng thái
Form: department_code, department_name, faculty_id, head_id, description
```

**Tab "Ngành"** (majors):
```
Table: Mã | Tên | Thuộc BM | Mô tả | Trạng thái
```

**Tab "Lớp"** (classes):
```
Table: Mã lớp | Tên lớp | Ngành | Năm học | Sĩ số | GVCN | Trạng thái
Form: class_code, class_name, major_id, academic_year, student_count, advisor_id
```

---

### SCREEN 12 — QUẢN LÝ NGƯỜI DÙNG (Admin)

**Route**: `/admin/users`

**Danh sách**:
- Filter: role, trạng thái, khoa/bộ môn
- Table: Avatar | Tên | Username | Email | Vai trò (badge) | Trạng thái | Actions
- Bulk actions: Kích hoạt | Vô hiệu hoá | Gán vai trò

**Form tạo/sửa User**:
```
Section 1 — Tài khoản
  username, email, password (chỉ khi tạo mới), full_name
  gender (Radio), date_of_birth (DatePicker), phone, address
  Avatar upload (crop to circle)

Section 2 — Vai trò (user_role_assignments)
  MultiSelect roles

Section 3 — Hồ sơ (nếu là GV)
  instructor_code, department_id, degree, academic_title, specialization, years_of_experience

Section 3 — Hồ sơ (nếu là SV)
  student_code, class_id, admission_year, academic_status, cv_file upload
```

---

### SCREEN 13 — CHAT / NHẮN TIN

**Route**: `/messages`

**Layout**: Conversation list (320px) + Chat area (flex-1) + Info panel (280px, có thể ẩn)

**Conversation list**:
- Search conversations
- Mỗi item: Avatar (group hoặc user) | Tên | Tin nhắn cuối | Thời gian | Unread badge
- Pinned conversations lên đầu

**Chat area**:
- Header: Avatar + tên + trạng thái online | Nút Info
- Messages: bubble chat, group by ngày, show sender avatar trong group chat
- Reply message (parent_message_id) — hiển thị quoted message
- Reaction picker (emoji)
- Read receipts: "Đã xem" dưới tin cuối
- Typing indicator: "Nguyễn A đang nhập..."
- Input area:
  - Textarea (multi-line, auto-expand)
  - Nút đính kèm (message_attachments): file | image | video
  - Nút emoji
  - Nút gửi (disabled khi rỗng)
- Message actions (hover): Reply | React | Copy | Xoá (nếu của mình)

**Message types** (message_types):
- TEXT: bubble thường
- IMAGE: thumbnail preview
- FILE: icon + tên file + size + download
- VIDEO: thumbnail + play button

**Info panel**:
- Ảnh/tên hội thoại
- Thành viên (conversation_members)
- File & media đã chia sẻ (message_attachments)
- Tắt thông báo toggle (is_muted)
- Ghim cuộc trò chuyện (is_pinned)
- Cài đặt (conversation_settings)

---

### SCREEN 14 — HỒ SƠ CÁ NHÂN

**Route**: `/profile`

- Avatar (upload + crop) + cover photo
- Thông tin cơ bản (users table): họ tên, email, SĐT, địa chỉ, giới tính, ngày sinh
- Đổi mật khẩu section (old_password + new + confirm)
- Nếu là GV: degree, academic_title, specialization, years_of_experience
- Nếu là SV: student_code, class, admission_year, GPA, credits_earned, academic_status, cv_file upload
- Lịch sử đăng nhập (last_login)

---

### SCREEN 15 — LỊCH SỬ TRẠNG THÁI (status_history)

**Route**: `/admin/audit-log`

- Table: Bảng | Record ID | Trạng thái cũ | Trạng thái mới | Người thay đổi | Lý do | Thời gian
- Filter: table_name, changed_by, ngày
- Readonly, không có form tạo

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile  (<768px):  Sidebar ẩn → Bottom navigation 4 icon, tables → cards
Tablet  (768-1024px): Sidebar thu nhỏ → icon only (48px), right panel ẩn
Desktop (>1024px): Full layout như thiết kế gốc
```

---

## ⚡ FIGMA PROMPT CHI TIẾT (copy vào Figma AI / v0 / Lovable)

```
Design a modern academic thesis management system UI called "ThesisHub" using the following specifications:

VISUAL STYLE:
- Clean, professional academic aesthetic
- Font: Plus Jakarta Sans for headings, DM Sans for body
- Primary color: #2563EB (blue), Background: #F8FAFC, Surface: white
- Sidebar: #0F172A (dark navy), 240px wide, with white text and active item highlight
- Cards with subtle shadow (box-shadow: 0 1px 3px rgba(0,0,0,0.08)), 12px border-radius
- Status badges: pill shape, colored background at 15% opacity with matching text color

LAYOUT:
- Fixed left sidebar (240px) with logo, navigation groups, and user avatar at bottom
- Main content area with breadcrumb header, page title, and action buttons
- Consistent 24px padding, 16px gap between cards, 8px gap in forms

SCREENS TO DESIGN:
1. Login page (split layout: brand left, form right)
2. Student dashboard (stats cards + timeline + task list)
3. Thesis round management (list + create form wizard)
4. Group management (tab layout with member cards + invitation flow)
5. Topic registration (3-step wizard)
6. Thesis detail page (tabbed: Overview, Members, Weekly Reports, Tasks, Peer Evaluation)
7. Defense council management (list + detail with scoring)
8. Chat interface (messenger-style with conversation list + chat area)
9. Admin user management (table with filters + create form)
10. Profile page

COMPONENT LIBRARY:
Create reusable components: Button variants, Input fields, Select dropdowns, Status badges (for thesis/group/registration statuses), Data tables with sorting, Modal dialogs, Step wizards, Score sliders (0-10), File upload areas, Avatar with role badge overlay, Notification toast

INTERACTIONS TO SHOW:
- Hover states on table rows and cards
- Active/selected states on navigation items
- Form validation error states (red border + error message)
- Loading skeleton states
- Empty state illustrations
- Badge color coding for all status fields

Make it feel like a premium SaaS product used by Vietnamese universities, clean and trustworthy.
```

---

## 🛠️ CẤU TRÚC THƯ MỤC REACTJS ĐỀ XUẤT

```
src/
├── components/
│   ├── ui/                    # Base components (Button, Input, Badge...)
│   ├── layout/                # Sidebar, Header, PageLayout
│   ├── forms/                 # Reusable form sections
│   └── shared/                # ThesisCard, MemberAvatar, StatusBadge...
├── pages/
│   ├── auth/                  # Login
│   ├── dashboard/             # Dashboard per role
│   ├── thesis-rounds/         # CRUD đợt KL
│   ├── proposed-topics/       # CRUD đề tài
│   ├── groups/                # Nhóm SV
│   ├── topic-registration/    # Đăng ký đề tài (wizard)
│   ├── theses/                # Chi tiết khóa luận
│   ├── reviews/               # Phản biện
│   ├── defense-councils/      # Hội đồng bảo vệ
│   ├── messages/              # Chat
│   ├── profile/               # Hồ sơ
│   └── admin/                 # Quản lý tổ chức, users
├── hooks/                     # useAuth, useThesis, useGroup...
├── store/                     # Zustand stores
├── services/                  # API calls (axios instances)
├── types/                     # TypeScript interfaces từ DB schema
└── utils/                     # formatDate, getStatusColor...
```

---

## 🔗 TYPESCRIPT INTERFACES (từ DB schema)

```typescript
// Từ bảng thesis_rounds
interface ThesisRound {
  id: number;
  round_code: string;
  round_name: string;
  thesis_type_id: number;
  department_id?: number;
  faculty_id?: number;
  academic_year?: string;
  semester?: 1 | 2 | 3;
  start_date?: string;
  end_date?: string;
  topic_proposal_deadline?: string;
  registration_deadline?: string;
  report_submission_deadline?: string;
  status: 'Preparing' | 'Ongoing' | 'Completed' | 'Cancelled';
}

// Từ bảng thesis_groups
interface ThesisGroup {
  id: number;
  group_code: string;
  group_name?: string;
  thesis_round_id: number;
  group_type: 'INDIVIDUAL' | 'GROUP';
  created_by: number;
  min_members: number;
  max_members: number;
  current_members: number;
  status: 'FORMING' | 'READY' | 'REGISTERED' | 'APPROVED' | 'LOCKED' | 'DISSOLVED';
}

// Từ bảng theses
interface Thesis {
  id: number;
  thesis_code: string;
  topic_title: string;
  thesis_group_id: number;
  thesis_round_id: number;
  supervisor_id: number;
  supervision_score?: number;
  review_score?: number;
  defense_score?: number;
  defense_eligible: boolean;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'WITHDRAWN';
}

// Từ bảng weekly_reports
interface WeeklyReport {
  id: number;
  thesis_id: number;
  week_number: number;
  work_completed?: string;
  results_achieved?: string;
  difficulties_encountered?: string;
  next_week_plan?: string;
  student_status: 'SUBMITTED' | 'DRAFT' | 'WITHDRAWN';
  instructor_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEED_CHANGES';
  weekly_score?: number;
}
```