import { useState, useEffect } from 'react';
import { Plus, UserPlus, Users, Mail, Loader2, AlertCircle } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { thesisGroupsService } from '../../services/thesisGroupsService';
import { studentService } from '../../services/studentService';
import type { ThesisGroup, GroupInvitation, StudentClass, StudentClassStudent } from '../../services/types';

export function GroupManagement() {
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myGroup, setMyGroup] = useState<ThesisGroup | null>(null);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [availableGroups, setAvailableGroups] = useState<ThesisGroup[]>([]);
  const [createGroupForm, setCreateGroupForm] = useState({
    group_name: '',
    thesis_round_id: '',
    group_type: 'GROUP' as 'GROUP' | 'INDIVIDUAL',
    min_members: 2,
    max_members: 4,
  });
  const [inviteForm, setInviteForm] = useState({
    invited_student_ids: [] as string[],
    invitation_message: '',
  });
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [user?.id]);

  // Fetch classes when invite modal opens
  useEffect(() => {
    if (isInviteMemberModalOpen) {
      fetchClasses();
    }
  }, [isInviteMemberModalOpen]);

  // Fetch students when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass();
    }
  }, [selectedClass]);

  const fetchStudentsByClass = async () => {
    if (!selectedClass) return;
    
    try {
      setSearchingStudents(true);
      const classWithStudents = await studentService.getClassById(parseInt(selectedClass));
      setSearchResults(classWithStudents.students);
    } catch (e) {
      console.error('Error fetching students by class:', e);
    } finally {
      setSearchingStudents(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const classData = await studentService.getClasses();
      setClasses(classData);
    } catch (e) {
      console.error('Error fetching classes:', e);
    }
  };

  const searchStudents = async () => {
    if (!selectedClass) return;
    
    try {
      setSearchingStudents(true);
      
      // Fetch class with students
      const classWithStudents = await studentService.getClassById(parseInt(selectedClass));
      
      // Filter students by search term (name or student code)
      const filteredStudents = classWithStudents.students.filter((student: StudentClassStudent) => {
        if (!studentSearchTerm) return true;
        const searchTerm = studentSearchTerm.toLowerCase();
        return (
          student.users.full_name.toLowerCase().includes(searchTerm) ||
          student.student_code.toLowerCase().includes(searchTerm)
        );
      });
      
      setSearchResults(filteredStudents);
    } catch (e) {
      console.error('Error searching students:', e);
    } finally {
      setSearchingStudents(false);
    }
  };

  const handleSelectStudent = (student: StudentClassStudent) => {
    const studentId = student.id.toString();
    const isSelected = inviteForm.invited_student_ids.includes(studentId);
    
    if (isSelected) {
      setInviteForm({
        ...inviteForm,
        invited_student_ids: inviteForm.invited_student_ids.filter(id => id !== studentId),
      });
    } else {
      setInviteForm({
        ...inviteForm,
        invited_student_ids: [...inviteForm.invited_student_ids, studentId],
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.studentId) {
        setError('Không tìm thấy thông tin sinh viên');
        return;
      }

      // Fetch my group
      try {
        const groups = await thesisGroupsService.getThesisGroups(user.studentId);
        if (groups && groups.length > 0) {
          setMyGroup(groups[0]);
        }
      } catch (e) {
        console.error('Error fetching my group:', e);
      }

      // Fetch invitations
      try {
        const invs = await thesisGroupsService.getInvitations(user.studentId);
        setInvitations(invs.filter((inv) => inv.status === 'PENDING'));
      } catch (e) {
        console.error('Error fetching invitations:', e);
      }

      // Fetch available groups (groups that are forming and have space)
      try {
        const allGroups = await thesisGroupsService.getThesisGroups();
        setAvailableGroups(allGroups.filter((g) => 
          g.status === 'FORMING' && 
          g.thesis_group_members && 
          g.thesis_group_members.length < g.max_members
        ));
      } catch (e) {
        console.error('Error fetching available groups:', e);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.studentId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await thesisGroupsService.createThesisGroup({
        group_name: createGroupForm.group_name,
        thesis_round_id: parseInt(createGroupForm.thesis_round_id),
        group_type: createGroupForm.group_type as any,
        min_members: createGroupForm.min_members,
        max_members: createGroupForm.max_members,
        student_id: user.studentId,
      });

      setIsCreateGroupModalOpen(false);
      setCreateGroupForm({
        group_name: '',
        thesis_round_id: '',
        group_type: 'GROUP',
        min_members: 2,
        max_members: 4,
      });
      fetchData();
    } catch (e: any) {
      console.error('Error creating group:', e);
      setError(e.response?.data?.error || 'Không thể tạo nhóm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.studentId || !myGroup || inviteForm.invited_student_ids.length === 0) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Send invitation to each selected student
      for (const studentId of inviteForm.invited_student_ids) {
        await thesisGroupsService.createGroupInvitation({
          thesis_group_id: myGroup.id,
          invited_student_id: parseInt(studentId),
          invitation_message: inviteForm.invitation_message,
          student_id: user.studentId,
        });
      }

      setIsInviteMemberModalOpen(false);
      setInviteForm({
        invited_student_ids: [],
        invitation_message: '',
      });
      setSelectedClass('');
      setSearchResults([]);
      setStudentSearchTerm('');
      fetchData();
    } catch (e: any) {
      console.error('Error sending invitation:', e);
      setError(e.response?.data?.error || 'Không thể gửi lời mời. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    if (!user?.studentId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await thesisGroupsService.acceptInvitation(invitationId, user.studentId);
      fetchData();
    } catch (e: any) {
      console.error('Error accepting invitation:', e);
      setError(e.response?.data?.error || 'Không thể chấp nhận lời mời. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectInvitation = async (invitationId: number) => {
    if (!user?.studentId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await thesisGroupsService.rejectInvitation(invitationId, user.studentId);
      fetchData();
    } catch (e: any) {
      console.error('Error rejecting invitation:', e);
      setError(e.response?.data?.error || 'Không thể từ chối lời mời. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        userRole={userRole as any}
        userName={user?.fullName || 'Nguyễn Văn A'}
        title="Quản lý nhóm"
        subtitle={userRole === 'admin' ? 'Quản lý tổ chức và nhóm trong hệ thống' : 'Quản lý nhóm khóa luận của bạn'}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'Nguyễn Văn A'}
      title="Quản lý nhóm"
      subtitle={userRole === 'admin' ? 'Quản lý tổ chức và nhóm trong hệ thống' : 'Quản lý nhóm khóa luận của bạn'}
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Đóng
          </Button>
        </div>
      )}
      <Tabs defaultValue="my-group">
        <TabsList>
          <TabsTrigger value="my-group">Nhóm của tôi</TabsTrigger>
          <TabsTrigger value="invitations">
            Lời mời
            {invitations.length > 0 && (
              <Badge variant="destructive" className="ml-2">{invitations.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="find-group">Tìm nhóm</TabsTrigger>
        </TabsList>

        {/* My Group Tab */}
        <TabsContent value="my-group" className="mt-6">
          {myGroup ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{myGroup.group_name}</CardTitle>
                      <CardDescription className="mt-1">
                        Mã nhóm: {myGroup.id}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(myGroup.status)}>
                      {myGroup.status === 'FORMING' ? 'Đang hình thành' : myGroup.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Số thành viên</span>
                      <span className="font-medium">{myGroup.thesis_group_members?.length || 0}/{myGroup.max_members}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${((myGroup.thesis_group_members?.length || 0) / myGroup.max_members) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {myGroup.thesis_group_members?.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                        <Avatar name={member.students?.users?.full_name || 'Unknown'} size="md" />
                        <div className="flex-1">
                          <p className="font-medium">{member.students?.users?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{member.students?.student_code || ''}</p>
                        </div>
                        {member.role === 'LEADER' && (
                          <Badge variant="default">Trưởng nhóm</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {(myGroup.thesis_group_members?.length || 0) < myGroup.max_members && (
                      <Button
                        className="flex-1"
                        onClick={() => setIsInviteMemberModalOpen(true)}
                      >
                        <UserPlus className="w-4 h-4" />
                        Mời thành viên
                      </Button>
                    )}
                    <Button variant="ghost" className="flex-1">
                      Rời nhóm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Chưa có nhóm</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa tham gia nhóm nào. Tạo nhóm mới hoặc tìm nhóm để tham gia.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setIsCreateGroupModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Tạo nhóm mới
                  </Button>
                  <Button variant="ghost">Tìm nhóm để tham gia</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations" className="mt-6">
          <div className="space-y-4">
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{invitation.thesis_groups?.group_name || 'Nhóm'}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          Mã nhóm: {invitation.thesis_groups?.group_code || invitation.thesis_group_id}
                        </p>
                        <p className="text-sm mb-2">
                          <span className="text-muted-foreground">Người mời:</span>{' '}
                          {invitation.students_invited_by?.users?.full_name || 'Unknown'}
                        </p>
                        {invitation.invitation_message && (
                          <p className="text-sm text-muted-foreground mb-3">
                            "{invitation.invitation_message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Trạng thái: {invitation.status === 'PENDING' ? 'Đang chờ' : invitation.status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Chấp nhận'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRejectInvitation(invitation.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Từ chối'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Không có lời mời nào</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Find Group Tab */}
        <TabsContent value="find-group" className="mt-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Tìm kiếm nhóm..." />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="FORMING">Đang tìm thành viên</SelectItem>
                    <SelectItem value="ACTIVE">Đã đủ thành viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {availableGroups.length > 0 ? (
              availableGroups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{group.group_name}</h4>
                          <Badge variant={getStatusBadgeVariant(group.status)}>
                            Đang tìm thành viên
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Mã nhóm: {group.group_code}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-muted-foreground">
                            Thành viên: <span className="text-foreground font-medium">
                              {group.thesis_group_members?.length || 0}/{group.max_members}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button>Gửi yêu cầu</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Không có nhóm nào đang tìm thành viên</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Group Modal */}
      <Modal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        title="Tạo nhóm mới"
        size="md"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <Label htmlFor="group_name">Tên nhóm</Label>
            <Input 
              id="group_name"
              placeholder="VD: Nhóm nghiên cứu AI" 
              required 
              value={createGroupForm.group_name}
              onChange={(e) => setCreateGroupForm({ ...createGroupForm, group_name: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="thesis_round_id">Đợt khóa luận</Label>
            <Input 
              id="thesis_round_id"
              type="number"
              placeholder="Nhập ID đợt khóa luận..."
              required
              value={createGroupForm.thesis_round_id}
              onChange={(e) => setCreateGroupForm({ ...createGroupForm, thesis_round_id: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Loại nhóm</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="groupType" 
                  value="INDIVIDUAL" 
                  checked={createGroupForm.group_type === 'INDIVIDUAL'}
                  onChange={(e) => setCreateGroupForm({ ...createGroupForm, group_type: e.target.value as any })}
                />
                <span className="text-sm">Cá nhân</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="groupType" 
                  value="GROUP" 
                  checked={createGroupForm.group_type === 'GROUP'}
                  onChange={(e) => setCreateGroupForm({ ...createGroupForm, group_type: e.target.value as any })}
                />
                <span className="text-sm">Nhóm</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_members">Số thành viên tối thiểu</Label>
              <Input 
                id="min_members"
                type="number" 
                value={createGroupForm.min_members}
                onChange={(e) => setCreateGroupForm({ ...createGroupForm, min_members: parseInt(e.target.value) })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="max_members">Số thành viên tối đa</Label>
              <Input 
                id="max_members"
                type="number" 
                value={createGroupForm.max_members}
                onChange={(e) => setCreateGroupForm({ ...createGroupForm, max_members: parseInt(e.target.value) })}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsCreateGroupModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tạo nhóm'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteMemberModalOpen}
        onClose={() => setIsInviteMemberModalOpen(false)}
        title="Mời thành viên"
        size="md"
      >
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <Label htmlFor="class_select">Chọn lớp</Label>
            <Select
              value={selectedClass}
              onValueChange={(value) => {
                setSelectedClass(value);
                setSearchResults([]);
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn lớp học" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.class_name} ({cls.class_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="student_search">Tìm kiếm sinh viên</Label>
            <Input
              id="student_search"
              placeholder="Nhập họ tên hoặc mã sinh viên..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              className="mt-2"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={searchStudents}
              disabled={!selectedClass || searchingStudents}
            >
              {searchingStudents ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tìm kiếm'}
            </Button>
          </div>
          
          {selectedClass && searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Danh sách sinh viên ({searchResults.length})</Label>
              <div className="border border-border rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {searchResults.map((student) => {
                    const isSelected = inviteForm.invited_student_ids.includes(student.id.toString());
                    return (
                      <div
                        key={student.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:bg-muted'
                        }`}
                        onClick={() => handleSelectStudent(student)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{student.users.full_name}</p>
                            <p className="text-xs text-muted-foreground">MSSV: {student.student_code}</p>
                            <p className="text-xs text-muted-foreground">{student.users.email}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {inviteForm.invited_student_ids.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Đã chọn {inviteForm.invited_student_ids.length} sinh viên
                </div>
              )}
            </div>
          )}
          
          <div>
            <Label htmlFor="invitation_message">Lời nhắn</Label>
            <Input 
              id="invitation_message"
              placeholder="Thêm lời nhắn cho lời mời..."
              value={inviteForm.invitation_message}
              onChange={(e) => setInviteForm({ ...inviteForm, invitation_message: e.target.value })}
              className="mt-2"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsInviteMemberModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || inviteForm.invited_student_ids.length === 0}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `Gửi lời mời (${inviteForm.invited_student_ids.length})`}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
