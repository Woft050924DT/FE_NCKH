import { useState, useEffect } from 'react';
import { UserPlus, Search, Check, X, Users, FileText, Calendar, AlertCircle } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { topicRegistrationService } from '../../services/topicRegistrationService';
import { thesisRoundsService } from '../../services/thesisRoundsService';
import { instructorService } from '../../services/instructorService';
import { gradingService } from '../../services/gradingService';
import type { ThesisRound, TopicRegistration, CreateReviewAssignmentRequest } from '../../services/types';

type TabType = 'individual' | 'group';

interface Instructor {
  id: number;
  instructor_code: string;
  users: {
    full_name: string;
    email: string;
  };
  degree?: string;
  academic_title?: string;
  specialization?: string;
}

interface ThesisWithReviewer extends TopicRegistration {
  selectedReviewer?: Instructor;
  reviewOrder?: number;
  reviewDeadline?: string;
}

export function HeadAssignReviewers() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [activeTab, setActiveTab] = useState<TabType>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRounds, setIsFetchingRounds] = useState(false);
  const [isFetchingRegistrations, setIsFetchingRegistrations] = useState(false);
  const [isFetchingInstructors, setIsFetchingInstructors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [rounds, setRounds] = useState<ThesisRound[]>([]);
  const [registrations, setRegistrations] = useState<ThesisWithReviewer[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedRound, setSelectedRound] = useState<ThesisRound | null>(null);
  const [selectedThesis, setSelectedThesis] = useState<ThesisWithReviewer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [recentlyAssigned, setRecentlyAssigned] = useState<ThesisWithReviewer[]>([]);

  // Fetch thesis rounds on component mount
  useEffect(() => {
    const fetchRounds = async () => {
      setIsFetchingRounds(true);
      setError(null);
      try {
        const data = await thesisRoundsService.getThesisRoundsForHead();
        
        let roundsArray: ThesisRound[] = [];
        if (Array.isArray(data)) {
          roundsArray = data;
        } else if (data && typeof data === 'object') {
          const dataObj = data as any;
          if (dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          } else if (dataObj.success && dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          } else {
            const values = Object.values(dataObj);
            if (values.length > 0 && Array.isArray(values[0])) {
              roundsArray = values[0];
            } else {
              roundsArray = values as ThesisRound[];
            }
          }
        }
        
        const activeRounds = roundsArray.filter((round: any) => 
          round.status?.toUpperCase() === 'ACTIVE'
        );
        
        setRounds(activeRounds);
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách đợt khóa luận');
      } finally {
        setIsFetchingRounds(false);
      }
    };

    fetchRounds();
  }, []);

  // Fetch registrations when a round is selected
  useEffect(() => {
    if (selectedRound) {
      const fetchRegistrations = async () => {
        setIsFetchingRegistrations(true);
        setError(null);
        try {
          const data = await topicRegistrationService.getPendingRegistrationsForHead(
            user?.id || 0
          );
          
          // Filter by round and status (APPROVED)
          const filteredData = data.filter((reg: any) => {
            const isApproved = reg.instructor_status === 'APPROVED' && reg.head_status === 'APPROVED';
            const isCorrectRound = reg.thesis_round_id === selectedRound.id;
            
            if (!isApproved || !isCorrectRound) return false;
            
            // Filter by tab (individual vs group)
            if (activeTab === 'individual') {
              return !reg.thesis_group_id || reg.thesis_groups?.group_type === 'INDIVIDUAL_ONLY';
            } else {
              return reg.thesis_group_id && reg.thesis_groups?.group_type === 'GROUP_ONLY';
            }
          });
          
          setRegistrations(filteredData);
        } catch (err: any) {
          setError(err.message || 'Không thể tải danh sách đề tài');
        } finally {
          setIsFetchingRegistrations(false);
        }
      };

      fetchRegistrations();
    }
  }, [selectedRound, activeTab, user]);

  // Fetch instructors when modal opens
  useEffect(() => {
    if (isAssignModalOpen) {
      const fetchInstructors = async () => {
        setIsFetchingInstructors(true);
        setError(null);
        try {
          const data = await instructorService.getInstructors();
          setInstructors(data);
        } catch (err: any) {
          setError(err.message || 'Không thể tải danh sách giáo viên');
        } finally {
          setIsFetchingInstructors(false);
        }
      };

      fetchInstructors();
    }
  }, [isAssignModalOpen]);

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    const title = reg.proposed_topics?.topic_title || reg.self_proposed_title || '';
    const studentName = reg.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || '';
    const studentCode = reg.thesis_groups?.thesis_group_members?.[0]?.students?.student_code || '';
    
    return (
      title.toLowerCase().includes(searchLower) ||
      studentName.toLowerCase().includes(searchLower) ||
      studentCode.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectRound = (roundId: string) => {
    const round = rounds.find(r => r.id === Number(roundId));
    setSelectedRound(round || null);
    setRegistrations([]);
    setRecentlyAssigned([]);
  };

  const handleOpenAssignModal = (thesis: ThesisWithReviewer) => {
    setSelectedThesis(thesis);
    setIsAssignModalOpen(true);
  };

  const handleAssignReviewer = async () => {
    if (!selectedThesis || !selectedThesis.selectedReviewer) {
      setError('Vui lòng chọn giáo viên phản biện');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const requestData: CreateReviewAssignmentRequest = {
        thesis_id: selectedThesis.id,
        reviewer_id: selectedThesis.selectedReviewer.id,
        review_order: selectedThesis.reviewOrder || 1,
        review_deadline: selectedThesis.reviewDeadline || '',
      };

      await gradingService.createReviewAssignment(requestData);
      
      setRecentlyAssigned(prev => [
        { ...selectedThesis, selectedReviewer: selectedThesis.selectedReviewer },
        ...prev,
      ]);
      
      setSuccessMessage('Phân công giáo viên phản biện thành công!');
      setIsAssignModalOpen(false);
      setSelectedThesis(null);
      
      // Remove from pending list
      setRegistrations(prev => prev.filter(r => r.id !== selectedThesis.id));
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi phân công giáo viên phản biện');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReviewer = (instructor: Instructor) => {
    if (selectedThesis) {
      setSelectedThesis({ ...selectedThesis, selectedReviewer: instructor });
    }
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Phân công giáo viên phản biện"
      subtitle="Phân công giáo viên phản biện cho đề tài khóa luận cá nhân và nhóm"
    >
      {/* Tab Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'individual' ? 'default' : 'outline'}
              onClick={() => setActiveTab('individual')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Đề tài cá nhân
            </Button>
            <Button
              variant={activeTab === 'group' ? 'default' : 'outline'}
              onClick={() => setActiveTab('group')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Đề tài nhóm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Select Thesis Round */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Chọn đợt khóa luận</CardTitle>
          <CardDescription>
            Chọn đợt khóa luận để phân công giáo viên phản biện cho {activeTab === 'individual' ? 'đề tài cá nhân' : 'đề tài nhóm'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetchingRounds ? (
            <p className="text-muted-foreground">Đang tải danh sách đợt khóa luận...</p>
          ) : rounds.length === 0 ? (
            <p className="text-muted-foreground">Không có đợt khóa luận nào</p>
          ) : (
            <Select value={selectedRound?.id.toString() || ''} onValueChange={handleSelectRound}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn đợt khóa luận..." />
              </SelectTrigger>
              <SelectContent>
                {rounds.map(round => (
                  <SelectItem key={round.id} value={round.id.toString()}>
                    {round.round_name} ({round.round_code || 'ĐK' + round.id}) - {round.academic_year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Thesis List */}
      {selectedRound && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {activeTab === 'individual' ? 'Danh sách đề tài cá nhân' : 'Danh sách đề tài nhóm'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'individual' ? 'Đề tài cá nhân' : 'Đề tài nhóm'} cần phân công phản biện - Đợt: {selectedRound.round_name}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {registrations.length} đề tài
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên đề tài, sinh viên, hoặc mã sinh viên..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Thesis List */}
            {isFetchingRegistrations ? (
              <p className="text-center py-8 text-muted-foreground">Đang tải danh sách đề tài...</p>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Không tìm thấy đề tài nào' : 'Không có đề tài nào cần phân công phản biện'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((thesis) => {
                  const title = thesis.proposed_topics?.topic_title || thesis.self_proposed_title || '';
                  const studentName = thesis.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || '';
                  const studentCode = thesis.thesis_groups?.thesis_group_members?.[0]?.students?.student_code || '';
                  const supervisorName = thesis.instructors?.users?.full_name || '';
                  
                  return (
                    <div
                      key={thesis.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{title}</h3>
                            {thesis.proposed_topics?.topic_code && (
                              <Badge variant="outline">{thesis.proposed_topics.topic_code}</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Sinh viên:</span>
                              <span className="font-medium">{studentName}</span>
                              {studentCode && <span className="text-muted-foreground">({studentCode})</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">GVHD:</span>
                              <span className="font-medium">{supervisorName}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleOpenAssignModal(thesis)}
                          disabled={!!thesis.selectedReviewer}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          {thesis.selectedReviewer ? 'Đã phân công' : 'Phân công phản biện'}
                        </Button>
                      </div>
                      
                      {thesis.selectedReviewer && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center gap-2 text-sm text-green-800">
                            <Check className="w-4 h-4" />
                            <span className="font-medium">Đã phân công:</span>
                            <span>{thesis.selectedReviewer.users.full_name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      {/* Recently Assigned */}
      {recentlyAssigned.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Đề tài vừa được phân công</CardTitle>
                <CardDescription>
                  Danh sách đề tài vừa được phân công giáo viên phản biện
                </CardDescription>
              </div>
              <Badge variant="secondary">{recentlyAssigned.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyAssigned.map((thesis) => {
                const title = thesis.proposed_topics?.topic_title || thesis.self_proposed_title || '';
                const studentName = thesis.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name || '';
                
                return (
                  <div key={thesis.id} className="p-4 border border-border rounded-lg bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{title}</h4>
                        <p className="text-sm text-muted-foreground">Sinh viên: {studentName}</p>
                      </div>
                      {thesis.selectedReviewer && (
                        <Badge variant="secondary">
                          {thesis.selectedReviewer.users.full_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecentlyAssigned([])}
              >
                Đóng danh sách
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assign Reviewer Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Phân công giáo viên phản biện"
        size="lg"
      >
        {selectedThesis && (
          <div className="space-y-4">
            {/* Thesis Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Đề tài:</span> {selectedThesis.proposed_topics?.topic_title || selectedThesis.self_proposed_title}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Sinh viên:</span> {selectedThesis.thesis_groups?.thesis_group_members?.[0]?.students?.users?.full_name}
              </p>
            </div>

            {/* Reviewer Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Chọn giáo viên phản biện <span className="text-destructive">*</span>
              </label>
              {isFetchingInstructors ? (
                <p className="text-muted-foreground">Đang tải danh sách giáo viên...</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {instructors.map((instructor) => {
                    const isSelected = selectedThesis.selectedReviewer?.id === instructor.id;
                    return (
                      <div
                        key={instructor.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => handleSelectReviewer(instructor)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{instructor.users.full_name}</p>
                            <p className="text-sm text-muted-foreground">{instructor.instructor_code}</p>
                            {instructor.specialization && (
                              <p className="text-xs text-muted-foreground">{instructor.specialization}</p>
                            )}
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-primary" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Review Order */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Thứ tự phản biện
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={selectedThesis.reviewOrder || 1}
                onChange={(e) => setSelectedThesis({ ...selectedThesis, reviewOrder: Number(e.target.value) })}
              />
            </div>

            {/* Review Deadline */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hạn chót phản biện
              </label>
              <Input
                type="date"
                value={selectedThesis.reviewDeadline || ''}
                onChange={(e) => setSelectedThesis({ ...selectedThesis, reviewDeadline: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setIsAssignModalOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAssignReviewer}
                disabled={isLoading || !selectedThesis.selectedReviewer}
              >
                {isLoading ? 'Đang phân công...' : 'Xác nhận phân công'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
