import { useEffect, useState } from 'react';
import { Plus, FileText, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { reportService } from '../../services';

export function WeeklyReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    week_number: '',
    report_content: '',
    achievements: '',
    challenges: '',
    next_week_plan: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getWeeklyReports();
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleSubmitReport = async () => {
    try {
      setIsSubmitting(true);
      const thesisId = 1; // Should come from context or API
      
      await reportService.createWeeklyReport({
        thesis_id: thesisId,
        week_number: parseInt(reportForm.week_number),
        report_content: reportForm.report_content,
        achievements: reportForm.achievements,
        challenges: reportForm.challenges,
        next_week_plan: reportForm.next_week_plan,
      });

      // Refresh reports
      const data = await reportService.getWeeklyReports();
      setReports(data || []);

      // Reset form and close dialog
      setReportForm({
        week_number: '',
        report_content: '',
        achievements: '',
        challenges: '',
        next_week_plan: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        userRole="student"
        userName="Nguyễn Văn A"
        title="Báo cáo tuần"
        subtitle="Quản lý và theo dõi báo cáo tiến độ tuần"
        actions={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo báo cáo mới
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      userRole="student"
      userName="Nguyễn Văn A"
      title="Báo cáo tuần"
      subtitle="Quản lý và theo dõi báo cáo tiến độ tuần"
      actions={
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo báo cáo mới
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có báo cáo nào</h3>
              <p className="text-muted-foreground mb-4">Bắt đầu tạo báo cáo tuần đầu tiên của bạn</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo báo cáo đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Báo cáo tuần {report.week_number}</CardTitle>
                    <CardDescription>
                      Nộp ngày: {new Date(report.submission_date).toLocaleDateString('vi-VN')}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(report.review_status)}>
                    {report.review_status === 'APPROVED' ? 'Đã duyệt' : report.review_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Nội dung công việc
                    </h4>
                    <p className="text-sm text-muted-foreground">{report.report_content}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="w-4 h-4" />
                        Thành tựu
                      </h4>
                      <p className="text-sm text-green-700">{report.achievements}</p>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-4 h-4" />
                        Khó khăn
                      </h4>
                      <p className="text-sm text-amber-700">{report.challenges}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-800">
                      <Calendar className="w-4 h-4" />
                      Kế hoạch tuần sau
                    </h4>
                    <p className="text-sm text-blue-700">{report.next_week_plan}</p>
                  </div>

                  {report.instructor_feedback && (
                    <div className="p-4 bg-muted rounded-lg border">
                      <h4 className="font-medium mb-2">Nhận xét giảng viên</h4>
                      <p className="text-sm text-muted-foreground">{report.instructor_feedback}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo báo cáo tuần mới</DialogTitle>
            <DialogDescription>
              Cập nhật tiến độ và kết quả làm việc trong tuần
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="week_number" className="text-right">
                Tuần thứ
              </Label>
              <Input
                id="week_number"
                type="number"
                value={reportForm.week_number}
                onChange={(e) => setReportForm({ ...reportForm, week_number: e.target.value })}
                className="col-span-3"
                placeholder="1"
                min="1"
                max="15"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="report_content" className="text-right pt-2">
                Nội dung
              </Label>
              <Textarea
                id="report_content"
                value={reportForm.report_content}
                onChange={(e) => setReportForm({ ...reportForm, report_content: e.target.value })}
                className="col-span-3"
                placeholder="Mô tả công việc đã thực hiện..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="achievements" className="text-right pt-2">
                Thành tựu
              </Label>
              <Textarea
                id="achievements"
                value={reportForm.achievements}
                onChange={(e) => setReportForm({ ...reportForm, achievements: e.target.value })}
                className="col-span-3"
                placeholder="Các kết quả đã đạt được..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="challenges" className="text-right pt-2">
                Khó khăn
              </Label>
              <Textarea
                id="challenges"
                value={reportForm.challenges}
                onChange={(e) => setReportForm({ ...reportForm, challenges: e.target.value })}
                className="col-span-3"
                placeholder="Các vấn đề gặp phải..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="next_week_plan" className="text-right pt-2">
                Kế hoạch tuần sau
              </Label>
              <Textarea
                id="next_week_plan"
                value={reportForm.next_week_plan}
                onChange={(e) => setReportForm({ ...reportForm, next_week_plan: e.target.value })}
                className="col-span-3"
                placeholder="Kế hoạch cho tuần tới..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitReport} disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
