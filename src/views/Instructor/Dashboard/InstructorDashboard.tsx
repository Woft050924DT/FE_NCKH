import { useEffect, useState } from 'react';
import { Users, FileCheck, Clock, TrendingUp, X, Eye } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { topicRegistrationService, reportService, instructorService } from '@/plugins/api';
import { useAuth } from '@/contexts/AuthContext';
import type { TopicRegistration } from '@/types/api';

export function InstructorDashboard() {
  const { user } = useAuth();
  const userRole = user?.role || 'instructor';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    supervising: 0,
    quota: 0,
    pendingReviews: 0,
    pendingApprovals: 0,
    averageScore: 0,
  });
  const [pendingTopics, setPendingTopics] = useState<any[]>([]);
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<TopicRegistration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let instructorId = user?.instructorId || user?.id || 0;
        let totalQuota = 0;
        let totalLoad = 0;
        let avgScore = 0;

        // Try to fetch instructor assignments for quota and load
        try {
          const inst = await instructorService.getInstructorByUserId(user?.id || 0);
          if (inst) {
            instructorId = inst.id;
            if (inst.instructor_assignments && inst.instructor_assignments.length > 0) {
              const activeAssignments = inst.instructor_assignments.filter((a: any) => 
                a.thesis_rounds?.status?.toUpperCase() === 'ONGOING' || 
                a.thesis_rounds?.status?.toUpperCase() === 'IN PROGRESS' ||
                a.thesis_rounds?.status?.toUpperCase() === 'ACTIVE'
              );
              
              if (activeAssignments.length > 0) {
                activeAssignments.forEach((a: any) => {
                  totalQuota += (a.supervision_quota || 0);
                  totalLoad += (a.current_load || 0);
                });
              } else {
                // fallback to all if no active found
                inst.instructor_assignments.forEach((a: any) => {
                  totalQuota += (a.supervision_quota || 0);
                  totalLoad += (a.current_load || 0);
                });
              }
            }
          }
        } catch (error) {
          console.error('Error fetching instructor info:', error);
        }

        // Fallback to supervised students if load is 0
        let supervisedCount = 0;
        try {
          const students = await instructorService.getSupervisedStudents(instructorId);
          supervisedCount = students.length;
          
          // Calculate average score if grading is available
          let totalScore = 0;
          let scoredCount = 0;
          students.forEach((s: any) => {
             // Assuming thesis has a final_score or similar, adjust if actual field differs
             const score = s.theses?.final_score || s.final_score;
             if (score !== undefined && score !== null) {
                totalScore += Number(score);
                scoredCount++;
             }
          });
          if (scoredCount > 0) {
             avgScore = totalScore / scoredCount;
          }
        } catch (error) {
          console.error('Error fetching supervised students:', error);
        }

        const finalSupervising = totalLoad > 0 ? totalLoad : supervisedCount;
        const finalQuota = totalQuota > 0 ? totalQuota : 10; // Default fallback

        // Get pending topic registrations
        const registrations = await topicRegistrationService.getPendingRegistrations(instructorId);
        setPendingTopics(registrations.map((reg: any) => ({
          id: reg.id,
          student: reg.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || 'Unknown',
          studentCode: reg.thesis_groups?.thesis_group_members?.[0]?.students?.student_code || '',
          className: reg.thesis_groups?.thesis_group_members?.[0]?.students?.classes?.class_name || '',
          topic: reg.proposed_topics?.topic_title || reg.self_proposed_title,
          topicCode: reg.proposed_topics?.topic_code || '',
          topicDescription: reg.proposed_topics?.topic_description || reg.self_proposed_description || '',
          submittedDate: new Date(reg.registration_date).toLocaleDateString('vi-VN'),
          fullData: reg,
        })));

        // Get pending weekly reports
        const reports = await reportService.getWeeklyReports();
        const pendingReportsList = reports.filter((r: any) => r.review_status === 'PENDING');
        setPendingReports(pendingReportsList.map((report: any) => ({
          id: report.id,
          student: report.theses?.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || 'Sinh viên',
          week: report.week_number,
          submittedDate: new Date(report.submission_date).toLocaleDateString('vi-VN'),
        })));

        setStats({
          supervising: finalSupervising,
          quota: finalQuota,
          pendingReviews: pendingReportsList.length,
          pendingApprovals: registrations.length,
          averageScore: Number(avgScore.toFixed(1)),
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
      await topicRegistrationService.approveRegistration(selectedRegistration.id, {
        status: approvalStatus,
        rejection_reason: rejectionReason,
        instructor_id: user?.instructorId || user?.id || 0,
      });

      // Refresh the list
      const registrations = await topicRegistrationService.getPendingRegistrations(user?.instructorId || user?.id || 0);
      setPendingTopics(registrations.map((reg: any) => ({
        id: reg.id,
        student: reg.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || 'Unknown',
        studentCode: reg.thesis_groups?.thesis_group_members?.[0]?.students?.student_code || '',
        className: reg.thesis_groups?.thesis_group_members?.[0]?.students?.classes?.class_name || '',
        topic: reg.proposed_topics?.topic_title || reg.self_proposed_title,
        topicCode: reg.proposed_topics?.topic_code || '',
        topicDescription: reg.proposed_topics?.topic_description || reg.self_proposed_description || '',
        submittedDate: new Date(reg.registration_date).toLocaleDateString('vi-VN'),
        fullData: reg,
      })));
      setStats(prev => ({ ...prev, pendingApprovals: registrations.length }));

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
      userName={user?.fullName || 'TS. Nguyễn Văn A'}
      title="Dashboard Giảng viên"
      subtitle="Tổng quan công việc hướng dẫn và phản biện"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.supervising}/{stats.quota}</h3>
            <p className="text-sm text-muted-foreground">Hạn mức hướng dẫn</p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${(stats.supervising / stats.quota) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.pendingReviews}</h3>
            <p className="text-sm text-muted-foreground">Cần phản biện</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-violet-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.pendingApprovals}</h3>
            <p className="text-sm text-muted-foreground">Đề tài chờ duyệt</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.averageScore}</h3>
            <p className="text-sm text-muted-foreground">Điểm TB sinh viên</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Đề tài chờ duyệt</CardTitle>
                <CardDescription>Sinh viên đăng ký đề tài</CardDescription>
              </div>
              <Badge variant="amber">{pendingTopics.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTopics.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <Avatar name={item.student} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.student}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">Nộp: {item.submittedDate}</p>
                  </div>
                  <Button size="sm" onClick={() => handleViewAndApprove(item)}>Xem & Duyệt</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Báo cáo tuần chờ nhận xét</CardTitle>
                <CardDescription>Báo cáo cần review</CardDescription>
              </div>
              <Badge variant="blue">{pendingReports.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReports.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <Avatar name={item.student} size="md" />
                  <div className="flex-1">
                    <p className="font-medium">{item.student}</p>
                    <p className="text-sm text-muted-foreground">Tuần {item.week} • {item.submittedDate}</p>
                  </div>
                  <Button size="icon" variant="ghost" title="Xem chi tiết">
                    <Eye className="w-4 h-4 text-blue-500" />
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
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  {selectedRegistration.thesis_groups?.thesis_group_members?.map((member: any, index: number) => (
                    <div key={index} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p><span className="font-medium">Họ tên:</span> {member.students?.users?.full_name}</p>
                        <p><span className="font-medium">Mã SV:</span> {member.students?.student_code}</p>
                        <p><span className="font-medium">Lớp:</span> {member.students?.classes?.class_name}</p>
                        <p><span className="font-medium">Vai trò:</span> {member.role === 'LEADER' ? 'Nhóm trưởng' : 'Thành viên'}</p>
                      </div>
                    </div>
                  ))}
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
