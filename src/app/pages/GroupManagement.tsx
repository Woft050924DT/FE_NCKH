import { useState } from 'react';
import { Plus, UserPlus, Users, Mail } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export function GroupManagement() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  const myGroup: any = null;

  const invitations: any[] = [];

  const availableGroups: any[] = [];

  return (
    <PageLayout
      userRole="student"
      userName="Nguyễn Văn A"
      title="Quản lý nhóm"
      subtitle="Quản lý nhóm khóa luận của bạn"
    >
      <Tabs defaultValue="my-group">
        <TabsList>
          <TabsTrigger value="my-group">Nhóm của tôi</TabsTrigger>
          <TabsTrigger value="invitations">
            Lời mời
            {invitations.length > 0 && (
              <Badge variant="red" className="ml-2">{invitations.length}</Badge>
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
                      <CardTitle>{myGroup.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Mã nhóm: {myGroup.code}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(myGroup.status)}>
                      {myGroup.status === 'READY' ? 'Sẵn sàng' : myGroup.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Số thành viên</span>
                      <span className="font-medium">{myGroup.currentMembers}/{myGroup.maxMembers}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(myGroup.currentMembers / myGroup.maxMembers) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {myGroup.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                        <Avatar name={member.name} size="md" />
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.studentCode}</p>
                        </div>
                        {member.role === 'Leader' && (
                          <Badge variant="blue">Trưởng nhóm</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {myGroup.currentMembers < myGroup.maxMembers && (
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
                        <h4 className="font-semibold mb-1">{invitation.groupName}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          Mã nhóm: {invitation.groupCode}
                        </p>
                        <p className="text-sm mb-2">
                          <span className="text-muted-foreground">Người mời:</span>{' '}
                          {invitation.inviterName}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          "{invitation.message}"
                        </p>
                        <p className="text-xs text-amber-600">
                          Hết hạn: {invitation.expiresAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Chấp nhận</Button>
                        <Button size="sm" variant="ghost">Từ chối</Button>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Tìm kiếm nhóm..." />
                <Select
                  options={[
                    { value: 'all', label: 'Tất cả đợt khóa luận' },
                    { value: 'KL2024-HK1', label: 'KL2024-HK1' },
                  ]}
                />
                <Select
                  options={[
                    { value: 'all', label: 'Tất cả trạng thái' },
                    { value: 'FORMING', label: 'Đang tìm thành viên' },
                    { value: 'READY', label: 'Đã đủ thành viên' },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {availableGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{group.name}</h4>
                        <Badge variant={getStatusBadgeVariant(group.status)}>
                          Đang tìm thành viên
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Mã nhóm: {group.code}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar name={group.leaderName} size="sm" />
                          <span className="text-muted-foreground">
                            Trưởng nhóm: <span className="text-foreground">{group.leaderName}</span>
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Thành viên: <span className="text-foreground font-medium">
                            {group.currentMembers}/{group.maxMembers}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button>Gửi yêu cầu</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
        <form className="space-y-4">
          <Input label="Tên nhóm" placeholder="VD: Nhóm nghiên cứu AI" required />
          <div>
            <label className="block text-sm font-medium mb-2">Loại nhóm</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="groupType" value="INDIVIDUAL" />
                <span className="text-sm">Cá nhân</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="groupType" value="GROUP" defaultChecked />
                <span className="text-sm">Nhóm</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Số thành viên tối thiểu" type="number" defaultValue="2" />
            <Input label="Số thành viên tối đa" type="number" defaultValue="4" />
          </div>
          <Input label="Ghi chú" placeholder="Mô tả ngắn về nhóm (tuỳ chọn)" />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsCreateGroupModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Tạo nhóm</Button>
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
        <form className="space-y-4">
          <Input
            label="Tìm sinh viên"
            placeholder="Nhập mã SV hoặc tên sinh viên..."
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium">Sinh viên gợi ý</label>
            <div className="border border-border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
              <p className="p-4 text-center text-muted-foreground">Không có sinh viên gợi ý</p>
            </div>
          </div>
          <Input label="Lời nhắn" placeholder="Thêm lời nhắn cho lời mời..." />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" type="button" onClick={() => setIsInviteMemberModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Gửi lời mời</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
