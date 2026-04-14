import { ReactNode } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import type { UserRole } from '../../../services/types';

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL specified roles
}

/**
 * Role Guard Component
 * 
 * This component conditionally renders children based on user role/permission.
 * Useful for hiding/showing specific UI elements within a page.
 * 
 * Usage:
 * <RoleGuard requiredRoles="admin">
 *   <AdminOnlyContent />
 * </RoleGuard>
 * 
 * <RoleGuard requiredPermission="manage_users">
 *   <UserManagement />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  requiredRoles,
  requiredPermission,
  fallback = null,
  requireAll = false,
}: RoleGuardProps) {
  const { canAccess, hasPermission } = useAuth();

  // Check role-based access
  if (requiredRoles) {
    const hasRoleAccess = canAccess(requiredRoles);
    if (!hasRoleAccess) {
      return <>{fallback}</>;
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const hasPermissionAccess = hasPermission(requiredPermission);
    if (!hasPermissionAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Higher-order component to wrap pages with role checking
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole | UserRole[],
  requiredPermission?: string
) {
  return function RoleGuardedComponent(props: P) {
    return (
      <RoleGuard requiredRoles={requiredRoles} requiredPermission={requiredPermission}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
