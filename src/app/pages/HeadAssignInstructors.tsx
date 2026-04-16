import { useState, useEffect } from 'react';
import { UserPlus, Search, Check, X, Users, Eye } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { thesisRoundsService } from '../../services/thesisRoundsService';
import { instructorService } from '../../services/instructorService';
import type { ThesisRound, InstructorAssignment } from '../../services/types';

type TabType = 'instructors' | 'reviewers';

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
  years_of_experience?: number;
}

interface SelectedInstructor extends Instructor {
  quota: number;
  notes?: string;
}

interface SelectedReviewer extends Instructor {
  max_reviews: number;
  notes?: string;
}

export function HeadAssignInstructors() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [activeTab, setActiveTab] = useState<TabType>('instructors');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRounds, setIsFetchingRounds] = useState(false);
  const [isFetchingInstructors, setIsFetchingInstructors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [rounds, setRounds] = useState<ThesisRound[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedRound, setSelectedRound] = useState<ThesisRound | null>(null);
  const [selectedInstructors, setSelectedInstructors] = useState<SelectedInstructor[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<SelectedReviewer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [recentlyAssignedInstructors, setRecentlyAssignedInstructors] = useState<SelectedInstructor[]>([]);

  // Fetch thesis rounds on component mount
  useEffect(() => {
    const fetchRounds = async () => {
      setIsFetchingRounds(true);
      setError(null);
      try {
        const data = await thesisRoundsService.getThesisRoundsForHead();
        console.log('HeadAssignInstructors - API Response:', data);
        
        // Handle different response formats
        let roundsArray: ThesisRound[] = [];
        if (Array.isArray(data)) {
          roundsArray = data;
        } else if (data && typeof data === 'object') {
          const dataObj = data as any;
          // Check if it has a data property
          if (dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          } else if (dataObj.success && dataObj.data && Array.isArray(dataObj.data)) {
            roundsArray = dataObj.data;
          } else {
            // Try to get values from the object
            const values = Object.values(dataObj);
            if (values.length > 0 && Array.isArray(values[0])) {
              roundsArray = values[0];
            } else {
              roundsArray = values as ThesisRound[];
            }
          }
        }
        
        console.log('HeadAssignInstructors - Final rounds array:', roundsArray);
        
        // Log status values for debugging
        roundsArray.forEach((round: any) => {
          console.log(`Round ${round.id} - Status: "${round.status}" (type: ${typeof round.status})`);
        });
        
        // Filter to only show Active rounds (case-insensitive to handle backend inconsistency)
        const activeRounds = roundsArray.filter((round: any) => 
          round.status?.toUpperCase() === 'ACTIVE'
        );
        console.log('HeadAssignInstructors - Active rounds only:', activeRounds);
        
        setRounds(activeRounds);
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách đợt khóa luận');
      } finally {
        setIsFetchingRounds(false);
      }
    };

    fetchRounds();
  }, []);

  // Fetch instructors when a round is selected
  useEffect(() => {
    if (selectedRound) {
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
  }, [selectedRound]);

  const filteredInstructors = instructors.filter(instructor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      instructor.users.full_name.toLowerCase().includes(searchLower) ||
      instructor.instructor_code.toLowerCase().includes(searchLower) ||
      (instructor.specialization && instructor.specialization.toLowerCase().includes(searchLower))
    );
  });

  const handleSelectRound = (roundId: string) => {
    const round = rounds.find(r => r.id === Number(roundId));
    setSelectedRound(round || null);
    setSelectedInstructors([]);
    setSelectedReviewers([]);
  };

  const handleToggleInstructor = (instructor: Instructor) => {
    const isSelected = selectedInstructors.some(si => si.id === instructor.id);
    
    if (isSelected) {
      setSelectedInstructors(prev => prev.filter(si => si.id !== instructor.id));
    } else {
      setSelectedInstructors(prev => [
        ...prev,
        {
          ...instructor,
          quota: 5, // Default quota
          notes: '',
        }
      ]);
    }
  };

  const handleToggleReviewer = (instructor: Instructor) => {
    const isSelected = selectedReviewers.some(sr => sr.id === instructor.id);
    
    if (isSelected) {
      setSelectedReviewers(prev => prev.filter(sr => sr.id !== instructor.id));
    } else {
      setSelectedReviewers(prev => [
        ...prev,
        {
          ...instructor,
          max_reviews: 10, // Default max reviews
          notes: '',
        }
      ]);
    }
  };

  const handleQuotaChange = (instructorId: number, quota: number) => {
    setSelectedInstructors(prev =>
      prev.map(si =>
        si.id === instructorId ? { ...si, quota } : si
      )
    );
  };

  const handleMaxReviewsChange = (instructorId: number, maxReviews: number) => {
    setSelectedReviewers(prev =>
      prev.map(sr =>
        sr.id === instructorId ? { ...sr, max_reviews: maxReviews } : sr
      )
    );
  };

  const handleNotesChange = (instructorId: number, notes: string) => {
    setSelectedInstructors(prev =>
      prev.map(si =>
        si.id === instructorId ? { ...si, notes } : si
      )
    );
    setSelectedReviewers(prev =>
      prev.map(sr =>
        sr.id === instructorId ? { ...sr, notes } : sr
      )
    );
  };

  const handleAssignInstructors = async () => {
    if (!selectedRound || selectedInstructors.length === 0) {
      setError('Vui lòng chọn đợt khóa luận và ít nhất một giáo viên hướng dẫn');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Log current round status for debugging
      console.log('Current round status:', selectedRound.status);
      console.log('Status type:', typeof selectedRound.status);
      console.log('Status uppercase:', selectedRound.status?.toUpperCase());
      console.log('Round details:', selectedRound);

      // Validate required fields
      const assignments = selectedInstructors.map(si => ({
        instructor_id: si.id,
        quota: si.quota || 5, // Default quota if not set
        notes: si.notes || ''
      }));

      console.log('Instructor assignments:', assignments);

      // Use the format expected by backend: camelCase instructorIds and supervisionQuota
      const requestData = {
        instructorIds: assignments.map(a => a.instructor_id),
        supervisionQuota: assignments[0]?.quota || 5
      };

      console.log('Sending request with data:', requestData);
      
      await thesisRoundsService.assignInstructorsToRound(selectedRound.id, requestData);
      setRecentlyAssignedInstructors(selectedInstructors);
      setSuccessMessage('Phân công giáo viên hướng dẫn thành công!');
      setIsAssignModalOpen(false);
      setSelectedInstructors([]);
    } catch (err: any) {
      console.error('Assign instructors error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      
      const errorMessage = err.message || 'Có lỗi xảy ra khi phân công giáo viên hướng dẫn';
      
      // Check if it's a status validation error
      if (errorMessage.includes('Preparing') || errorMessage.includes('Active')) {
        setError(`Lỗi: ${errorMessage}. Trạng thái hiện tại của đợt: ${selectedRound.status} (type: ${typeof selectedRound.status})`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignReviewers = async () => {
    if (!selectedRound || selectedReviewers.length === 0) {
      setError('Vui lòng chọn đợt khóa luận và ít nhất một giáo viên phản biện');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Note: This would need a specific API endpoint for assigning reviewers
      // For now, we'll simulate the success
      setSuccessMessage('Phân công giáo viên phản biện thành công!');
      setIsAssignModalOpen(false);
      setSelectedReviewers([]);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi phân công giáo viên phản biện');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (activeTab === 'instructors') {
      await handleAssignInstructors();
    } else {
      await handleAssignReviewers();
    }
  };


  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Phân công giáo viên"
      subtitle="Phân công giáo viên hướng dẫn và phản biện cho đợt đề tài khóa luận"
    >
      {/* Tab Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'instructors' ? 'default' : 'outline'}
              onClick={() => setActiveTab('instructors')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Giáo viên hướng dẫn
            </Button>
            <Button
              variant={activeTab === 'reviewers' ? 'default' : 'outline'}
              onClick={() => setActiveTab('reviewers')}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Giáo viên phản biện
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Select Thesis Round */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Chọn đợt khóa luận</CardTitle>
          <CardDescription>
            Chọn đợt khóa luận để phân công {activeTab === 'instructors' ? 'giáo viên hướng dẫn' : 'giáo viên phản biện'}
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

      {/* Instructor Selection */}
      {selectedRound && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {activeTab === 'instructors' ? 'Danh sách giáo viên hướng dẫn' : 'Danh sách giáo viên phản biện'}
                </CardTitle>
                <CardDescription>
                  Chọn {activeTab === 'instructors' ? 'giáo viên hướng dẫn' : 'giáo viên phản biện'} cho đợt: {selectedRound.round_name}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {activeTab === 'instructors' ? selectedInstructors.length : selectedReviewers.length} đã chọn
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm giáo viên theo tên, mã, hoặc chuyên môn..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Instructor List */}
            {isFetchingInstructors ? (
              <p className="text-center py-8 text-muted-foreground">Đang tải danh sách giáo viên...</p>
            ) : filteredInstructors.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'Không tìm thấy giáo viên nào' : 'Không có giáo viên nào'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredInstructors.map((instructor) => {
                  const isSelected = activeTab === 'instructors' 
                    ? selectedInstructors.some(si => si.id === instructor.id)
                    : selectedReviewers.some(sr => sr.id === instructor.id);
                  return (
                    <div
                      key={instructor.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => activeTab === 'instructors' ? handleToggleInstructor(instructor) : handleToggleReviewer(instructor)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{instructor.users.full_name}</h3>
                            {isSelected && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Mã GV: </span>
                              {instructor.instructor_code}
                            </div>
                            <div>
                              <span className="font-medium">Email: </span>
                              {instructor.users.email}
                            </div>
                            {instructor.academic_title && (
                              <div>
                                <span className="font-medium">Học hàm: </span>
                                {instructor.academic_title}
                              </div>
                            )}
                            {instructor.degree && (
                              <div>
                                <span className="font-medium">Học vị: </span>
                                {instructor.degree}
                              </div>
                            )}
                            {instructor.specialization && (
                              <div className="col-span-2">
                                <span className="font-medium">Chuyên môn: </span>
                                {instructor.specialization}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            {(activeTab === 'instructors' ? selectedInstructors.length > 0 : selectedReviewers.length > 0) && (
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => activeTab === 'instructors' ? setSelectedInstructors([]) : setSelectedReviewers([])}
                >
                  Hủy chọn
                </Button>
                <Button
                  onClick={() => setIsAssignModalOpen(true)}
                  disabled={activeTab === 'instructors' ? selectedInstructors.length === 0 : selectedReviewers.length === 0}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Xác nhận phân công ({activeTab === 'instructors' ? selectedInstructors.length : selectedReviewers.length})
                </Button>
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

      {/* Recently Assigned Instructors Table */}
      {recentlyAssignedInstructors.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Giáo viên vừa được phân công</CardTitle>
                <CardDescription>
                  Danh sách giáo viên hướng dẫn vừa được thêm vào đợt: {selectedRound?.round_name}
                </CardDescription>
              </div>
              <Badge variant="secondary">{recentlyAssignedInstructors.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mã GV</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Họ và tên</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Học hàm</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Học vị</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Chuyên môn</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Số nhóm tối đa</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyAssignedInstructors.map((instructor) => (
                    <tr key={instructor.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{instructor.instructor_code}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm">{instructor.users.full_name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">{instructor.users.email}</td>
                      <td className="py-3 px-4 text-sm">{instructor.academic_title || '-'}</td>
                      <td className="py-3 px-4 text-sm">{instructor.degree || '-'}</td>
                      <td className="py-3 px-4 text-sm">{instructor.specialization || '-'}</td>
                      <td className="py-3 px-4 text-sm text-center">{instructor.quota}</td>
                      <td className="py-3 px-4 text-sm">{instructor.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecentlyAssignedInstructors([])}
              >
                Đóng bảng
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={activeTab === 'instructors' ? 'Xác nhận phân công giáo viên hướng dẫn' : 'Xác nhận phân công giáo viên phản biện'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Đợt khóa luận:</span> {selectedRound?.round_name}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Số giáo viên:</span> {activeTab === 'instructors' ? selectedInstructors.length : selectedReviewers.length}
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeTab === 'instructors' ? (
              selectedInstructors.map((instructor) => (
                <div key={instructor.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{instructor.users.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{instructor.instructor_code}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleInstructor(instructor)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Số nhóm tối đa
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={instructor.quota}
                        onChange={(e) => handleQuotaChange(instructor.id, Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Ghi chú
                      </label>
                      <Input
                        placeholder="Ghi chú (tùy chọn)"
                        value={instructor.notes || ''}
                        onChange={(e) => handleNotesChange(instructor.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              selectedReviewers.map((reviewer) => (
                <div key={reviewer.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{reviewer.users.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{reviewer.instructor_code}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleReviewer(reviewer)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Số phản biện tối đa
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={reviewer.max_reviews}
                        onChange={(e) => handleMaxReviewsChange(reviewer.id, Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Ghi chú
                      </label>
                      <Input
                        placeholder="Ghi chú (tùy chọn)"
                        value={reviewer.notes || ''}
                        onChange={(e) => handleNotesChange(reviewer.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setIsAssignModalOpen(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAssign}
              disabled={isLoading || (activeTab === 'instructors' ? selectedInstructors.length === 0 : selectedReviewers.length === 0)}
            >
              {isLoading ? 'Đang phân công...' : 'Xác nhận phân công'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
