import { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { HeadDashboard } from './pages/HeadDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { GroupManagement } from './pages/GroupManagement';
import { TopicRegistration } from './pages/TopicRegistration';
import { ThesisRounds } from './pages/ThesisRounds';
import { Messages } from './pages/Messages';
import { WeeklyReports } from './pages/WeeklyReports';
import { Scores } from './pages/Scores';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
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
          {userRole === 'head' && <HeadDashboard />}
          {userRole === 'admin' && <AdminDashboard />}
        </ProtectedRoute>
      } />

      <Route path="/groups" element={<ProtectedRoute><GroupManagement /></ProtectedRoute>} />
      <Route path="/topic-registration" element={<ProtectedRoute><TopicRegistration /></ProtectedRoute>} />
      <Route path="/rounds" element={<ProtectedRoute><ThesisRounds /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><WeeklyReports /></ProtectedRoute>} />
      <Route path="/scores" element={<ProtectedRoute><Scores /></ProtectedRoute>} />

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