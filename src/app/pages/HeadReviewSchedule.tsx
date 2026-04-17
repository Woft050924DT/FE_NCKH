import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Search, Filter, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { thesisRoundsService } from '../../services/thesisRoundsService';
import type { ThesisRound } from '../../services/types';

interface ReviewScheduleItem {
  id: number;
  thesisCode: string;
  thesisTitle: string;
  groupName: string;
  students: string[];
  supervisor: string;
  reviewer: string;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export function HeadReviewSchedule() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [rounds, setRounds] = useState<ThesisRound[]>([]);
  const [selectedRound, setSelectedRound] = useState<ThesisRound | null>(null);
  const [schedules, setSchedules] = useState<ReviewScheduleItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ReviewScheduleItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for schedules
  const mockSchedules: ReviewScheduleItem[] = [
    {
      id: 1,
      thesisCode: 'KL2024-008',
      thesisTitle: 'Hệ thống IoT giám sát môi trường nông nghiệp',
      groupName: 'Nhóm IoT Smart Farm',
      students: ['Nguyễn Văn X', 'Trần Thị Y'],
      supervisor: 'TS. Lê Văn B',
      reviewer: 'TS. Hoàng Thị C',
      scheduledDate: '2026-04-25',
      scheduledTime: '09:00',
      location: 'Phòng họp A - Tầng 3',
      status: 'SCHEDULED',
    },
    {
      id: 2,
      thesisCode: 'KL2024-015',
      thesisTitle: 'Ứng dụng Blockchain trong quản lý chuỗi cung ứng',
      groupName: 'Nhóm Blockchain',
      students: ['Phạm Văn Z'],
      supervisor: 'TS. Nguyễn Văn D',
      reviewer: 'PGS. TS. Trần Thị E',
      scheduledDate: '2026-04-25',
      scheduledTime: '10:30',
      location: 'Phòng họp B - Tầng 3',
      status: 'SCHEDULED',
    },
    {
      id: 3,
      thesisCode: 'KL2024-003',
      thesisTitle: 'Hệ thống nhận diện biển số xe thông minh',
      groupName: 'Nhóm Computer Vision',
      students: ['Đỗ Văn M', 'Vũ Thị N'],
      supervisor: 'PGS. TS. Nguyễn Văn F',
      reviewer: 'TS. Lê Văn G',
      scheduledDate: '2026-04-24',
      scheduledTime: '14:00',
      location: 'Phòng họp A - Tầng 3',
      status: 'COMPLETED',
    },
  ];

  useEffect(() => {
    fetchRounds();
    // Load schedules from localStorage or use mock data
    const savedSchedules = localStorage.getItem('reviewSchedules');
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules));
      } catch (e) {
        setSchedules(mockSchedules);
      }
    } else {
      setSchedules(mockSchedules);
    }
  }, []);

  const fetchRounds = async () => {
    try {
      setIsLoading(true);
      const data = await thesisRoundsService.getThesisRoundsForHead();
      let roundsArray: ThesisRound[] = [];
      if (Array.isArray(data)) {
        roundsArray = data;
      } else if (data && typeof data === 'object') {
        const dataObj = data as any;
        if (dataObj.data && Array.isArray(dataObj.data)) {
          roundsArray = dataObj.data;
        }
      }
      const activeRounds = roundsArray.filter((round: any) => 
        round.status?.toUpperCase() === 'ACTIVE'
      );
      setRounds(activeRounds);
      if (activeRounds.length > 0) {
        setSelectedRound(activeRounds[0]);
      }
    } catch (error) {
      console.error('Error fetching rounds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      schedule.thesisTitle.toLowerCase().includes(searchLower) ||
      schedule.thesisCode.toLowerCase().includes(searchLower) ||
      schedule.groupName.toLowerCase().includes(searchLower) ||
      schedule.students.some(s => s.toLowerCase().includes(searchLower));
    
    const matchesStatus = filterStatus === 'all' || !filterStatus || schedule.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant="default">Đã lên lịch</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="secondary">Đang diễn ra</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-500 hover:bg-green-600">Hoàn thành</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to create schedule
    const newSchedule: ReviewScheduleItem = {
      id: Date.now(),
      thesisCode: 'KL2024-NEW',
      thesisTitle: 'Đề tài mới',
      groupName: 'Nhóm mới',
      students: ['Sinh viên A'],
      supervisor: 'GV Hướng dẫn',
      reviewer: 'GV Phản biện 1',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      location: 'Phòng họp A',
      status: 'SCHEDULED',
    };
    setSchedules(prevSchedules => {
      const updated = [...prevSchedules, newSchedule];
      localStorage.setItem('reviewSchedules', JSON.stringify(updated));
      return updated;
    });
    toast.success('Tạo lịch phản biện thành công!');
    setIsCreateModalOpen(false);
  };

  const handleEditSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to update schedule
    toast.success('Cập nhật lịch phản biện thành công!');
    setIsEditModalOpen(false);
    setEditingSchedule(null);
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Quản lý lịch phản biện"
      subtitle="Lên lịch và quản lý các buổi phản biện khóa luận"
      actions={
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo lịch mới
        </Button>
      }
    >
      {/* Select Round */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Chọn đợt khóa luận</CardTitle>
          <CardDescription>Chọn đợt để xem và quản lý lịch phản biện</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : rounds.length === 0 ? (
            <p className="text-muted-foreground">Không có đợt nào</p>
          ) : (
            <Select
              value={selectedRound?.id.toString() || ''}
              onValueChange={(value) => {
                const round = rounds.find(r => r.id === Number(value));
                setSelectedRound(round || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đợt khóa luận..." />
              </SelectTrigger>
              <SelectContent>
                {rounds.map(round => (
                  <SelectItem key={round.id} value={round.id.toString()}>
                    {round.round_name} ({round.round_code || 'ĐK' + round.id}) - {round.academic_year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      {selectedRound && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã đề tài, tên đề tài, sinh viên..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
                  <SelectItem value="IN_PROGRESS">Đang diễn ra</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedules List */}
      {selectedRound && (
        <div className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {searchTerm || filterStatus ? 'Không tìm thấy lịch nào' : 'Chưa có lịch phản biện nào'}
              </CardContent>
            </Card>
          ) : (
            filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{schedule.thesisTitle}</h3>
                        {getStatusBadge(schedule.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Mã: {schedule.thesisCode}</p>
                      <p className="text-sm text-muted-foreground">{schedule.groupName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sinh viên</p>
                      <div className="space-y-1">
                        {schedule.students.map((student, idx) => (
                          <p key={idx} className="text-sm font-medium">{student}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">GV Hướng dẫn</p>
                      <p className="text-sm font-medium">{schedule.supervisor}</p>
                      <p className="text-sm text-muted-foreground mt-2">GV Phản biện</p>
                      <p className="text-sm font-medium">{schedule.reviewer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Thời gian</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{schedule.scheduledDate}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium">{schedule.scheduledTime}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Địa điểm</p>
                      <p className="text-sm font-medium">{schedule.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setEditingSchedule(schedule);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hủy lịch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Create Schedule Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo lịch phản biện mới"
        size="lg"
      >
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chọn đề tài</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn đề tài khóa luận..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">KL2024-008 - Hệ thống IoT giám sát môi trường nông nghiệp</SelectItem>
                <SelectItem value="2">KL2024-015 - Ứng dụng Blockchain trong quản lý chuỗi cung ứng</SelectItem>
                <SelectItem value="3">KL2024-003 - Hệ thống nhận diện biển số xe thông minh</SelectItem>
                <SelectItem value="4">KL2024-020 - Phát triển ứng dụng quản lý học tập trực tuyến</SelectItem>
                <SelectItem value="5">KL2024-025 - Nghiên cứu và xây dựng chatbot hỗ trợ học tập</SelectItem>
                <SelectItem value="6">KL2024-030 - Hệ thống quản lý kho hàng thông minh</SelectItem>
                <SelectItem value="7">KL2024-035 - Ứng dụng AI trong phân tích dữ liệu y tế</SelectItem>
                <SelectItem value="8">KL2024-040 - Xây dựng nền tảng thương mại điện tử</SelectItem>
                <SelectItem value="9">KL2024-045 - Hệ thống quản lý tài chính cá nhân</SelectItem>
                <SelectItem value="10">KL2024-050 - Nghiên cứu thuật toán nén dữ liệu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giảng viên phản biện 1</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn giáo viên phản biện 1..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">TS. Hoàng Thị C</SelectItem>
                <SelectItem value="2">PGS. TS. Trần Thị E</SelectItem>
                <SelectItem value="3">TS. Lê Văn G</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giảng viên phản biện 2</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn giáo viên phản biện 2..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">TS. Hoàng Thị C</SelectItem>
                <SelectItem value="2">PGS. TS. Trần Thị E</SelectItem>
                <SelectItem value="3">TS. Lê Văn G</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày phản biện</label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giờ bắt đầu</label>
              <Input type="time" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Địa điểm</label>
            <Input placeholder="VD: Phòng họp A - Tầng 3" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Tạo lịch</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa lịch phản biện"
        size="lg"
      >
        <form onSubmit={handleEditSchedule} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Đề tài</label>
            <Input value={editingSchedule?.thesisTitle || ''} disabled />
            <p className="text-sm text-muted-foreground mt-1">Mã: {editingSchedule?.thesisCode || ''}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giảng viên phản biện 1</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={editingSchedule?.reviewer || "Chọn giáo viên phản biện 1..."} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">TS. Hoàng Thị C</SelectItem>
                <SelectItem value="2">PGS. TS. Trần Thị E</SelectItem>
                <SelectItem value="3">TS. Lê Văn G</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giảng viên phản biện 2</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn giáo viên phản biện 2..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">TS. Hoàng Thị C</SelectItem>
                <SelectItem value="2">PGS. TS. Trần Thị E</SelectItem>
                <SelectItem value="3">TS. Lê Văn G</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ngày phản biện</label>
              <Input type="date" defaultValue={editingSchedule?.scheduledDate || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giờ bắt đầu</label>
              <Input type="time" defaultValue={editingSchedule?.scheduledTime || ''} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Địa điểm</label>
            <Input placeholder="VD: Phòng họp A - Tầng 3" defaultValue={editingSchedule?.location || ''} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={editingSchedule?.status || "Chọn trạng thái..."} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
                <SelectItem value="IN_PROGRESS">Đang diễn ra</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
