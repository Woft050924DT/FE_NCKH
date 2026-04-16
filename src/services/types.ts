// Base Types
export type UserRole = 'student' | 'instructor' | 'head' | 'department_head' | 'admin';
export type GroupMode = 'BOTH' | 'GROUP_ONLY' | 'INDIVIDUAL_ONLY';
export type Status = 'DRAFT' | 'Active' | 'COMPLETED' | 'FORMING' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type ReviewStatus = 'PENDING_REVIEW' | 'REVIEW_COMPLETED' | 'PENDING_DEFENSE' | 'DEFENSE_COMPLETED' | 'PREPARING';
export type CouncilRole = 'CHAIRMAN' | 'SECRETARY' | 'MEMBER' | 'REVIEWER';
export type MemberRole = 'LEADER' | 'MEMBER';

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  studentId?: number;
  studentCode?: string;
  className?: string;
  instructorId?: number;
  instructorCode?: string;
  departmentName?: string;
}

export interface Profile {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  studentCode?: string;
  className?: string;
  majorName?: string;
  gpa?: number;
  creditsEarned?: number;
  instructorCode?: string;
  departmentName?: string;
  degree?: string;
  academicTitle?: string;
  role: UserRole;
}

export interface LogoutResponse {
  message: string;
}

// Thesis Rounds Types
export interface CreateThesisRoundRequest {
  semester: string;
  round_name: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  faculty_id: number;
  department_id: number;
  default_group_mode: GroupMode;
  default_min_members: number;
  default_max_members: number;
}

export interface ThesisRound {
  id: number;
  semester: string;
  round_name: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  status: Status;
  faculty_id?: number;
  department_id?: number;
  thesis_round_rules?: {
    default_group_mode: GroupMode;
    default_min_members: number;
    default_max_members: number;
  };
  faculties?: {
    id: number;
    faculty_name: string;
  };
  departments?: {
    id: number;
    department_name: string;
  };
}

export interface InstructorAssignment {
  instructor_id: number;
  quota: number;
  notes?: string;
}

export interface AssignedInstructor {
  id: number;
  thesis_round_id: number;
  instructor_id: number;
  supervision_quota: number;
  current_load: number;
  notes?: string;
}

export interface AssignClassesRequest {
  class_ids: number[];
}

export interface AssignedClass {
  id: number;
  thesis_round_id: number;
  class_id: number;
}

export interface GuidanceProcess {
  week_number: number;
  phase_name: string;
  work_description: string;
  expected_outcome: string;
}

export interface AddGuidanceProcessRequest {
  processes: GuidanceProcess[];
}

export interface GuidanceProcessResponse {
  id: number;
  thesis_round_id: number;
  week_number: number;
  phase_name: string;
  work_description: string;
  expected_outcome: string;
}

// Topic Registration Types
export interface CreateProposedTopicRequest {
  topic_code: string;
  topic_title: string;
  topic_description: string;
  objectives: string;
  student_requirements: string;
  technologies_used: string;
  topic_references: string;
  thesis_round_id: number;
  group_mode: GroupMode;
  min_members: number;
  max_members: number;
  reason?: string;
  instructor_id: number;
}

export interface ProposedTopic {
  id: number;
  topic_code: string;
  topic_title: string;
  topic_description?: string;
  objectives?: string;
  technologies_used?: string;
  is_taken: boolean;
  status: boolean;
  instructor_id?: number;
  thesis_round_id?: number;
  proposed_topic_rules?: {
    group_mode: GroupMode;
    min_members: number;
    max_members: number;
  };
  instructors?: {
    id: number;
    instructor_code: string;
    users: {
      full_name: string;
      email: string;
    };
  };
}

export interface CreateTopicRegistrationRequest {
  thesis_group_id?: number;
  thesis_round_id: number;
  instructor_id: number;
  proposed_topic_id?: number;
  self_proposed_title?: string;
  self_proposed_description?: string;
  selection_reason: string;
  applied_group_mode: GroupMode;
  applied_min_members: number;
  applied_max_members: number;
  student_id: number;
}

export interface TopicRegistration {
  id: number;
  thesis_group_id: number;
  thesis_round_id: number;
  instructor_id: number;
  proposed_topic_id?: number;
  self_proposed_title?: string;
  self_proposed_description?: string;
  instructor_status: Status;
  head_status: Status | null;
  registration_date: string;
  instructor_rejection_reason?: string;
  instructor_approval_date?: string;
  head_rejection_reason?: string;
  head_approval_date?: string;
  head_override_group_mode?: GroupMode;
  head_override_min_members?: number;
  head_override_max_members?: number;
  head_override_reason?: string;
  proposed_topics?: ProposedTopic;
  thesis_groups?: ThesisGroup;
  thesis_rounds?: ThesisRound;
  instructors?: {
    id: number;
    instructor_code: string;
    users: {
      full_name: string;
      email: string;
    };
    departments?: {
      department_name: string;
    };
  };
}

export interface ApproveRegistrationRequest {
  status: 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  instructor_id: number;
}

export interface HeadApproveRegistrationRequest {
  status: 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  head_override_group_mode?: GroupMode;
  head_override_min_members?: number;
  head_override_max_members?: number;
  head_override_reason?: string;
}

// Thesis Groups Types
export interface CreateThesisGroupRequest {
  group_name: string;
  thesis_round_id: number;
  group_type: GroupMode;
  min_members: number;
  max_members: number;
}

export interface ThesisGroup {
  id: number;
  group_name: string;
  thesis_round_id: number;
  group_type: GroupMode;
  status: Status;
  min_members: number;
  max_members: number;
  thesis_group_members?: ThesisGroupMember[];
}

export interface ThesisGroupMember {
  id: number;
  thesis_group_id: number;
  student_id: number;
  role: MemberRole;
  students?: {
    student_code: string;
    users: {
      full_name: string;
      email: string;
    };
    classes?: {
      class_name: string;
    };
  };
}

export interface CreateGroupInvitationRequest {
  thesis_group_id: number;
  invited_student_id: number;
  invitation_message?: string;
}

export interface GroupInvitation {
  id: number;
  thesis_group_id: number;
  invited_student_id: number;
  invited_by: number;
  invitation_message?: string;
  status: Status;
  thesis_groups?: {
    group_name: string;
  };
  students_invited_by?: {
    student_code: string;
    users: {
      full_name: string;
    };
  };
}

// Grading Types
export interface CreateReviewAssignmentRequest {
  thesis_id: number;
  reviewer_id: number;
  review_order: number;
  review_deadline: string;
}

export interface ReviewAssignment {
  id: number;
  thesis_id: number;
  reviewer_id: number;
  review_order: number;
  assignment_date: string;
  review_deadline: string;
  status: ReviewStatus;
}

export interface SubmitReviewResultRequest {
  review_assignment_id: number;
  review_content: string;
  topic_evaluation: string;
  result_evaluation: string;
  improvement_suggestions?: string;
  review_score: number;
  defense_approval: boolean;
  rejection_reason?: string;
  review_file?: string;
}

export interface ReviewResult {
  id: number;
  review_assignment_id: number;
  review_content: string;
  review_score: number;
  defense_approval: boolean;
  review_date: string;
}

export interface SubmitSupervisionCommentRequest {
  thesis_id: number;
  instructor_id: number;
  comment_content: string;
  attitude_evaluation?: string;
  capability_evaluation?: string;
  result_evaluation?: string;
  supervision_score: number;
  defense_approval: boolean;
  rejection_reason?: string;
}

export interface SupervisionComment {
  id: number;
  thesis_id: number;
  instructor_id: number;
  comment_content: string;
  supervision_score: number;
  defense_approval: boolean;
  comment_date: string;
}

export interface SubmitPeerEvaluationRequest {
  thesis_id: number;
  evaluator_id: number;
  evaluated_id: number;
  evaluation_round: number;
  teamwork_score: number;
  responsibility_score: number;
  technical_skill_score: number;
  communication_score: number;
  contribution_score: number;
  average_score: number;
  strengths?: string;
  weaknesses?: string;
  suggestions?: string;
  is_anonymous: boolean;
}

export interface PeerEvaluation {
  id: number;
  thesis_id: number;
  evaluator_id: number;
  evaluated_id: number;
  evaluation_round: number;
  average_score: number;
  evaluation_date: string;
}

export interface ReviewWeeklyReportRequest {
  instructor_feedback: string;
  review_score: number;
  review_status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
}

export interface ThesisScores {
  thesis_id: number;
  supervision_score?: number;
  review_scores?: ReviewResult[];
  peer_evaluation_scores?: PeerEvaluation[];
  final_score?: number;
}

// Report Types
export interface CreateThesisTaskRequest {
  thesis_id: number;
  task_title: string;
  task_description?: string;
  assigned_to: number;
  due_date: string;
  priority: Priority;
  start_date: string;
  student_id: number;
}

export interface UpdateThesisTaskRequest {
  status?: TaskStatus;
  progress_percentage?: number;
  notes?: string;
}

export interface ThesisTask {
  id: number;
  thesis_id: number;
  task_title: string;
  task_description?: string;
  assigned_to: number;
  due_date: string;
  priority: Priority;
  status: TaskStatus;
  progress_percentage: number;
}

export interface CreateWeeklyReportRequest {
  thesis_id: number;
  week_number: number;
  report_content: string;
  progress_percentage: number;
  challenges: string;
  next_plan: string;
  student_id: number;
}

export interface UpdateWeeklyReportRequest {
  report_content?: string;
  progress_percentage?: number;
  challenges?: string;
  next_plan?: string;
}

export interface WeeklyReport {
  id: number;
  thesis_id: number;
  week_number: number;
  report_content: string;
  progress_percentage: number;
  challenges: string;
  next_plan: string;
  submission_date: string;
  instructor_feedback?: string;
  review_score?: number;
  review_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
}

export interface AddContributionRequest {
  weekly_report_id: number;
  student_id: number;
  contribution_description: string;
  hours_spent: number;
  tasks_completed: string;
}

export interface WeeklyReportContribution {
  id: number;
  weekly_report_id: number;
  student_id: number;
  contribution_description: string;
  hours_spent: number;
  tasks_completed: string;
}

export interface SubmitFinalReportRequest {
  final_report_file: string;
  outline_file: string;
  start_date: string;
  end_date: string;
}

export interface ThesisProgress {
  taskProgress: number;
  avgProgress: number;
  totalTasks: number;
  completedTasks: number;
  totalReports: number;
  submittedReports: number;
}

// Defense Types
export interface CreateDefenseCouncilRequest {
  council_code: string;
  council_name: string;
  thesis_round_id: number;
  chairman_id: number;
  secretary_id: number;
  defense_date: string;
  start_time: string;
  end_time: string;
  venue: string;
}

export interface DefenseCouncil {
  id: number;
  council_code: string;
  council_name: string;
  thesis_round_id: number;
  chairman_id: number;
  secretary_id: number;
  defense_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  status: ReviewStatus;
}

export interface AddCouncilMemberRequest {
  instructor_id: number;
  role: CouncilRole;
  order_number: number;
}

export interface CouncilMember {
  id: number;
  defense_council_id: number;
  instructor_id: number;
  role: CouncilRole;
  order_number: number;
}

export interface CreateDefenseAssignmentRequest {
  defense_council_id: number;
  thesis_id: number;
  defense_order: number;
  defense_time: string;
}

export interface DefenseAssignment {
  id: number;
  defense_council_id: number;
  thesis_id: number;
  defense_order: number;
  defense_time: string;
  status: ReviewStatus;
}

export interface SubmitDefenseResultRequest {
  defense_assignment_id: number;
  instructor_id: number;
  defense_score: number;
  comments?: string;
  suggestions?: string;
}

export interface DefenseResult {
  id: number;
  defense_assignment_id: number;
  instructor_id: number;
  defense_score: number;
  comments?: string;
  suggestions?: string;
  created_at: string;
}

export interface DefenseSchedule {
  thesis_id: number;
  defense_council?: {
    council_name: string;
    defense_date: string;
    start_time: string;
    end_time: string;
    venue: string;
  };
  defense_assignment?: {
    defense_order: number;
    defense_time: string;
    status: ReviewStatus;
  };
  council_members?: CouncilMember[];
}

export interface DefenseResults {
  thesis_id: number;
  defense_results: DefenseResult[];
  average_defense_score?: number;
}

// Error Response
export interface ErrorResponse {
  error: string;
}

// Generic API Response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
