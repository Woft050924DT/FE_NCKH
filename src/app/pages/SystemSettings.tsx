import { useState } from 'react';
import { Settings, Shield, Bell, Users, Database, Globe } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';

export function SystemSettings() {
  const { user } = useAuth();
  const userRole = user?.role || 'admin';

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'Admin'}
      title="Cấu hình hệ thống"
      subtitle="Thiết lập cấu hình chung của hệ thống"
    >
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Cài đặt chung
            </CardTitle>
            <CardDescription>Thiết lập cấu hình cơ bản của hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên hệ thống</label>
              <Input defaultValue="ThesisHub - Quản lý khóa luận" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email hỗ trợ</label>
              <Input type="email" defaultValue="support@thesishub.edu.vn" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngôn ngữ mặc định</label>
              <Select
                options={[
                  { value: 'vi', label: 'Tiếng Việt' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Bảo mật
            </CardTitle>
            <CardDescription>Cấu hình bảo mật và quyền truy cập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thời gian hết hạn session (phút)</label>
              <Input type="number" defaultValue="120" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Yêu cầu mật khẩu mạnh</label>
              <Select
                options={[
                  { value: 'low', label: 'Thấp' },
                  { value: 'medium', label: 'Trung bình' },
                  { value: 'high', label: 'Cao' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bắt đầu xác thực 2FA</p>
                <p className="text-sm text-muted-foreground">Yêu cầu xác thực 2 lớp cho admin</p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Thông báo
            </CardTitle>
            <CardDescription>Cấu hình gửi thông báo hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo email</p>
                <p className="text-sm text-muted-foreground">Gửi thông báo qua email</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nhắc hạn chót</p>
                <p className="text-sm text-muted-foreground">Nhắc trước hạn chót 3 ngày</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email SMTP</label>
              <Input placeholder="smtp.example.com" />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Quản lý người dùng
            </CardTitle>
            <CardDescription>Thiết lập mặc định cho người dùng mới</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vai trò mặc định</label>
              <Select
                options={[
                  { value: 'student', label: 'Sinh viên' },
                  { value: 'instructor', label: 'Giảng viên' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Yêu cầu xác minh email</p>
                <p className="text-sm text-muted-foreground">Người dùng mới phải xác minh email</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Dữ liệu
            </CardTitle>
            <CardDescription>Quản lý và sao lưu dữ liệu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thời gian tự động sao lưu (ngày)</label>
              <Input type="number" defaultValue="7" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Sao lưu ngay</Button>
              <Button variant="outline">Khôi phục</Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Hủy</Button>
          <Button>Lưu thay đổi</Button>
        </div>
      </div>
    </PageLayout>
  );
}
