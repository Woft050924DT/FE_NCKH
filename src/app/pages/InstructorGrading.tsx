import { useEffect, useState } from 'react';
import { Search, Users, FileText, GraduationCap, CheckSquare } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { InstructorGradingForm } from '../components/InstructorGradingForm';
import { useAuth } from '../../contexts/AuthContext';
import { gradingService } from '../../services/gradingService';
import { thesisRoundsService } from '../../services/thesisRoundsService';
import type { SupervisionStudent, ReviewStudent, ThesisRound } from '../../services/types';

export function InstructorGrading() {
  const { user } = useAuth();
  const userRole = user?.role || 'instructor';
  const [loading, setLoading] = useState(true);
  const [gradingType, setGradingType] = useState<'supervision' | 'review'>('supervision');
  const [activeTab, setActiveTab] = useState<'individual' | 'group'>('individual');
  const [searchTerm, setSearchTerm] = useState('');
  
  // API data
  const [supervisionStudents, setSupervisionStudents] = useState<SupervisionStudent[]>([]);
  const [reviewStudents, setReviewStudents] = useState<ReviewStudent[]>([]);
  
  // Thesis rounds
  const [thesisRounds, setThesisRounds] = useState<ThesisRound[]>([]);
  const [selectedThesisRoundId, setSelectedThesisRoundId] = useState<number | undefined>(undefined);
  const [roundsLoading, setRoundsLoading] = useState(true);
  
  // Grading form
  const [isGradingFormOpen, setIsGradingFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Fetch active thesis rounds on component mount
  useEffect(() => {
    const fetchThesisRounds = async () => {
      try {
        setRoundsLoading(true);
        console.log('Fetching thesis rounds...');
        const data = await thesisRoundsService.getThesisRoundsForInstructor();
        console.log('API Response:', data);
        console.log('Response type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Keys:', Object.keys(data || {}));
        
        // Handle different response formats
        let roundsArray: ThesisRound[] = [];
        if (Array.isArray(data)) {
          roundsArray = data;
        } else if (data && typeof data === 'object') {
          const dataObj = data as any;
          if (dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          } else if (dataObj.success && dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          }
        }
        
        console.log('Thesis rounds fetched:', roundsArray);
        setThesisRounds(roundsArray);
        // Auto-select the first round if available
        if (roundsArray.length > 0) {
          setSelectedThesisRoundId(roundsArray[0].id);
          console.log('Selected thesis round ID:', roundsArray[0].id);
        }
      } catch (error) {
        console.error('Error fetching thesis rounds:', error);
      } finally {
        setRoundsLoading(false);
      }
    };

    fetchThesisRounds();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const instructorId = user?.instructorId || user?.id;

        if (gradingType === 'supervision') {
          console.log('Fetching supervision students with instructorId:', instructorId, 'thesisRoundId:', selectedThesisRoundId);
          const data = await gradingService.getSupervisionStudents(instructorId, selectedThesisRoundId);
          console.log('Supervision students fetched:', data);
          console.log('Number of supervision students:', data.length);
          setSupervisionStudents(data);
        } else {
          console.log('Fetching review students with instructorId:', instructorId, 'thesisRoundId:', selectedThesisRoundId);
          const data = await gradingService.getReviewStudents(instructorId, selectedThesisRoundId);
          console.log('Review students fetched:', data);
          console.log('Number of review students:', data.length);
          setReviewStudents(data);
        }
      } catch (error) {
        console.error('Error fetching grading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gradingType, selectedThesisRoundId, user]);

  const handleOpenGradingForm = (student: any) => {
    setSelectedStudent(student);
    setIsGradingFormOpen(true);
  };

  const handleCloseGradingForm = () => {
    setIsGradingFormOpen(false);
    setSelectedStudent(null);
  };

  const handleGradingSuccess = () => {
    // Refresh the list after successful grading
    const instructorId = user?.instructorId || user?.id;
    if (gradingType === 'supervision') {
      gradingService.getSupervisionStudents(instructorId, selectedThesisRoundId).then(setSupervisionStudents);
    } else {
      gradingService.getReviewStudents(instructorId, selectedThesisRoundId).then(setReviewStudents);
    }
    handleCloseGradingForm();
  };

  // Get current data based on grading type
  const currentData = gradingType === 'supervision' ? supervisionStudents : reviewStudents;

  // Filter data based on search term
  const filteredData = currentData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const memberNames = item.members.map(m => m.full_name.toLowerCase()).join(' ');
    const memberCodes = item.members.map(m => m.student_code.toLowerCase()).join(' ');
    
    return (
      item.topic_title.toLowerCase().includes(searchLower) ||
      item.thesis_code.toLowerCase().includes(searchLower) ||
      memberNames.includes(searchLower) ||
      memberCodes.includes(searchLower)
    );
  });

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'TS. Nguyễn Văn A'}
      title={gradingType === 'supervision' ? 'Chấm điểm hướng dẫn' : 'Chấm điểm phản biện'}
      subtitle={gradingType === 'supervision' ? 'Đánh giá sinh viên và nhóm bạn hướng dẫn' : 'Đánh giá sinh viên và nhóm bạn phản biện'}
    >
      {/* Grading Type Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={gradingType === 'supervision' ? 'default' : 'outline'}
          onClick={() => setGradingType('supervision')}
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          Chấm điểm hướng dẫn
        </Button>
        <Button
          variant={gradingType === 'review' ? 'default' : 'outline'}
          onClick={() => setGradingType('review')}
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Chấm điểm phản biện
        </Button>
      </div>

      {/* Thesis Round Filter */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Đợt khóa luận:</label>
        {roundsLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải đợt khóa luận...</p>
        ) : thesisRounds.length > 0 ? (
          <select
            className="w-full max-w-xs px-3 py-2 border border-border rounded-md bg-background"
            value={selectedThesisRoundId || ''}
            onChange={(e) => setSelectedThesisRoundId(e.target.value ? Number(e.target.value) : undefined)}
          >
            {thesisRounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.round_name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-muted-foreground">Không có đợt khóa luận nào</p>
        )}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã đồ án, tên đề tài, hoặc sinh viên..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Không tìm thấy kết quả nào' : 'Không có dữ liệu'}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {gradingType === 'supervision' ? 'Danh sách hướng dẫn' : 'Danh sách phản biện'}
                </CardTitle>
                <CardDescription>
                  {gradingType === 'supervision' ? 'Các đồ án bạn đang hướng dẫn' : 'Các đồ án bạn cần phản biện'}
                </CardDescription>
              </div>
              <Badge variant="secondary">{filteredData.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((item) => (
                <div
                  key={item.thesis_id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold">{item.topic_title}</p>
                      <Badge variant={item.is_graded ? 'default' : 'secondary'}>
                        {item.is_graded ? 'Đã chấm' : 'Chờ chấm'}
                      </Badge>
                      {gradingType === 'review' && 'review_deadline' in item && (
                        <Badge variant="outline">
                          Hạn: {new Date(item.review_deadline).toLocaleDateString('vi-VN')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Mã đồ án: {item.thesis_code} • Đợt ID: {item.thesis_round_id}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Thành viên: {item.members.map(m => `${m.full_name} (${m.student_code})`).join(', ')}
                    </p>
                    {gradingType === 'review' && 'supervisor' in item && (
                      <p className="text-sm text-muted-foreground">
                        GV hướng dẫn: {item.supervisor.full_name} ({item.supervisor.instructor_code})
                      </p>
                    )}
                    {item.is_graded && (
                      <p className="text-sm font-medium mt-1">
                        Điểm: {gradingType === 'supervision' ? (item as SupervisionStudent).supervision_score : (item as ReviewStudent).review_score}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleOpenGradingForm(item)}
                    disabled={item.is_graded}
                  >
                    {item.is_graded ? 'Đã chấm' : 'Chấm điểm'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grading Form Modal */}
      {selectedStudent && (
        <InstructorGradingForm
          isOpen={isGradingFormOpen}
          onClose={handleCloseGradingForm}
          onSuccess={handleGradingSuccess}
          studentData={{
            name: selectedStudent.members?.[0]?.full_name || '',
            studentId: selectedStudent.members?.[0]?.student_code || '',
            className: selectedStudent.members?.[0]?.class_name || '',
            topicName: selectedStudent.topic_title,
            thesisCode: selectedStudent.thesis_code,
            thesisId: selectedStudent.thesis_id,
            gradingType: gradingType,
            reviewAssignmentId: gradingType === 'review' ? (selectedStudent as ReviewStudent).review_assignment_id : undefined,
          }}
          instructorData={{
            name: user?.fullName,
            academicTitle: user?.academicTitle,
            degree: user?.degree,
            unit: user?.departmentName,
          }}
        />
      )}
    </PageLayout>
  );
}
