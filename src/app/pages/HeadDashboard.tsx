import { useEffect, useState } from 'react';
import { FileText, TrendingUp, CheckCircle, XCircle, X } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { topicRegistrationService, defenseService, thesisRoundsService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { TopicRegistration } from '../../services/types';

export function HeadDashboard() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTopics: 0,
    inProgress: 0,
    completed: 0,
    passRate: 0,
  });
  const [pendingTopics, setPendingTopics] = useState<any[]>([]);
  const [upcomingCouncils, setUpcomingCouncils] = useState<any[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<TopicRegistration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get topic registrations pending head approval
        const registrations = await topicRegistrationService.getPendingRegistrationsForHead(user?.departmentId || user?.id || 0);
        setPendingTopics(registrations.map((reg: any) => ({
          id: reg.id,
          code: reg.thesis_rounds?.round_name || 'N/A',
          title: reg.proposed_topics?.topic_title || reg.self_proposed_title,
          supervisor: reg.instructors?.users?.full_name || '',
          student: reg.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || 'Unknown',
          studentCode: reg.thesis_groups?.thesis_group_members?.[0]?.students?.student_code || '',
          className: reg.thesis_groups?.thesis_group_members?.[0]?.students?.classes?.class_name || '',
          topicCode: reg.proposed_topics?.topic_code || '',
          topicDescription: reg.proposed_topics?.topic_description || reg.self_proposed_description || '',
          fullData: reg,
        })));

        // Get thesis rounds for stats
        const roundsResponse = await thesisRoundsService.getThesisRoundsForHead();
        const rounds = Array.isArray(roundsResponse) ? roundsResponse : (roundsResponse as any).data || [];
        const activeRound = rounds.find((r: any) => r.status?.toUpperCase() === 'ACTIVE');
        
        // Get defense councils
        // Note: Would need a specific API to get upcoming councils
        setUpcomingCouncils([]);

        // Stats would need to be calculated from actual data
        setStats({
          totalTopics: 0,
          inProgress: 0,
          completed: 0,
          passRate: 0,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewAndApprove = (item: any) => {
    setSelectedRegistration(item.fullData);
    setApprovalStatus('APPROVED');
    setRejectionReason('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
    setApprovalStatus('APPROVED');
    setRejectionReason('');
  };

  const handleSubmitApproval = async () => {
    if (!selectedRegistration) return;

    try {
      setIsSubmitting(true);
      await topicRegistrationService.headApproveRegistration(selectedRegistration.id, {
        status: approvalStatus,
        rejection_reason: rejectionReason,
      });

      // Refresh the list
      const registrations = await topicRegistrationService.getPendingRegistrationsForHead(user?.id || 0);
      setPendingTopics(registrations.map((reg: any) => ({
        id: reg.id,
        code: reg.thesis_rounds?.round_name || 'N/A',
        title: reg.proposed_topics?.topic_title || reg.self_proposed_title,
        supervisor: reg.instructors?.users?.full_name || '',
        student: reg.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || 'Unknown',
        studentCode: reg.thesis_groups?.thesis_group_members?.[0]?.students?.student_code || '',
        className: reg.thesis_groups?.thesis_group_members?.[0]?.students?.classes?.class_name || '',
        topicCode: reg.proposed_topics?.topic_code || '',
        topicDescription: reg.proposed_topics?.topic_description || reg.self_proposed_description || '',
        fullData: reg,
      })));

      handleCloseModal();
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Có lỗi xảy ra khi duyệt đăng ký');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Dashboard Trưởng Bộ Môn"
      subtitle="Tổng quan quản lý đợt khóa luận"
      actions={
        <Button>Tạo đợt khóa luận mới</Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalTopics}</h3>
            <p className="text-sm text-muted-foreground">Tổng đề tài</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.inProgress}</h3>
            <p className="text-sm text-muted-foreground">Đang thực hiện</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.completed}</h3>
            <p className="text-sm text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-violet-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.passRate}%</h3>
            <p className="text-sm text-muted-foreground">Tỷ lệ đậu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Đề tài chờ duyệt</CardTitle>
                <CardDescription>Đề tài cần phê duyệt cuối cùng</CardDescription>
              </div>
              <Badge variant="amber">{pendingTopics.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mã</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Đề tài</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">GVHD</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTopics.map((topic, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{topic.code}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm line-clamp-1">{topic.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{topic.student}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">{topic.supervisor}</td>
                      <td className="py-3 px-4 text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleViewAndApprove(topic)}>Xem</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hội đồng sắp diễn ra</CardTitle>
                <CardDescription>Trong 7 ngày tới</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCouncils.map((council, index) => (
                <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{council.name}</p>
                      <p className="text-sm text-muted-foreground">{council.code}</p>
                    </div>
                    <Badge variant="blue">{council.theses} luận văn</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">📅 {council.date}</p>
                  <Button size="sm" variant="ghost" className="mt-3 w-full">
                    Xem chi tiết
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Modal */}
      {isModalOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Duyệt Đăng ký Đề tài</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Thông tin sinh viên</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Họ tên:</span> {selectedRegistration.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name}</p>
                  <p><span className="font-medium">Mã SV:</span> {selectedRegistration.thesis_groups?.thesis_group_members?.[0]?.students?.student_code}</p>
                  <p><span className="font-medium">Lớp:</span> {selectedRegistration.thesis_groups?.thesis_group_members?.[0]?.students?.classes?.class_name}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Thông tin đề tài</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Mã đề tài:</span> {selectedRegistration.proposed_topics?.topic_code || 'N/A'}</p>
                  <p><span className="font-medium">Tên đề tài:</span> {selectedRegistration.proposed_topics?.topic_title || selectedRegistration.self_proposed_title}</p>
                  <p><span className="font-medium">Mô tả:</span> {selectedRegistration.proposed_topics?.topic_description || selectedRegistration.self_proposed_description || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Thông tin giảng viên hướng dẫn</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Họ tên:</span> {selectedRegistration.instructors?.users?.full_name}</p>
                  <p><span className="font-medium">Mã GV:</span> {selectedRegistration.instructors?.instructor_code}</p>
                  <p><span className="font-medium">Email:</span> {selectedRegistration.instructors?.users?.email}</p>
                  <p><span className="font-medium">Bộ môn:</span> {selectedRegistration.instructors?.departments?.department_name}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Quyết định</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="approvalStatus"
                        value="APPROVED"
                        checked={approvalStatus === 'APPROVED'}
                        onChange={(e) => setApprovalStatus(e.target.value as 'APPROVED' | 'REJECTED')}
                        className="w-4 h-4"
                      />
                      <span>Duyệt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="approvalStatus"
                        value="REJECTED"
                        checked={approvalStatus === 'REJECTED'}
                        onChange={(e) => setApprovalStatus(e.target.value as 'APPROVED' | 'REJECTED')}
                        className="w-4 h-4"
                      />
                      <span>Từ chối</span>
                    </label>
                  </div>
                  {approvalStatus === 'REJECTED' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Lý do từ chối:</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button onClick={handleSubmitApproval} disabled={isSubmitting || (approvalStatus === 'REJECTED' && !rejectionReason.trim())}>
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
