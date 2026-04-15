import { useEffect, useState } from 'react';
import { FileText, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { topicRegistrationService, defenseService, thesisRoundsService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get topic registrations pending head approval
        const registrations = await topicRegistrationService.getTopicRegistrations();
        const pendingHeadApprovals = registrations.filter((r: any) => r.instructor_status === 'APPROVED' && r.head_status === 'PENDING');
        setPendingTopics(pendingHeadApprovals.map((reg: any) => ({
          id: reg.id,
          code: reg.thesis_rounds?.round_name || 'N/A',
          title: reg.proposed_topics?.topic_title || reg.self_proposed_title,
          supervisor: reg.proposed_topics?.instructors?.users?.full_name || '',
          student: reg.thesis_groups?.group_name || 'Unknown',
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
                        <Button size="sm" variant="ghost">Xem</Button>
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
    </PageLayout>
  );
}
