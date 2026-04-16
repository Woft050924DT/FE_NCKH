import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { topicRegistrationService, thesisRoundsService, instructorService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { ProposedTopic, CreateProposedTopicRequest, ThesisRound } from '../../services/types';

export function MyTopics() {
  const { user } = useAuth();
  const userRole = user?.role || 'instructor';
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<ProposedTopic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [thesisRounds, setThesisRounds] = useState<ThesisRound[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'rounds' | 'topics'>('rounds');
  const [selectedRound, setSelectedRound] = useState<ThesisRound | null>(null);
  const [formData, setFormData] = useState<CreateProposedTopicRequest>({
    topic_code: '',
    topic_title: '',
    topic_description: '',
    objectives: '',
    student_requirements: '',
    technologies_used: '',
    topic_references: '',
    thesis_round_id: 1,
    group_mode: 'GROUP_ONLY',
    min_members: 2,
    max_members: 4,
    instructor_id: 0,
  });

  useEffect(() => {
    fetchThesisRounds();
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [selectedRoundId]);

  const fetchThesisRounds = async () => {
    console.log('Calling API: /api/instructor/thesis-rounds');
    try {
      const data = await thesisRoundsService.getThesisRoundsForInstructor();
      console.log('API Response:', data);
      console.log('Response type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Keys:', Object.keys(data || {}));
      console.log('First item structure:', Array.isArray(data) && data[0] ? JSON.stringify(data[0], null, 2) : 'Not an array or empty');
      
      // Handle different response formats
      let roundsArray: ThesisRound[] = [];
      if (Array.isArray(data)) {
        roundsArray = data;
      } else if (data && typeof data === 'object') {
        const dataObj = data as any;
        // Check if it has a data property
        if (dataObj.data && Array.isArray(dataObj.data)) {
          roundsArray = dataObj.data;
        } else if (dataObj.success && dataObj.data && Array.isArray(dataObj.data)) {
          roundsArray = dataObj.data;
        } else {
          // Try to get values from the object
          const values = Object.values(dataObj);
          if (values.length > 0 && Array.isArray(values[0])) {
            roundsArray = values[0];
          } else {
            roundsArray = values as ThesisRound[];
          }
        }
      }
      
      console.log('Final rounds array:', roundsArray);
      setThesisRounds(roundsArray);
    } catch (err) {
      console.error('Error fetching thesis rounds:', err);
      setThesisRounds([]);
    }
  };

  const handleSelectRound = (round: ThesisRound) => {
    setSelectedRound(round);
    setSelectedRoundId(round.id);
    setViewMode('topics');
  };

  const handleBackToRounds = () => {
    setViewMode('rounds');
    setSelectedRound(null);
    setSelectedRoundId(null);
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const instructorId = user?.instructorId || user?.id;
      if (instructorId) {
        const data = await topicRegistrationService.getProposedTopicsByInstructor(instructorId, selectedRoundId || undefined);
        setTopics(data);
      }
    } catch (err) {
      setError('Không thể tải danh sách đề tài');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const instructorId = user?.instructorId || user?.id;
      if (!instructorId) {
        setError('Không tìm thấy thông tin giảng viên');
        return;
      }

      const topicData: CreateProposedTopicRequest = {
        ...formData,
        instructor_id: instructorId,
        thesis_round_id: selectedRoundId || formData.thesis_round_id,
      };

      await topicRegistrationService.createProposedTopic(topicData);
      setIsCreateModalOpen(false);
      setFormData({
        topic_code: '',
        topic_title: '',
        topic_description: '',
        objectives: '',
        student_requirements: '',
        technologies_used: '',
        topic_references: '',
        thesis_round_id: selectedRoundId || 1,
        group_mode: 'GROUP_ONLY',
        min_members: 2,
        max_members: 4,
        instructor_id: 0,
      });
      fetchTopics();
    } catch (err) {
      setError('Không thể tạo đề tài');
      console.error('Error creating topic:', err);
    }
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'Giảng viên'}
      title={viewMode === 'rounds' ? 'Đợt khóa luận' : selectedRound?.round_name || 'Đề tài của tôi'}
      subtitle={viewMode === 'rounds' ? 'Chọn đợt khóa luận để xem đề tài' : 'Quản lý các đề tài đã đề xuất'}
      actions={
        viewMode === 'topics' ? (
          <>
            <Button variant="ghost" onClick={handleBackToRounds}>
              ← Quay lại
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Đề xuất đề tài mới
            </Button>
          </>
        ) : null
      }
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : (
        <>
          {viewMode === 'rounds' ? (
            /* Rounds List */
            <>
              {thesisRounds.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Không có đợt khóa luận nào đang mở</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {thesisRounds.map((round) => {
                    const roundData = round as any;
                    return (
                    <Card
                      key={round.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleSelectRound(round)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {roundData.round_name || roundData.roundName || `Đợt ${round.id}`}
                        </CardTitle>
                        <CardDescription>
                          {roundData.academic_year || roundData.academicYear || 'N/A'} - HK{roundData.semester || 'N/A'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bắt đầu:</span>
                            <span className="font-medium">
                              {roundData.start_date ? new Date(roundData.start_date).toLocaleDateString('vi-VN') : 
                               roundData.startDate ? new Date(roundData.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kết thúc:</span>
                            <span className="font-medium">
                              {roundData.end_date ? new Date(roundData.end_date).toLocaleDateString('vi-VN') : 
                               roundData.endDate ? new Date(roundData.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hạn đăng ký:</span>
                            <span className="font-medium">
                              {roundData.registration_deadline ? new Date(roundData.registration_deadline).toLocaleDateString('vi-VN') : 
                               roundData.registrationDeadline ? new Date(roundData.registrationDeadline).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                          </div>
                          <div className="pt-2">
                            <Badge variant={roundData.status === 'Active' ? 'default' : 'secondary'}>
                              {roundData.status || 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Topics List */
            <>
              {/* Search */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm đề tài..." className="pl-10" />
                  </div>
                </CardContent>
              </Card>

              {/* Topics Grid */}
              {topics.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Chưa có đề tài nào</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topics.map((topic) => (
                    <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-base">{topic.topic_title}</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">Mã: {topic.topic_code}</p>
                          </div>
                          <Badge variant={topic.is_taken ? 'secondary' : 'outline'}>
                            {topic.is_taken ? 'Đã có nhóm' : 'Còn trống'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {topic.topic_description}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">Công nghệ</p>
                          <div className="flex flex-wrap gap-2">
                            {topic.technologies_used && topic.technologies_used.split(',').map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Chế độ: </span>
                            <span className="font-medium">
                              {topic.proposed_topic_rules?.group_mode === 'INDIVIDUAL_ONLY' ? 'Cá nhân' :
                               topic.proposed_topic_rules?.group_mode === 'GROUP_ONLY' ? 'Nhóm' : 'Cả hai'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Thành viên: </span>
                            <span className="font-medium">
                              {topic.proposed_topic_rules?.min_members}-{topic.proposed_topic_rules?.max_members}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="flex-1">
                            <Eye className="w-4 h-4" />
                            Xem
                          </Button>
                          <Button size="sm" variant="ghost" className="flex-1">
                            <Edit className="w-4 h-4" />
                            Sửa
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Create Topic Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Đề xuất đề tài mới"
        size="lg"
      >
        <form onSubmit={handleCreateTopic} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mã đề tài</label>
              <Input
                placeholder="VD: DT-004"
                required
                value={formData.topic_code}
                onChange={(e) => setFormData({ ...formData, topic_code: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tên đề tài</label>
              <Input
                placeholder="Nhập tên đề tài..."
                required
                value={formData.topic_title}
                onChange={(e) => setFormData({ ...formData, topic_title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Đợt khóa luận ID</label>
              <Input
                type="number"
                required
                value={formData.thesis_round_id}
                onChange={(e) => setFormData({ ...formData, thesis_round_id: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả đề tài</label>
            <textarea
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-32 resize-y"
              placeholder="Mô tả chi tiết về đề tài, mục tiêu, yêu cầu..."
              required
              value={formData.topic_description}
              onChange={(e) => setFormData({ ...formData, topic_description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mục tiêu</label>
            <textarea
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-24 resize-y"
              placeholder="Các mục tiêu cần đạt được..."
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Yêu cầu sinh viên</label>
            <textarea
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-24 resize-y"
              placeholder="Kiến thức, kỹ năng cần có..."
              value={formData.student_requirements}
              onChange={(e) => setFormData({ ...formData, student_requirements: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Công nghệ sử dụng</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg"
              placeholder="VD: Python, React, MongoDB (cách nhau bởi dấu phẩy)"
              value={formData.technologies_used}
              onChange={(e) => setFormData({ ...formData, technologies_used: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tài liệu tham khảo</label>
            <textarea
              className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-24 resize-y"
              placeholder="Các tài liệu tham khảo..."
              value={formData.topic_references}
              onChange={(e) => setFormData({ ...formData, topic_references: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Quy tắc nhóm</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Chế độ nhóm</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="groupMode"
                    value="INDIVIDUAL_ONLY"
                    checked={formData.group_mode === 'INDIVIDUAL_ONLY'}
                    onChange={(e) => setFormData({ ...formData, group_mode: e.target.value as any })}
                  />
                  <span className="text-sm">Cá nhân</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="groupMode"
                    value="GROUP_ONLY"
                    checked={formData.group_mode === 'GROUP_ONLY'}
                    onChange={(e) => setFormData({ ...formData, group_mode: e.target.value as any })}
                  />
                  <span className="text-sm">Nhóm</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="groupMode"
                    value="BOTH"
                    checked={formData.group_mode === 'BOTH'}
                    onChange={(e) => setFormData({ ...formData, group_mode: e.target.value as any })}
                  />
                  <span className="text-sm">Cả hai</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Số thành viên tối thiểu</label>
                <Input
                  type="number"
                  value={formData.min_members}
                  onChange={(e) => setFormData({ ...formData, min_members: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Số thành viên tối đa</label>
                <Input
                  type="number"
                  value={formData.max_members}
                  onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Tạo đề tài</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
