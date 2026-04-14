import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, Profile, LoginRequest, UserRole } from '../services/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccess: (requiredRoles: UserRole | UserRole[]) => boolean;
}

// Role permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  student: [
    'view_dashboard',
    'view_groups',
    'register_topic',
    'submit_reports',
    'view_scores',
    'send_messages',
  ],
  instructor: [
    'view_dashboard',
    'manage_topics',
    'view_students',
    'review_thesis',
    'send_messages',
  ],
  head: [
    'view_dashboard',
    'manage_rounds',
    'approve_topics',
    'manage_councils',
    'view_reports',
    'send_messages',
  ],
  department_head: [
    'view_dashboard',
    'manage_rounds',
    'approve_topics',
    'manage_councils',
    'view_reports',
    'send_messages',
  ],
  admin: [
    'view_dashboard',
    'manage_organization',
    'manage_users',
    'system_settings',
    'full_access',
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userRole: UserRole = user?.role || 'student';

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    console.log('Login response user:', response.user);
    console.log('User role:', response.user?.role);
    
    // Validate role
    if (response.user?.role && !ROLE_PERMISSIONS[response.user.role]) {
      throw new Error(`Invalid role: ${response.user.role}`);
    }
    
    setUser(response.user);
    await refreshProfile();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const profileData = await authService.getProfile(user?.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  };

  // Check if user has specific role(s)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user?.role) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.role);
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user?.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission) || permissions.includes('full_access');
  };

  // Check if user can access based on required roles
  const canAccess = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user?.role) return false;
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    userRole,
    login,
    logout,
    refreshProfile,
    hasRole,
    hasPermission,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
