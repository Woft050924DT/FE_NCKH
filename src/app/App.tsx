import { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { HeadDashboard } from './pages/HeadDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { GroupManagement } from './pages/GroupManagement';
import { TopicRegistration } from './pages/TopicRegistration';
import { HeadApproveTopics } from './pages/HeadApproveTopics';
import { DefenseCouncils } from './pages/DefenseCouncils';
import { SystemSettings } from './pages/SystemSettings';
import { HeadReports } from './pages/HeadReports';
import { HeadMessages } from './pages/HeadMessages';
import { HeadAssignInstructors } from './pages/HeadAssignInstructors';
import { ThesisRounds } from './pages/ThesisRounds';
import { Messages } from './pages/Messages';
import { WeeklyReports } from './pages/WeeklyReports';
import { Scores } from './pages/Scores';
import { MyTopics } from './pages/MyTopic';
import { MyStudents } from './pages/MyStudents';
import { ReviewSchedule } from './pages/ReviewSchedule';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ 
  children, 
  requiredRoles,
  requiredPermission 
}: { 
  children: React.ReactNode;
  requiredRoles?: any;
  requiredPermission?: string;
}) {
  const { isAuthenticated, isLoading, userRole, canAccess, hasPermission } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRoles && !canAccess(requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check permission-based access if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  const userRole = user?.role || 'student';

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          {userRole === 'student' && <StudentDashboard />}
          {userRole === 'instructor' && <InstructorDashboard />}
          {(userRole === 'head' || userRole === 'department_head') && <HeadDashboard />}
          {userRole === 'admin' && <AdminDashboard />}
        </ProtectedRoute>
      } />

      <Route path="/groups" element={
        <ProtectedRoute>
          {userRole === 'student' && <GroupManagement />}
        </ProtectedRoute>
      } />
      <Route path="/topic-registration" element={
        <ProtectedRoute>
          {userRole === 'student' && <TopicRegistration />}
        </ProtectedRoute>
      } />
      <Route path="/rounds" element={
        <ProtectedRoute>
          {(userRole === 'head' || userRole === 'department_head') && <ThesisRounds />}
        </ProtectedRoute>
      } />
      <Route path="/assign-instructors" element={
        <ProtectedRoute>
          {(userRole === 'head' || userRole === 'department_head') && <HeadAssignInstructors />}
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          {userRole === 'student' && <Messages />}
          {(userRole === 'head' || userRole === 'department_head') && <HeadMessages />}
          {userRole === 'instructor' && <Messages />}
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          {userRole === 'student' && <WeeklyReports />}
          {(userRole === 'head' || userRole === 'department_head') && <HeadReports />}
        </ProtectedRoute>
      } />
      <Route path="/scores" element={
        <ProtectedRoute>
          {userRole === 'student' && <Scores />}
        </ProtectedRoute>
      } />
      <Route path="/my-topics" element={
        <ProtectedRoute>
          {userRole === 'instructor' && <MyTopics />}
        </ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute>
          {userRole === 'instructor' && <MyStudents />}
        </ProtectedRoute>
      } />
      <Route path="/reviews" element={
        <ProtectedRoute>
          {userRole === 'instructor' && <ReviewSchedule />}
        </ProtectedRoute>
      } />
      <Route path="/approve-topics" element={
        <ProtectedRoute>
          {(userRole === 'head' || userRole === 'department_head') && <HeadApproveTopics />}
        </ProtectedRoute>
      } />
      <Route path="/councils" element={
        <ProtectedRoute>
          {(userRole === 'head' || userRole === 'department_head') && <DefenseCouncils />}
        </ProtectedRoute>
      } />
      <Route path="/organization" element={
        <ProtectedRoute>
          {userRole === 'admin' && <GroupManagement />}
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          {userRole === 'admin' && <GroupManagement />}
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          {userRole === 'admin' && <SystemSettings />}
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function LoginWrapper() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}