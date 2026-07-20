import { useState } from 'react';
import { BookOpen, Users, Clock, Calendar, Search, Filter } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { Link } from 'react-router';

export function Courses() {
  const [filter, setFilter] = useState('all');

  const myCourses = [
    {
      id: 1,
      code: 'CS301',
      name: 'Lập trình Web nâng cao',
      instructor: 'TS. Nguyễn Văn A',
      semester: 'HK1 2024-2025',
      credits: 3,
      schedule: 'Thứ 2, 4 (7:00-9:30)',
      room: 'A101',
      enrolled: 45,
      maxStudents: 60,
      progress: 65,
      status: 'enrolled',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      code: 'CS302',
      name: 'Cơ sở dữ liệu nâng cao',
      instructor: 'PGS. TS. Trần Thị B',
      semester: 'HK1 2024-2025',
      credits: 3,
      schedule: 'Thứ 3, 5 (13:00-15:30)',
      room: 'B201',
      enrolled: 50,
      maxStudents: 60,
      progress: 72,
      status: 'enrolled',
      color: 'bg-green-500',
    },
  ];

  const availableCourses = [
    {
      id: 3,
      code: 'CS303',
      name: 'Machine Learning cơ bản',
      instructor: 'TS. Lê Văn C',
      semester: 'HK1 2024-2025',
      credits: 4,
      schedule: 'Thứ 2, 4, 6 (7:00-9:30)',
      room: 'C301',
      enrolled: 35,
      maxStudents: 50,
      status: 'available',
      color: 'bg-violet-500',
    },
    {
      id: 4,
      code: 'CS304',
      name: 'Phát triển ứng dụng Mobile',
      instructor: 'TS. Phạm Thị D',
      semester: 'HK1 2024-2025',
      credits: 3,
      schedule: 'Thứ 3, 5 (9:30-12:00)',
      room: 'D401',
      enrolled: 40,
      maxStudents: 50,
      status: 'available',
      color: 'bg-amber-500',
    },
  ];

  const allCourses = filter === 'enrolled' ? myCourses : filter === 'available' ? availableCourses : [...myCourses, ...availableCourses];

  return (
    <PageLayout
      userRole="student"
      userName="Nguyễn Văn A"
      title="Môn học"
      subtitle="Quản lý môn học và đăng ký môn học mới"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang học</p>
                <p className="text-2xl font-bold">{myCourses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng tín chỉ</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiến độ TB</p>
                <p className="text-2xl font-bold">69%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bài tập chờ</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === 'all' ? 'primary' : 'ghost'}
                onClick={() => setFilter('all')}
              >
                Tất cả
              </Button>
              <Button
                size="sm"
                variant={filter === 'enrolled' ? 'primary' : 'ghost'}
                onClick={() => setFilter('enrolled')}
              >
                Đang học
              </Button>
              <Button
                size="sm"
                variant={filter === 'available' ? 'primary' : 'ghost'}
                onClick={() => setFilter('available')}
              >
                Có thể đăng ký
              </Button>
            </div>
            <div className="flex-1" />
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm môn học..." className="pl-10" />
            </div>
            <Select
              options={[
                { value: 'all', label: 'Tất cả học kỳ' },
                { value: 'HK1', label: 'HK1 2024-2025' },
                { value: 'HK2', label: 'HK2 2024-2025' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-full h-2 rounded-t-lg ${course.color}`} />
              <div className="flex items-start justify-between mt-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="blue">{course.code}</Badge>
                    <Badge variant={course.status === 'enrolled' ? 'green' : 'amber'}>
                      {course.status === 'enrolled' ? 'Đang học' : 'Có thể ĐK'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={course.instructor} size="sm" />
                      <span className="text-sm">{course.instructor}</span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tín chỉ</span>
                  <span className="font-medium">{course.credits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lịch học</span>
                  <span className="font-medium text-right">{course.schedule}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phòng</span>
                  <span className="font-medium">{course.room}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sĩ số</span>
                  <span className="font-medium">{course.enrolled}/{course.maxStudents}</span>
                </div>
              </div>

              {course.status === 'enrolled' && course.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${course.color}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {course.status === 'enrolled' ? (
                  <Link to={`/courses/${course.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Vào học
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" className="flex-1">
                    Đăng ký
                  </Button>
                )}
                <Button size="sm" variant="ghost">
                  Chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
