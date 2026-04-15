import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { thesisRoundsService } from '../../services/thesisRoundsService';
import type { ThesisRound } from '../../services/types';

export function ThesisRounds() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRounds, setIsFetchingRounds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rounds, setRounds] = useState<ThesisRound[]>([]);

  // Helper function to handle different response formats
  const handleRoundsResponse = (data: any): ThesisRound[] => {
    console.log('ThesisRounds - API Response:', data);
    
    let roundsArray: ThesisRound[] = [];
    if (Array.isArray(data)) {
      roundsArray = data;
    } else if (data && typeof data === 'object') {
      const dataObj = data as any;
      if (dataObj.data && Array.isArray(dataObj.data)) {
        roundsArray = dataObj.data;
      } else if (dataObj.success && dataObj.data && Array.isArray(dataObj.data)) {
        roundsArray = dataObj.data;
      } else {
        const values = Object.values(dataObj);
        if (values.length > 0 && Array.isArray(values[0])) {
          roundsArray = values[0];
        } else {
          roundsArray = values as ThesisRound[];
        }
      }
    }
    
    console.log('ThesisRounds - Final rounds array:', roundsArray);
    return roundsArray;
  };

  // Form state
  const [formData, setFormData] = useState({
    round_code: '',
    round_name: '',
    thesis_type_id: 1,
    semester: 1,
    academic_year: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    faculty_id: 1, // Default value - should be fetched from user context
    department_id: 1, // Default value - should be fetched from user context
    default_group_mode: 'BOTH' as 'INDIVIDUAL' | 'GROUP' | 'BOTH',
    default_min_members: 1,
    default_max_members: 4,
  });

  // Fetch thesis rounds on component mount
  useEffect(() => {
    const fetchRounds = async () => {
      setIsFetchingRounds(true);
      setError(null);
      try {
        const data = await thesisRoundsService.getThesisRoundsForHead();
        setRounds(handleRoundsResponse(data));
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách đợt khóa luận');
      } finally {
        setIsFetchingRounds(false);
      }
    };

    fetchRounds();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' || name === 'thesis_type_id' || name === 'default_min_members' || name === 'default_max_members' || name === 'faculty_id' || name === 'department_id' ? Number(value) : value,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      default_group_mode: e.target.value as 'INDIVIDUAL' | 'GROUP' | 'BOTH',
    }));
  };

  const handleActivateRound = async (id: number) => {
    try {
      await thesisRoundsService.activateThesisRoundForHead(id);
      setSuccessMessage('Kích hoạt đợt khóa luận thành công!');
      // Refresh rounds list
      const fetchRounds = async () => {
        setIsFetchingRounds(true);
        try {
          const data = await thesisRoundsService.getThesisRoundsForHead();
          setRounds(handleRoundsResponse(data));
        } catch (err: any) {
          console.error('Error refreshing rounds:', err);
        } finally {
          setIsFetchingRounds(false);
        }
      };
      fetchRounds();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi kích hoạt đợt khóa luận');
    }
  };

  const handleStartRound = async (id: number) => {
    try {
      await thesisRoundsService.startThesisRoundForHead(id);
      setSuccessMessage('Bắt đầu đợt khóa luận thành công!');
      // Refresh rounds list
      const fetchRounds = async () => {
        setIsFetchingRounds(true);
        try {
          const data = await thesisRoundsService.getThesisRoundsForHead();
          setRounds(handleRoundsResponse(data));
        } catch (err: any) {
          console.error('Error refreshing rounds:', err);
        } finally {
          setIsFetchingRounds(false);
        }
      };
      fetchRounds();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi bắt đầu đợt khóa luận');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    console.log('Submitting form data:', formData);

    try {
      await thesisRoundsService.createThesisRoundForHead(formData);
      setSuccessMessage('Tạo đợt khóa luận thành công!');
      setIsCreateModalOpen(false);
      // Reset form
      setFormData({
        round_code: '',
        round_name: '',
        thesis_type_id: 1,
        semester: 1,
        academic_year: '',
        start_date: '',
        end_date: '',
        registration_deadline: '',
        faculty_id: 1,
        department_id: 1,
        default_group_mode: 'BOTH',
        default_min_members: 1,
        default_max_members: 4,
      });
      // Refresh the rounds list
      const fetchRounds = async () => {
        setIsFetchingRounds(true);
        try {
          const data = await thesisRoundsService.getThesisRoundsForHead();
          setRounds(data);
        } catch (err: any) {
          console.error('Error refreshing rounds:', err);
        } finally {
          setIsFetchingRounds(false);
        }
      };
      fetchRounds();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đợt khóa luận');
    } finally {
      setIsLoading(false);
    }
  };

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
                {isFetchingRounds ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      Đang tải...
                    </td>
                  </tr>
                ) : rounds.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      Chưa có đợt khóa luận nào
                    </td>
                  </tr>
                ) : (
                  rounds.map((round) => (
                    <tr key={round.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="py-4 px-6">
                        <span className="font-medium text-primary">{round.round_code || `ĐK${round.id}`}</span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium">{round.round_name}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        Khóa luận
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {round.academic_year}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        HK{round.semester}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(round.start_date).toLocaleDateString('vi-VN')} → {new Date(round.end_date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getStatusBadgeVariant(round.status as any)}>
                          {round.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost">Xem</Button>
                          <Button size="sm" variant="ghost">Sửa</Button>
                          {round.status === 'Preparing' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleActivateRound(round.id)}
                            >
                              Kích hoạt
                            </Button>
                          )}
                          {round.status === 'Active' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStartRound(round.id)}
                            >
                              Bắt đầu
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo đợt khóa luận mới"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mã đợt khóa luận <span className="text-destructive">*</span>
                </label>
                <Input
                  name="round_code"
                  value={formData.round_code}
                  onChange={handleInputChange}
                  placeholder="VD: DOT1-2024-2025"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tên đợt khóa luận <span className="text-destructive">*</span>
                </label>
                <Input
                  name="round_name"
                  value={formData.round_name}
                  onChange={handleInputChange}
                  placeholder="VD: Khóa luận tốt nghiệp Học kỳ 1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loại khóa luận <span className="text-destructive">*</span>
                </label>
                <select
                  name="thesis_type_id"
                  value={formData.thesis_type_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="1">Khóa luận tốt nghiệp</option>
                  <option value="2">Đồ án môn học</option>
                  <option value="3">Khóa luận chuyên ngành</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Năm học <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="">Chọn năm học</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Học kỳ <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="">Chọn học kỳ</option>
                    <option value="1">Học kỳ 1</option>
                    <option value="2">Học kỳ 2</option>
                    <option value="3">Học kỳ 3</option>
                  </select>
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
                <Input
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ngày kết thúc <span className="text-destructive">*</span>
                </label>
                <Input
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hạn đăng ký <span className="text-destructive">*</span>
                </label>
                <Input
                  name="registration_deadline"
                  type="date"
                  value={formData.registration_deadline}
                  onChange={handleInputChange}
                  required
                />
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
                  <input
                    type="radio"
                    name="groupMode"
                    value="INDIVIDUAL"
                    checked={formData.default_group_mode === 'INDIVIDUAL'}
                    onChange={handleRadioChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Cá nhân</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="groupMode"
                    value="GROUP"
                    checked={formData.default_group_mode === 'GROUP'}
                    onChange={handleRadioChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Nhóm</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="groupMode"
                    value="BOTH"
                    checked={formData.default_group_mode === 'BOTH'}
                    onChange={handleRadioChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Cả hai</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Số thành viên tối thiểu
                </label>
                <Input
                  name="default_min_members"
                  type="number"
                  value={formData.default_min_members}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Số thành viên tối đa
                </label>
                <Input
                  name="default_max_members"
                  type="number"
                  value={formData.default_max_members}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo đợt khóa luận'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
