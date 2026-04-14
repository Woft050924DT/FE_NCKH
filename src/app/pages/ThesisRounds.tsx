import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';

export function ThesisRounds() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const rounds: any[] = [];

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Quản lý đợt khóa luận"
      subtitle="Tạo và quản lý các đợt khóa luận tốt nghiệp"
      actions={
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Tạo đợt mới
        </Button>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đợt khóa luận..."
                className="pl-10"
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'Tất cả năm học' },
                { value: '2024-2025', label: '2024-2025' },
                { value: '2023-2024', label: '2023-2024' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả học kỳ' },
                { value: 'HK1', label: 'Học kỳ 1' },
                { value: 'HK2', label: 'Học kỳ 2' },
                { value: 'HK3', label: 'Học kỳ 3' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'Preparing', label: 'Chuẩn bị' },
                { value: 'Ongoing', label: 'Đang diễn ra' },
                { value: 'Completed', label: 'Hoàn thành' },
                { value: 'Cancelled', label: 'Đã hủy' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Mã đợt</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tên đợt</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Loại</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Năm học</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">HK</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Thời gian</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((round) => (
                  <tr key={round.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="py-4 px-6">
                      <span className="font-medium text-primary">{round.code}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium">{round.name}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {round.type}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {round.academicYear}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {round.semester}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      {round.startDate} → {round.endDate}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getStatusBadgeVariant(round.status)}>
                        {round.status === 'Ongoing' && 'Đang diễn ra'}
                        {round.status === 'Preparing' && 'Chuẩn bị'}
                        {round.status === 'Completed' && 'Hoàn thành'}
                        {round.status === 'Cancelled' && 'Đã hủy'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost">Xem</Button>
                        <Button size="sm" variant="ghost">Sửa</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo đợt khóa luận mới"
        size="lg"
      >
        <form className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tên đợt khóa luận <span className="text-destructive">*</span>
                </label>
                <Input placeholder="VD: Khóa luận tốt nghiệp Học kỳ 1" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loại khóa luận <span className="text-destructive">*</span>
                </label>
                <Select
                  options={[
                    { value: 'thesis', label: 'Khóa luận tốt nghiệp' },
                    { value: 'project', label: 'Đồ án tốt nghiệp' },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Năm học <span className="text-destructive">*</span>
                  </label>
                  <Select
                    options={[
                      { value: '2024-2025', label: '2024-2025' },
                      { value: '2025-2026', label: '2025-2026' },
                      { value: '2026-2027', label: '2026-2027' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Học kỳ <span className="text-destructive">*</span>
                  </label>
                  <Select
                    options={[
                      { value: 'HK1', label: 'Học kỳ 1' },
                      { value: 'HK2', label: 'Học kỳ 2' },
                      { value: 'HK3', label: 'Học kỳ 3' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Thời gian */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Thời gian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ngày bắt đầu <span className="text-destructive">*</span>
                </label>
                <Input type="date" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ngày kết thúc <span className="text-destructive">*</span>
                </label>
                <Input type="date" required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hạn đề xuất đề tài
                </label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hạn đăng ký
                </label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hạn nộp báo cáo
                </label>
                <Input type="date" />
              </div>
            </div>
          </div>

          {/* Quy tắc nhóm */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Quy tắc nhóm</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Chế độ nhóm
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="groupMode" value="individual" className="w-4 h-4" />
                  <span className="text-sm">Cá nhân</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="groupMode" value="group" className="w-4 h-4" />
                  <span className="text-sm">Nhóm</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="groupMode" value="both" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Cả hai</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Số thành viên tối thiểu
                </label>
                <Input type="number" defaultValue="1" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Số thành viên tối đa
                </label>
                <Input type="number" defaultValue="4" min="1" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Tạo đợt khóa luận</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
