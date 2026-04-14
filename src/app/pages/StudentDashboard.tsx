import { useEffect, useState } from 'react';
import { Users, FileText, ClipboardCheck, TrendingUp, Calendar, CheckCircle2, AlertCircle, Clock, Plus } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { thesisGroupsService, topicRegistrationService, reportService, gradingService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';

export function StudentDashboard() {
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState<any>(null);
  const [topicData, setTopicData] = useState<any>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<any>(null);
  const [scores, setScores] = useState<any>({ supervision: '-', review: '-', defense: '-' });
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    week_number: '',
    report_content: '',
    achievements: '',
    challenges: '',
    next_week_plan: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = async () => {
    try {
      setIsSubmitting(true);
      // Assume thesis_id from topicData or groupData
      const thesisId = topicData?.id || groupData?.id || 1;
      
      await reportService.createWeeklyReport({
        thesis_id: thesisId,
        week_number: parseInt(reportForm.week_number),
        report_content: reportForm.report_content,
        achievements: reportForm.achievements,
        challenges: reportForm.challenges,
        next_week_plan: reportForm.next_week_plan,
      });

      // Refresh weekly reports
      const reports = await reportService.getWeeklyReports(thesisId);
      if (reports && reports.length > 0) {
        const latestReport = reports[0];
        setWeeklyProgress({
          currentWeek: latestReport.week_number,
          totalWeeks: 15,
          status: latestReport.review_status,
          lastSubmitted: new Date(latestReport.submission_date).toLocaleDateString('vi-VN'),
        });
      }

      // Reset form and close dialog
      setReportForm({
        week_number: '',
        report_content: '',
        achievements: '',
        challenges: '',
        next_week_plan: '',
      });
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get thesis groups
        try {
          const groups = await thesisGroupsService.getThesisGroups(user?.id);
          if (groups && groups.length > 0) {
            const activeGroup = groups[0];
            setGroupData({
              code: activeGroup.group_name,
              name: activeGroup.group_name,
              status: activeGroup.status,
              currentMembers: activeGroup.thesis_group_members?.length || 0,
              maxMembers: activeGroup.max_members,
            });
            setMembers(activeGroup.thesis_group_members?.map((m: any) => ({
              name: m.students?.users?.full_name || 'Unknown'
            })) || []);
          }
        } catch (e) {
          console.error('Error fetching groups:', e);
        }

        // Get topic registrations
        try {
          console.log('Fetching topic registrations...');
          const registrations = await topicRegistrationService.getTopicRegistrations();
          console.log('Topic registrations fetched:', registrations);
          if (registrations && registrations.length > 0) {
            const activeRegistration = registrations[0];
            setTopicData({
              title: activeRegistration.proposed_topics?.topic_title || activeRegistration.self_proposed_title,
              supervisor: activeRegistration.proposed_topics?.instructors?.users?.full_name || '',
              supervisorAvatar: '',
              status: activeRegistration.instructor_status,
            });
          } else {
            console.log('No topic registrations found');
          }
        } catch (e: any) {
          console.error('Error fetching registrations:', e);
          console.error('Error message:', e.message);
          console.error('Error response:', e.response);
          console.error('Error status:', e.status);
          // Don't crash if backend is not available - show placeholder data
          setTopicData({
            title: 'Chưa đăng ký đề tài',
            supervisor: 'Chưa có',
            supervisorAvatar: '',
            status: 'PENDING',
          });
        }

        // Get weekly reports
        try {
          const reports = await reportService.getWeeklyReports();
          console.log('Weekly reports fetched:', reports);
          if (reports && reports.length > 0) {
            const latestReport = reports[0];
            setWeeklyProgress({
              currentWeek: latestReport.week_number,
              totalWeeks: 15,
              status: latestReport.review_status,
              lastSubmitted: new Date(latestReport.submission_date).toLocaleDateString('vi-VN'),
            });
          } else {
            console.log('No weekly reports found');
          }
        } catch (e) {
          console.error('Error fetching reports:', e);
        }

        // Get thesis tasks
        try {
          const thesisTasks = await reportService.getThesisTasks();
          setTasks((thesisTasks || []).map((task: any) => ({
            id: task.id,
            name: task.task_name,
            assignedTo: { name: 'User' },
            dueDate: new Date(task.due_date).toLocaleDateString('vi-VN'),
            status: task.status,
            progress: task.status === 'COMPLETED' ? 100 : task.status === 'IN_PROGRESS' ? 50 : 0,
          })));
        } catch (e) {
          console.error('Error fetching tasks:', e);
        }


      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout
        userRole={userRole as any}
        userName={user?.fullName || 'Nguyễn Văn A'}
        title="Dashboard"
        subtitle="Tổng quan tiến độ khóa luận của bạn"
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
      userName={user?.fullName || 'Nguyễn Văn A'}
      title="Dashboard"
      subtitle="Tổng quan tiến độ khóa luận của bạn"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Group Card */}
        {groupData ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <Badge variant={getStatusBadgeVariant(groupData.status)}>
                  {groupData.status === 'READY' ? 'Sẵn sàng' : groupData.status}
                </Badge>
              </div>
              <h3 className="font-semibold mb-1">{groupData.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{groupData.code}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Thành viên</span>
                <span className="font-medium">{groupData.currentMembers}/{groupData.maxMembers}</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(groupData.currentMembers / groupData.maxMembers) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Không có dữ liệu nhóm</div>
            </CardContent>
          </Card>
        )}

        {/* Topic Card */}
        {topicData ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <Badge variant={getStatusBadgeVariant(topicData.status)}>
                  Đang thực hiện
                </Badge>
              </div>
              <h3 className="font-semibold mb-3 line-clamp-2 text-sm leading-snug">
                {topicData.title}
              </h3>
              <div className="flex items-center gap-2">
                <Avatar name={topicData.supervisor} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Giảng viên HD</p>
                  <p className="text-sm font-medium truncate">{topicData.supervisor}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Không có dữ liệu đề tài</div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Progress Card */}
        {weeklyProgress ? (
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              console.log('Opening report dialog from card');
              setIsReportDialogOpen(true);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-green-600" />
                </div>
                <Badge variant="default">Đã duyệt</Badge>
              </div>
              <h3 className="font-semibold mb-1">Báo cáo tuần {weeklyProgress.currentWeek}</h3>
              <p className="text-sm text-muted-foreground mb-3">Nộp: {weeklyProgress.lastSubmitted}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tiến độ</span>
                <span className="font-medium">{weeklyProgress.currentWeek}/{weeklyProgress.totalWeeks} tuần</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${(weeklyProgress.currentWeek / weeklyProgress.totalWeeks) * 100}%` }}
                />
              </div>
              <Button 
                size="sm" 
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Opening report dialog from button');
                  setIsReportDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Gửi báo cáo mới
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              console.log('Opening report dialog from card (no data)');
              setIsReportDialogOpen(true);
            }}
          >
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground mb-4">Chưa có báo cáo</div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Opening report dialog from button (first report)');
                  setIsReportDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Gửi báo cáo đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Scores Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <Badge variant="secondary">Đang cập nhật</Badge>
            </div>
            <h3 className="font-semibold mb-4">Điểm số</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Điểm hướng dẫn</div>
                  <div className="text-xs text-muted-foreground">Giảng viên hướng dẫn</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{scores.supervision}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Điểm phản biện</div>
                  <div className="text-xs text-muted-foreground">Giảng viên phản biện</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{scores.review}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Điểm bảo vệ</div>
                  <div className="text-xs text-muted-foreground">Hội đồng bảo vệ</div>
                </div>
                <div className="text-2xl font-bold text-violet-600">{scores.defense}</div>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Điểm tổng kết</span>
                  <span className="text-xl font-bold text-primary">-</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Timeline đợt khóa luận</CardTitle>
            <CardDescription>Các mốc quan trọng trong quá trình thực hiện</CardDescription>
          </CardHeader>
          <CardContent>
            {deadlines.length > 0 ? (
              <div className="space-y-4">
                {deadlines.map((deadline, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      deadline.completed ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {deadline.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    {index < deadlines.length - 1 && (
                      <div className={`w-0.5 h-12 ${deadline.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{deadline.label}</h4>
                      {deadline.completed && (
                        <Badge variant="default" className="text-xs">Hoàn thành</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{deadline.date}</span>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">Không có timeline</div>
            )}
          </CardContent>
        </Card>

        {/* Group Members */}
        {groupData ? (
          <Card>
            <CardHeader>
              <CardTitle>Thành viên nhóm</CardTitle>
              <CardDescription>{groupData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <Avatar name={member.name} size="md" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs mt-1">Trưởng nhóm</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {groupData.currentMembers < groupData.maxMembers && (
                  <Button variant="ghost" className="w-full mt-2">
                    Mời thêm thành viên
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Không có dữ liệu nhóm</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tasks Table */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Công việc gần đây</CardTitle>
              <CardDescription>Các task đang được thực hiện</CardDescription>
            </div>
            <Button size="sm">Xem tất cả</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tên công việc</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phân công</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hạn chót</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium">{task.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Avatar name={task.assignedTo.name} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {task.dueDate}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={task.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}>
                        {task.status === 'IN_PROGRESS' ? 'Đang làm' : 'Chờ xử lý'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{task.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={(open) => {
        console.log('Dialog state changed:', open);
        setIsReportDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gửi báo cáo tuần</DialogTitle>
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
            <Button variant="ghost" onClick={() => setIsReportDialogOpen(false)}>
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
