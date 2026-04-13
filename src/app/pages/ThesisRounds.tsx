import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';

export function ThesisRounds() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const rounds: any[] = [];

  return (
    <PageLayout
      userRole="head"
      userName="PGS. TS. Nguyễn Văn A"
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
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
            <Input label="Tên đợt khóa luận" placeholder="VD: Khóa luận tốt nghiệp Học kỳ 1" required />
            <Select
              label="Loại khóa luận"
              options={[
                { value: '1', label: 'Khóa luận tốt nghiệp' },
                { value: '2', label: 'Đồ án tốt nghiệp' },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Năm học" placeholder="2024-2025" required />
              <Select
                label="Học kỳ"
                options={[
                  { value: 'HK1', label: 'Học kỳ 1' },
                  { value: 'HK2', label: 'Học kỳ 2' },
                  { value: 'HK3', label: 'Học kỳ 3' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thời gian</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Ngày bắt đầu" type="date" required />
              <Input label="Ngày kết thúc" type="date" required />
            </div>
            <Input label="Hạn đề xuất đề tài" type="date" />
            <Input label="Hạn đăng ký" type="date" />
            <Input label="Hạn nộp báo cáo" type="date" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quy tắc mặc định</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Chế độ nhóm</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="groupMode" value="individual" />
                  <span className="text-sm">Cá nhân</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="groupMode" value="group" />
                  <span className="text-sm">Nhóm</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="groupMode" value="both" defaultChecked />
                  <span className="text-sm">Cả hai</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Số thành viên tối thiểu" type="number" defaultValue="1" />
              <Input label="Số thành viên tối đa" type="number" defaultValue="4" />
            </div>
          </div>

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
