import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/views/Auth/Login';
import { StudentDashboard } from '@/views/Student/Dashboard/StudentDashboard';
import { InstructorDashboard } from '@/views/Instructor/Dashboard/InstructorDashboard';
import { HeadDashboard } from '@/views/Head/Dashboard/HeadDashboard';
import { AdminDashboard } from '@/views/Admin/Dashboard/AdminDashboard';
import { AdminOrganizationManagement } from '@/views/Admin/Organization/AdminOrganizationManagement';
import { AdminUserManagement } from '@/views/Admin/Users/AdminUserManagement';
import { GroupManagement } from '@/views/Student/Groups/GroupManagement';
import { TopicRegistration } from '@/views/Student/TopicRegistration/TopicRegistration';
import { HeadApproveTopics } from '@/views/Head/ApproveTopics/HeadApproveTopics';
import { DefenseCouncils } from '@/views/Head/DefenseCouncils/DefenseCouncils';
import { SystemSettings } from '@/views/Admin/Settings/SystemSettings';
import { HeadReports } from '@/views/Head/Reports/HeadReports';
import { HeadMessages } from '@/views/Head/Messages/HeadMessages';
import { HeadAssignInstructors } from '@/views/Head/AssignInstructors/HeadAssignInstructors';
import { HeadAssignReviewers } from '@/views/Head/AssignReviewers/HeadAssignReviewers';
import { HeadReviewSchedule } from '@/views/Head/ReviewSchedule/HeadReviewSchedule';
import { HeadGradingTemplates } from '@/views/Head/GradingTemplates/HeadGradingTemplates';
import { ThesisRounds } from '@/views/Head/ThesisRounds/ThesisRounds';
import { Messages } from '@/views/Shared/Messages/Messages';
import { TimelinePage } from '@/views/Student/Timeline/TimelinePage';
import { WeeklyReports } from '@/views/Student/Reports/WeeklyReports';
import { Scores } from '@/views/Student/Scores/Scores';
import { MyTopics } from '@/views/Instructor/MyTopics/MyTopic';
import { MyStudents } from '@/views/Instructor/Students/MyStudents';
import { InstructorReports } from '@/views/Instructor/Reports/InstructorReports';
import { InstructorAllReports } from '@/views/Instructor/Reports/InstructorAllReports';
import { InstructorGrading } from '@/views/Instructor/Grading/InstructorGrading';
import { ReviewSchedule } from '@/views/Instructor/ReviewSchedule/ReviewSchedule';
import { Courses } from '@/views/Student/Courses/Courses';
import { InstructorCourse } from '@/views/Instructor/Courses/InstructorCourse';
import { ManageCourses } from '@/views/Head/ManageCourses/ManageCourses';


export function ProtectedRoute({ 
  children, 
  requiredRoles,
  requiredPermission 
}: { 
  children: React.ReactNode;
  requiredRoles?: any;
  requiredPermission?: string;
}) {
  const { isAuthenticated, isLoading, canAccess, hasPermission } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRoles && !canAccess(requiredRoles)) return <Navigate to="/dashboard" replace />;
  if (requiredPermission && !hasPermission(requiredPermission)) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
}

export function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  const userRole = user?.role || 'student';

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute>{userRole === 'student' && <StudentDashboard />}{userRole === 'instructor' && <InstructorDashboard />}{(userRole === 'head' || userRole === 'department_head') && <HeadDashboard />}{userRole === 'admin' && <AdminDashboard />}</ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute>{userRole === 'student' && <GroupManagement />}</ProtectedRoute>} />
      <Route path="/topic-registration" element={<ProtectedRoute>{userRole === 'student' && <TopicRegistration />}</ProtectedRoute>} />
      <Route path="/timeline" element={<ProtectedRoute>{userRole === 'student' && <TimelinePage />}</ProtectedRoute>} />
      <Route path="/rounds" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head') && <ThesisRounds />}</ProtectedRoute>} />
      <Route path="/assign-instructors" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head') && <HeadAssignInstructors />}</ProtectedRoute>} />
      <Route path="/assign-reviewers" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head') && <HeadAssignReviewers />}</ProtectedRoute>} />
      <Route path="/review-schedule" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head') && <HeadReviewSchedule />}</ProtectedRoute>} />
      <Route path="/grading-templates" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head' || userRole === 'admin') && <HeadGradingTemplates />}</ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute>{userRole === 'student' && <Messages />}{(userRole === 'head' || userRole === 'department_head') && <HeadMessages />}{userRole === 'instructor' && <Messages />}</ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute>{userRole === 'student' && <WeeklyReports />}{userRole === 'instructor' && <InstructorAllReports />}{(userRole === 'head' || userRole === 'department_head') && <HeadReports />}</ProtectedRoute>} />
      <Route path="/scores" element={<ProtectedRoute>{userRole === 'student' && <Scores />}</ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute>{userRole === 'student' && <Courses />}</ProtectedRoute>} />
      <Route path="/my-topics" element={<ProtectedRoute>{userRole === 'instructor' && <MyTopics />}</ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute>{userRole === 'instructor' && <MyStudents />}</ProtectedRoute>} />
      <Route path="/students/:thesisId/reports" element={<ProtectedRoute>{userRole === 'instructor' && <InstructorReports />}</ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute>{userRole === 'instructor' && <ReviewSchedule />}</ProtectedRoute>} />
      <Route path="/grading" element={<ProtectedRoute>{userRole === 'instructor' && <InstructorGrading />}</ProtectedRoute>} />
      <Route path="/instructor-courses" element={<ProtectedRoute>{userRole === 'instructor' && <InstructorCourse />}</ProtectedRoute>} />
      <Route path="/approve-topics" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head') && <HeadApproveTopics />}</ProtectedRoute>} />
      <Route path="/councils" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head') && <DefenseCouncils />}</ProtectedRoute>} />
      <Route path="/manage-courses" element={<ProtectedRoute>{(userRole === 'head' || userRole === 'department_head') && <ManageCourses />}</ProtectedRoute>} />
      <Route path="/organization" element={<ProtectedRoute>{userRole === 'admin' && <AdminOrganizationManagement />}</ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute>{userRole === 'admin' && <AdminUserManagement />}</ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute>{userRole === 'admin' && <SystemSettings />}</ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
