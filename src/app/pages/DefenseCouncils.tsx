import { useEffect, useState } from 'react';
import { Shield, Calendar, Users, Plus, Search, Filter } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';

export function DefenseCouncils() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [loading, setLoading] = useState(true);
  const [councils, setCouncils] = useState<any[]>([]);

  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        setLoading(true);
        // TODO: Fetch from actual API
        setCouncils([]);
      } catch (error) {
        console.error('Error fetching councils:', error);
        setCouncils([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCouncils();
  }, []);

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Hội đồng bảo vệ"
      subtitle="Quản lý các hội đồng bảo vệ khóa luận"
      actions={
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Tạo hội đồng mới
        </Button>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm hội đồng..." className="pl-10" />
            </div>
            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'Preparing', label: 'Chuẩn bị' },
                { value: 'Ongoing', label: 'Đang diễn ra' },
                { value: 'Completed', label: 'Hoàn thành' },
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

      {/* Councils Grid */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : councils.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Chưa có hội đồng nào</p>
            <Button>Tạo hội đồng đầu tiên</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {councils.map((council) => (
            <Card key={council.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg">{council.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{council.code}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(council.status)}>
                    {council.status === 'Preparing' && 'Chuẩn bị'}
                    {council.status === 'Ongoing' && 'Đang diễn ra'}
                    {council.status === 'Completed' && 'Hoàn thành'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{council.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>{council.theses} luận văn</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{council.members} thành viên</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
