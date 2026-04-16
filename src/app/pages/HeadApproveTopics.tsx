import { useEffect, useState } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Search, Filter, X } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Avatar } from '../components/ui/Avatar';
import { topicRegistrationService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';

export function HeadApproveTopics() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const data = await topicRegistrationService.getTopicRegistrations();
        // Filter registrations that need head approval (instructor approved, head pending)
        const pendingHeadApprovals = data.filter((r: any) => 
          r.instructor_status === 'APPROVED' && r.head_status === 'PENDING'
        );
        setRegistrations(pendingHeadApprovals);
      } catch (error) {
        console.error('Error fetching registrations:', error);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleApprove = async (id: number, approved: boolean) => {
    if (approved) {
      // Direct approve
      try {
        setIsSubmitting(true);
        await topicRegistrationService.headApproveRegistration(id, {
          status: 'APPROVED',
          rejection_reason: '',
        });
        // Refresh list
        const data = await topicRegistrationService.getTopicRegistrations();
        const pendingHeadApprovals = data.filter((r: any) =>
          r.instructor_status === 'APPROVED' && r.head_status === 'PENDING'
        );
        setRegistrations(pendingHeadApprovals);
        alert('Đã duyệt đề tài thành công');
      } catch (error) {
        console.error('Error approving registration:', error);
        alert('Có lỗi xảy ra khi duyệt đề tài');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Open reject modal
      setSelectedRegistration(registrations.find((r: any) => r.id === id));
      setRejectionReason('');
      setIsRejectModalOpen(true);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedRegistration || !rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setIsSubmitting(true);
      await topicRegistrationService.headApproveRegistration(selectedRegistration.id, {
        status: 'REJECTED',
        rejection_reason: rejectionReason,
      });
      // Refresh list
      const data = await topicRegistrationService.getTopicRegistrations();
      const pendingHeadApprovals = data.filter((r: any) =>
        r.instructor_status === 'APPROVED' && r.head_status === 'PENDING'
      );
      setRegistrations(pendingHeadApprovals);
      setIsRejectModalOpen(false);
      setRejectionReason('');
      setSelectedRegistration(null);
      alert('Đã từ chối đề tài');
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Có lỗi xảy ra khi từ chối đề tài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCancel = () => {
    setIsRejectModalOpen(false);
    setRejectionReason('');
    setSelectedRegistration(null);
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Duyệt đề tài"
      subtitle="Phê duyệt đề tài khóa luận"
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm đề tài..." className="pl-10" />
            </div>
            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'APPROVED', label: 'Đã duyệt' },
                { value: 'REJECTED', label: 'Đã từ chối' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả đợt' },
                { value: '2024-1', label: 'HK1 2024' },
                { value: '2024-2', label: 'HK2 2024' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Đề tài chờ duyệt</CardTitle>
              <CardDescription>Đề tài đã được giảng viên duyệt, cần phê duyệt cuối</CardDescription>
            </div>
            <Badge variant="blue">{registrations.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không có đề tài chờ duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div key={reg.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {reg.proposed_topics?.topic_title || reg.self_proposed_title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mã: {reg.proposed_topics?.topic_code || 'N/A'}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(reg.head_status)}>
                      {reg.head_status === 'PENDING' && 'Chờ duyệt'}
                      {reg.head_status === 'APPROVED' && 'Đã duyệt'}
                      {reg.head_status === 'REJECTED' && 'Đã từ chối'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nhóm: </span>
                      <span className="font-medium">{reg.thesis_groups?.group_name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Giảng viên HD: </span>
                      <span className="font-medium">
                        {reg.proposed_topics?.instructors?.users?.full_name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày đăng ký: </span>
                      <span className="font-medium">
                        {new Date(reg.registration_date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Đợt: </span>
                      <span className="font-medium">
                        {reg.thesis_rounds?.round_name || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {reg.head_status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(reg.id, true)}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Đang xử lý...' : 'Duyệt'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApprove(reg.id, false)}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Đang xử lý...' : 'Từ chối'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Từ chối đề tài</h2>
              <Button variant="ghost" size="sm" onClick={handleRejectCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lý do từ chối:</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={handleRejectCancel} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleRejectConfirm} disabled={isSubmitting || !rejectionReason.trim()}>
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
