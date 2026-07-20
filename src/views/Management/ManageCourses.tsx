import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

export function ManageCourses() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const courses = [
    {
      id: 1,
      code: 'CS301',
      name: 'Lập trình Web nâng cao',
      department: 'Công nghệ phần mềm',
      credits: 3,
      semester: 'HK1 2024-2025',
      instructor: 'TS. Nguyễn Văn A',
      enrolled: 45,
      maxStudents: 60,
      status: 'active',
    },
    {
      id: 2,
      code: 'CS302',
      name: 'Cơ sở dữ liệu nâng cao',
      department: 'Công nghệ phần mềm',
      credits: 3,
      semester: 'HK1 2024-2025',
      instructor: 'PGS. TS. Trần Thị B',
      enrolled: 50,
      maxStudents: 60,
      status: 'active',
    },
    {
      id: 3,
      code: 'CS303',
      name: 'Machine Learning cơ bản',
      department: 'Khoa học máy tính',
      credits: 4,
      semester: 'HK1 2024-2025',
      instructor: 'TS. Lê Văn C',
      enrolled: 35,
      maxStudents: 50,
      status: 'active',
    },
  ];

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Quản lý môn học"
      subtitle="Quản lý danh sách môn học trong hệ thống"
      actions={
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Thêm môn học
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary mb-1">156</div>
            <p className="text-sm text-muted-foreground">Tổng môn học</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">98</div>
            <p className="text-sm text-muted-foreground">Đang mở</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-violet-600 mb-1">2,450</div>
            <p className="text-sm text-muted-foreground">Sinh viên đăng ký</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-amber-600 mb-1">52</div>
            <p className="text-sm text-muted-foreground">Giảng viên</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm môn học..." className="pl-10" />
            </div>
            <Select
              options={[
                { value: 'all', label: 'Tất cả bộ môn' },
                { value: 'ktpm', label: 'Công nghệ phần mềm' },
                { value: 'khmt', label: 'Khoa học máy tính' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả học kỳ' },
                { value: 'HK1', label: 'HK1 2024-2025' },
                { value: 'HK2', label: 'HK2 2024-2025' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'active', label: 'Đang mở' },
                { value: 'closed', label: 'Đã đóng' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Mã MH</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tên môn học</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Bộ môn</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Giảng viên</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">TC</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Sĩ số</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-medium text-primary">{course.code}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">{course.semester}</p>
                    </td>
                    <td className="py-4 px-6 text-sm">{course.department}</td>
                    <td className="py-4 px-6 text-sm">{course.instructor}</td>
                    <td className="py-4 px-6 text-sm">{course.credits}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{course.enrolled}/{course.maxStudents}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={course.status === 'active' ? 'green' : 'gray'}>
                        {course.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm môn học mới"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mã môn học" placeholder="VD: CS301" required />
            <Input label="Tín chỉ" type="number" placeholder="VD: 3" required />
          </div>

          <Input label="Tên môn học" placeholder="VD: Lập trình Web nâng cao" required />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Bộ môn"
              options={[
                { value: 'ktpm', label: 'Công nghệ phần mềm' },
                { value: 'khmt', label: 'Khoa học máy tính' },
                { value: 'httt', label: 'Hệ thống thông tin' },
              ]}
            />
            <Select
              label="Học kỳ"
              options={[
                { value: 'HK1-2024', label: 'HK1 2024-2025' },
                { value: 'HK2-2024', label: 'HK2 2024-2025' },
              ]}
            />
          </div>

          <Select
            label="Giảng viên phụ trách"
            options={[
              { value: '1', label: 'TS. Nguyễn Văn A' },
              { value: '2', label: 'PGS. TS. Trần Thị B' },
              { value: '3', label: 'TS. Lê Văn C' },
            ]}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input label="Số sinh viên tối đa" type="number" defaultValue="60" />
            <Input label="Thứ" placeholder="VD: 2, 4" />
            <Input label="Phòng" placeholder="VD: A101" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả môn học</label>
            <textarea
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-24 resize-y"
              placeholder="Mô tả ngắn gọn về môn học..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Thêm môn học</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
