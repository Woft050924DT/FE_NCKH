import { Home, FileText, Users, ClipboardList, MessageSquare, Settings, User, BookOpen, CheckSquare, Shield, LogOut, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { cn } from '../../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../../contexts/AuthContext';

interface SidebarProps {
  userRole?: 'student' | 'instructor' | 'head' | 'department_head' | 'admin';
  userName?: string;
  userAvatar?: string;
}

const menuItems = {
  student: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Nhóm của tôi', path: '/groups' },
    { icon: FileText, label: 'Đề tài', path: '/topic-registration' },
    { icon: ClipboardList, label: 'Báo cáo tuần', path: '/reports' },
    { icon: BookOpen, label: 'Điểm số', path: '/scores' },
    { icon: MessageSquare, label: 'Tin nhắn', path: '/messages' },
  ],
  instructor: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Đề tài của tôi', path: '/my-topics' },
    { icon: Users, label: 'Sinh viên hướng dẫn', path: '/students' },
    { icon: ClipboardList, label: 'Báo cáo', path: '/reports' },
    { icon: CheckSquare, label: 'Lịch phản biện', path: '/reviews' },
    { icon: MessageSquare, label: 'Tin nhắn', path: '/messages' },
  ],
  head: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Đợt khóa luận', path: '/rounds' },
    { icon: UserPlus, label: 'Phân công giáo viên', path: '/assign-instructors' },
    { icon: FileText, label: 'Duyệt đề tài', path: '/approve-topics' },
    { icon: Shield, label: 'Hội đồng', path: '/councils' },
    { icon: ClipboardList, label: 'Báo cáo', path: '/reports' },
    { icon: MessageSquare, label: 'Tin nhắn', path: '/messages' },
  ],
  admin: [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Shield, label: 'Tổ chức', path: '/organization' },
    { icon: Users, label: 'Người dùng', path: '/users' },
    { icon: Settings, label: 'Cấu hình hệ thống', path: '/settings' },
  ],
};

export function Sidebar({ userRole = 'student', userName = 'Nguyễn Văn A', userAvatar }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  // Map department_head to head for menu items
  const roleKey = userRole === 'department_head' ? 'head' : userRole;
  const items = menuItems[roleKey] || menuItems['student'];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-60 h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <Link to="/dashboard" className="p-6 border-b border-sidebar-border block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>ThesisHub</h1>
            <p className="text-xs text-sidebar-accent-foreground">Quản lý khóa luận</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
          <Avatar src={userAvatar} name={userName} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-sidebar-accent-foreground truncate">
              {userRole === 'student' && 'Sinh viên'}
              {userRole === 'instructor' && 'Giảng viên'}
              {userRole === 'head' && 'Trưởng bộ môn'}
              {userRole === 'admin' && 'Quản trị viên'}
            </p>
          </div>
          <User className="w-4 h-4 text-sidebar-accent-foreground" />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-left text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
