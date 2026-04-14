import { ReactNode } from 'react';
import { PageLayout } from './PageLayout';
import { useAuth } from '../../../contexts/AuthContext';
import type { UserRole } from '../../../services/types';

interface RoleBasedPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

/**
 * Role-based Page Layout Wrapper
 * 
 * This component automatically:
 * 1. Fetches user role from AuthContext
 * 2. Checks if user has required role/permission
 * 3. Renders PageLayout with correct role
 * 4. Shows fallback if access denied
 * 
 * Usage:
 * <RoleBasedPageLayout 
 *   title="Dashboard" 
 *   requiredRoles="student"
 * >
 *   <YourContent />
 * </RoleBasedPageLayout>
 */
export function RoleBasedPageLayout({
  children,
  title,
  subtitle,
  actions,
  requiredRoles,
  requiredPermission,
  fallback,
}: RoleBasedPageLayoutProps) {
  const { user, userRole, canAccess, hasPermission } = useAuth();

  // Check role-based access
  if (requiredRoles && !canAccess(requiredRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Truy cập bị từ chối</h2>
          <p className="text-muted-foreground">Bạn không có quyền truy cập trang này</p>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Truy cập bị từ chối</h2>
          <p className="text-muted-foreground">Bạn không có quyền thực hiện hành động này</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      userRole={userRole}
      userName={user?.fullName || 'Người dùng'}
      title={title}
      subtitle={subtitle}
      actions={actions}
    >
      {children}
    </PageLayout>
  );
}
