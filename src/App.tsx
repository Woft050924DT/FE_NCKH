import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { AIChatBox } from '@/components/AIChatBox';
import { AppRoutes } from '@/router';
import { Login } from '@/views/Auth/Login';

function LoginWrapper() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
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
        <Toaster />
        <AIChatBox />
      </AuthProvider>
    </BrowserRouter>
  );
}
