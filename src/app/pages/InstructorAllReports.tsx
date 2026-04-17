import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, Calendar, User, Search, Filter } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { reportService, instructorService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';

export function InstructorAllReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || 'instructor';

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [supervisedStudents, setSupervisedStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get supervised students to filter reports
        const instructorId = user?.instructorId || user?.id || 0;
        let thesisIds: number[] = [];
        
        if (instructorId) {
          try {
            const students = await instructorService.getSupervisedStudents(instructorId);
            setSupervisedStudents(students);
            thesisIds = students.map((s: any) => s.thesis.id);
          } catch (error) {
            console.error('Error fetching supervised students:', error);
          }
        }

        // Get all weekly reports
        const allReports = await reportService.getWeeklyReports();
        
        // Filter reports by instructor's supervised students' thesis IDs
        const filteredByInstructor = thesisIds.length > 0
          ? allReports.filter((report: any) => thesisIds.includes(report.thesis_id))
          : allReports;
        
        setReports(filteredByInstructor || []);
        setFilteredReports(filteredByInstructor || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((report) =>
        report.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((report) => 
        report.instructor_status === statusFilter
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'APPROVED': 'Đã duyệt',
      'NEED_CHANGES': 'Cần sửa',
      'PENDING': 'Chờ đánh giá',
      'REJECTED': 'Bị từ chối',
    };
    return map[status] || status;
  };

  const handleViewReport = (report: any) => {
    navigate(`/students/${report.thesis_id}/reports`);
  };

  if (loading) {
    return (
      <PageLayout
        userRole={userRole as any}
        userName={user?.fullName || 'TS. Nguyễn Văn A'}
        title="Báo cáo đồ án"
        subtitle="Xem tất cả báo cáo của sinh viên"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </PageLayout>
    );
  }

  // Get unique students for filter
  const uniqueStudents = Array.from(new Set(reports.map((r) => r.student_name || 'Unknown')));

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'TS. Nguyễn Văn A'}
      title="Báo cáo đồ án"
      subtitle="Xem tất cả báo cáo của sinh viên"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary mb-1">{reports.length}</div>
            <p className="text-sm text-muted-foreground">Tổng báo cáo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-amber-600 mb-1">
              {reports.filter((r) => r.instructor_status === 'PENDING').length}
            </div>
            <p className="text-sm text-muted-foreground">Chờ đánh giá</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {reports.filter((r) => r.instructor_status === 'APPROVED').length}
            </div>
            <p className="text-sm text-muted-foreground">Đã duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {reports.filter((r) => r.instructor_status === 'NEED_CHANGES').length}
            </div>
            <p className="text-sm text-muted-foreground">Cần sửa</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm sinh viên hoặc đề tài..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 bg-background border border-input rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ đánh giá</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="NEED_CHANGES">Cần sửa</option>
              <option value="REJECTED">Bị từ chối</option>
            </select>
            <select
              className="px-3 py-2 bg-background border border-input rounded-lg"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            >
              <option value="all">Tất cả sinh viên</option>
              {uniqueStudents.map((student, idx) => (
                <option key={idx} value={student}>{student}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy báo cáo nào</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc tìm kiếm</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">Báo cáo tuần {report.week_number}</h4>
                      <Badge variant={getStatusBadgeVariant(report.instructor_status)}>
                        {getStatusText(report.instructor_status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{report.student_name || 'Sinh viên'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(report.report_date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.work_completed || 'Không có nội dung'}
                    </p>
                    {report.weekly_score && (
                      <p className="text-sm font-semibold mt-2 text-green-600">
                        Điểm: {report.weekly_score}/10
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleViewReport(report)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
