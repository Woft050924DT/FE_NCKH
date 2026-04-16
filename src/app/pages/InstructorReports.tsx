import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, FileText, Calendar, CheckCircle2, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { reportService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';

export function InstructorReports() {
  const { thesisId } = useParams<{ thesisId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || 'instructor';
  
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    instructorFeedback: '',
    weeklyScore: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (!thesisId) return;

      try {
        setLoading(true);
        const response = await reportService.getThesisWeeklyReports(parseInt(thesisId));
        setReports(response.data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [thesisId]);

  const handleProvideFeedback = async () => {
    if (!selectedReport) return;

    try {
      setIsSubmitting(true);
      
      await reportService.provideWeeklyReportFeedback(selectedReport.id, {
        instructorStatus: 'APPROVED',
        instructorFeedback: feedbackForm.instructorFeedback,
        weeklyScore: parseFloat(feedbackForm.weeklyScore),
      });

      // Refresh reports
      const response = await reportService.getThesisWeeklyReports(parseInt(thesisId!));
      setReports(response.data || []);

      // Reset form and close dialog
      setFeedbackForm({ instructorFeedback: '', weeklyScore: '' });
      setSelectedReport(null);
      setIsFeedbackDialogOpen(false);
    } catch (error) {
      console.error('Error providing feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFeedbackDialog = (report: any) => {
    setSelectedReport(report);
    setFeedbackForm({
      instructorFeedback: report.instructor_feedback || '',
      weeklyScore: report.weekly_score?.toString() || '',
    });
    setIsFeedbackDialogOpen(true);
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'APPROVED': 'Đã duyệt',
      'NEED_CHANGES': 'Cần sửa',
      'PENDING': 'Chờ đánh giá',
      'REJECTED': 'Bị từ chối',
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <PageLayout
        userRole={userRole as any}
        userName={user?.fullName || 'TS. Nguyễn Văn A'}
        title="Báo cáo đồ án"
        subtitle="Xem và đánh giá báo cáo tiến độ sinh viên"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'TS. Nguyễn Văn A'}
      title="Báo cáo đồ án"
      subtitle="Xem và đánh giá báo cáo tiến độ sinh viên"
    >
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/students')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách sinh viên
        </Button>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có báo cáo nào</h3>
            <p className="text-muted-foreground">Sinh viên chưa nộp báo cáo tuần nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Báo cáo tuần {report.week_number}</CardTitle>
                    <CardDescription>
                      Nộp ngày: {new Date(report.report_date).toLocaleDateString('vi-VN')}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(report.instructor_status)}>
                    {getStatusText(report.instructor_status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Công việc đã hoàn thành
                    </h4>
                    <p className="text-sm text-muted-foreground">{report.work_completed}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="w-4 h-4" />
                        Kết quả đạt được
                      </h4>
                      <p className="text-sm text-green-700">{report.results_achieved}</p>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-4 h-4" />
                        Khó khăn gặp phải
                      </h4>
                      <p className="text-sm text-amber-700">{report.difficulties_encountered}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-800">
                      <Calendar className="w-4 h-4" />
                      Kế hoạch tuần sau
                    </h4>
                    <p className="text-sm text-blue-700">{report.next_week_plan}</p>
                  </div>

                  {report.weekly_report_individual_contributions && report.weekly_report_individual_contributions.length > 0 && (
                    <div className="p-4 bg-muted rounded-lg border">
                      <h4 className="font-medium mb-3">Đóng góp cá nhân</h4>
                      <div className="space-y-3">
                        {report.weekly_report_individual_contributions.map((contribution: any, idx: number) => (
                          <div key={idx} className="p-3 bg-background rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">{contribution.students?.users?.full_name || 'Sinh viên'}</p>
                              <Badge variant="secondary" className="text-xs">{contribution.hours_spent} giờ</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{contribution.individual_work}</p>
                            {contribution.self_evaluation && (
                              <p className="text-sm mt-2 italic text-muted-foreground">
                                Tự đánh giá: {contribution.self_evaluation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.instructor_feedback && (
                    <div className="p-4 bg-muted rounded-lg border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Nhận xét đã đưa
                      </h4>
                      <p className="text-sm text-muted-foreground">{report.instructor_feedback}</p>
                      {report.weekly_score && (
                        <p className="text-sm font-semibold mt-2">Điểm: {report.weekly_score}/10</p>
                      )}
                      {report.feedback_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Đánh giá ngày: {new Date(report.feedback_date).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {report.instructor_status === 'PENDING' && (
                      <Button onClick={() => openFeedbackDialog(report)}>
                        <Send className="w-4 h-4 mr-2" />
                        Đánh giá báo cáo
                      </Button>
                    )}
                    {report.instructor_status === 'NEED_CHANGES' && (
                      <Button onClick={() => openFeedbackDialog(report)} variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Cập nhật nhận xét
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Đánh giá báo cáo tuần {selectedReport?.week_number}</DialogTitle>
            <DialogDescription>
              Cung cấp nhận xét và điểm số cho báo cáo này
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="weeklyScore" className="text-right pt-2">
                Điểm số (0-10)
              </Label>
              <input
                id="weeklyScore"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={feedbackForm.weeklyScore}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, weeklyScore: e.target.value })}
                className="col-span-3 px-3 py-2 bg-background border border-input rounded-lg"
                placeholder="8.5"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="instructorFeedback" className="text-right pt-2">
                Nhận xét
              </Label>
              <Textarea
                id="instructorFeedback"
                value={feedbackForm.instructorFeedback}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, instructorFeedback: e.target.value })}
                className="col-span-3"
                placeholder="Nhập nhận xét của bạn..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsFeedbackDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleProvideFeedback} disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
