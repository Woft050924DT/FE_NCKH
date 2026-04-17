import { Search, Eye, MessageSquare, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { Select } from '../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { thesisRoundsService } from '../../services/thesisRoundsService';
import type { ThesisRound } from '../../services/types';

export function MyStudents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role || 'instructor';
  
  // Thesis rounds
  const [thesisRounds, setThesisRounds] = useState<ThesisRound[]>([]);
  const [selectedThesisRoundId, setSelectedThesisRoundId] = useState<number | undefined>(undefined);
  const [roundsLoading, setRoundsLoading] = useState(true);
  
  const students = [
    {
      id: 1,
      groupCode: 'KL2024-001',
      groupName: 'Nhóm nghiên cứu AI',
      topic: 'Ứng dụng Machine Learning trong phân tích dữ liệu y tế',
      status: 'IN_PROGRESS',
      members: [
        { name: 'Nguyễn Văn A', studentCode: 'SV001', role: 'Leader' },
        { name: 'Trần Thị B', studentCode: 'SV002', role: 'Member' },
        { name: 'Lê Văn C', studentCode: 'SV003', role: 'Member' },
      ],
      currentWeek: 8,
      totalWeeks: 15,
      supervisionScore: 8.5,
      lastReportDate: '13/04/2026',
      reportStatus: 'APPROVED',
    },
    {
      id: 2,
      groupCode: 'KL2024-005',
      groupName: 'Nhóm NLP',
      topic: 'Chatbot hỗ trợ khách hàng sử dụng NLP',
      status: 'IN_PROGRESS',
      members: [
        { name: 'Phạm Văn D', studentCode: 'SV010', role: 'Leader' },
        { name: 'Hoàng Thị E', studentCode: 'SV011', role: 'Member' },
      ],
      currentWeek: 7,
      totalWeeks: 15,
      supervisionScore: 7.8,
      lastReportDate: '11/04/2026',
      reportStatus: 'NEED_CHANGES',
    },
    {
      id: 3,
      groupCode: 'KL2024-012',
      groupName: 'Nhóm Web Dev',
      topic: 'Hệ thống quản lý bán hàng trực tuyến',
      status: 'IN_PROGRESS',
      members: [
        { name: 'Ngô Văn F', studentCode: 'SV020', role: 'Individual' },
      ],
      currentWeek: 9,
      totalWeeks: 15,
      supervisionScore: 9.0,
      lastReportDate: '13/04/2026',
      reportStatus: 'APPROVED',
    },
  ];

  // Fetch active thesis rounds on component mount
  useEffect(() => {
    const fetchThesisRounds = async () => {
      try {
        setRoundsLoading(true);
        const data = await thesisRoundsService.getThesisRoundsForInstructor();
        
        // Handle different response formats
        let roundsArray: ThesisRound[] = [];
        if (Array.isArray(data)) {
          roundsArray = data;
        } else if (data && typeof data === 'object') {
          const dataObj = data as any;
          if (dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          } else if (dataObj.success && dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          }
        }
        
        setThesisRounds(roundsArray);
        // Auto-select the first round if available
        if (roundsArray.length > 0) {
          setSelectedThesisRoundId(roundsArray[0].id);
        }
      } catch (error) {
        console.error('Error fetching thesis rounds:', error);
      } finally {
        setRoundsLoading(false);
      }
    };

    fetchThesisRounds();
  }, []);

  const getReportStatusText = (status: string) => {
    const map: Record<string, string> = {
      'APPROVED': 'Đã duyệt',
      'NEED_CHANGES': 'Cần sửa',
      'PENDING': 'Chờ duyệt',
    };
    return map[status] || status;
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'TS. Nguyễn Văn A'}
      title="Sinh viên hướng dẫn"
      subtitle="Quản lý sinh viên đang hướng dẫn"
    >
      {/* Thesis Round Filter */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Đợt khóa luận:</label>
        {roundsLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải đợt khóa luận...</p>
        ) : thesisRounds.length > 0 ? (
          <select
            className="w-full max-w-xs px-3 py-2 border border-border rounded-md bg-background"
            value={selectedThesisRoundId || ''}
            onChange={(e) => setSelectedThesisRoundId(e.target.value ? Number(e.target.value) : undefined)}
          >
            {thesisRounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.round_name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-muted-foreground">Không có đợt khóa luận nào</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary mb-1">8/12</div>
            <p className="text-sm text-muted-foreground">Hạn mức hướng dẫn</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">3</div>
            <p className="text-sm text-muted-foreground">Nhóm đang HD</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-amber-600 mb-1">2</div>
            <p className="text-sm text-muted-foreground">Báo cáo chờ duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">8.4</div>
            <p className="text-sm text-muted-foreground">Điểm TB</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm nhóm hoặc sinh viên..." className="pl-10" />
            </div>
            <Select
              options={[
                { value: 'all', label: 'Tất cả đợt khóa luận' },
                { value: 'KL2024-HK1', label: 'KL2024-HK1' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'IN_PROGRESS', label: 'Đang thực hiện' },
                { value: 'COMPLETED', label: 'Hoàn thành' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-6">
        {students.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{student.groupName}</CardTitle>
                    <Badge variant={getStatusBadgeVariant(student.status)}>
                      Đang thực hiện
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Mã nhóm: {student.groupCode}</p>
                  <p className="text-sm font-medium">{student.topic}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Members */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Thành viên ({student.members.length})</h4>
                  <div className="space-y-2">
                    {student.members.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Avatar name={member.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.studentCode}</p>
                        </div>
                        {member.role === 'Leader' && (
                          <Badge variant="blue" className="text-xs">Trưởng nhóm</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Tiến độ</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Tuần học</span>
                        <span className="font-medium">{student.currentWeek}/{student.totalWeeks}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(student.currentWeek / student.totalWeeks) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Báo cáo tuần gần nhất</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{student.lastReportDate}</span>
                        <Badge variant={getStatusBadgeVariant(student.reportStatus)}>
                          {getReportStatusText(student.reportStatus)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Điểm đánh giá</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Điểm hướng dẫn</span>
                      <span className="text-xl font-bold text-green-600">{student.supervisionScore}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/students/${student.id}/reports`)}
                    >
                      <FileText className="w-4 h-4" />
                      Xem báo cáo tuần
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
