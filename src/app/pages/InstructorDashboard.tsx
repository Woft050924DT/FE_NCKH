import { useEffect, useState } from 'react';
import { Users, FileCheck, Clock, TrendingUp } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { topicRegistrationService, reportService } from '../../services';

export function InstructorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    supervising: 0,
    quota: 12,
    pendingReviews: 0,
    pendingApprovals: 0,
  });
  const [pendingTopics, setPendingTopics] = useState<any[]>([]);
  const [pendingReports, setPendingReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get pending topic registrations
        const registrations = await topicRegistrationService.getPendingRegistrations();
        setPendingTopics(registrations.map((reg: any) => ({
          id: reg.id,
          student: reg.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || 'Unknown',
          topic: reg.proposed_topics?.topic_title || reg.self_proposed_title,
          submittedDate: new Date(reg.registration_date).toLocaleDateString('vi-VN'),
        })));
        setStats(prev => ({ ...prev, pendingApprovals: registrations.length }));

        // Get pending weekly reports (need to filter by instructor's students)
        const reports = await reportService.getWeeklyReports();
        const pendingReports = reports.filter((r: any) => r.review_status === 'PENDING');
        setPendingReports(pendingReports.map((report: any) => ({
          id: report.id,
          student: 'Student Name', // Would need to get from thesis/group
          week: report.week_number,
          submittedDate: new Date(report.submission_date).toLocaleDateString('vi-VN'),
        })));
        setStats(prev => ({ ...prev, pendingReviews: pendingReports.length }));

        // Set supervising count (would need to get from instructor assignments)
        // setStats(prev => ({ ...prev, supervising: 0 }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLayout
      userRole="instructor"
      userName="TS. Nguyễn Văn A"
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
            <h3 className="text-3xl font-bold mb-1">-</h3>
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
                  <Button size="sm">Xem & Duyệt</Button>
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
                  <Button size="sm" variant="ghost">Xem</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
