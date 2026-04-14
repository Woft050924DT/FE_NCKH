import { useEffect, useState } from 'react';
import { ClipboardList, TrendingUp, CheckCircle, Clock, Search, Filter, Download } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';

export function HeadReports() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // TODO: Fetch from actual API
        setReports([]);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Báo cáo"
      subtitle="Tổng quan báo cáo và tiến độ khóa luận"
      actions={
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="blue">+12%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1">156</div>
            <p className="text-sm text-muted-foreground">Tổng báo cáo</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="green">+8%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1">142</div>
            <p className="text-sm text-muted-foreground">Đã duyệt</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <Badge variant="amber">-5%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1">14</div>
            <p className="text-sm text-muted-foreground">Chờ duyệt</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="blue">+15%</Badge>
            </div>
            <div className="text-2xl font-bold mb-1">89%</div>
            <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm báo cáo..." className="pl-10" />
            </div>
            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chờ duyệt' },
                { value: 'approved', label: 'Đã duyệt' },
                { value: 'rejected', label: 'Đã từ chối' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả đợt' },
                { value: '2024-1', label: 'HK1 2024' },
                { value: '2024-2', label: 'HK2 2024' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'Tất cả nhóm' },
                { value: 'group1', label: 'Nhóm 1' },
                { value: 'group2', label: 'Nhóm 2' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách báo cáo</CardTitle>
              <CardDescription>Báo cáo tiến độ từ các nhóm khóa luận</CardDescription>
            </div>
            <Badge variant="blue">{reports.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không có báo cáo nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Nhóm: {report.groupName} | Tuần: {report.week}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(report.status)}>
                      {report.status === 'pending' && 'Chờ duyệt'}
                      {report.status === 'approved' && 'Đã duyệt'}
                      {report.status === 'rejected' && 'Đã từ chối'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Người gửi: </span>
                      <span className="font-medium">{report.author}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày gửi: </span>
                      <span className="font-medium">
                        {new Date(report.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Đề tài: </span>
                      <span className="font-medium">{report.topic}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Xem chi tiết
                    </Button>
                    {report.status === 'pending' && (
                      <>
                        <Button size="sm">Duyệt</Button>
                        <Button size="sm" variant="destructive">Từ chối</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
