import { useState } from 'react';
import { Calendar, FileText, Download, Upload } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge, getStatusBadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';

export function ReviewSchedule() {
  const { user } = useAuth();
  const userRole = user?.role || 'instructor';
  const [selectedReview, setSelectedReview] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const reviews = [
    {
      id: 1,
      thesisCode: 'KL2024-008',
      thesisTitle: 'Hệ thống IoT giám sát môi trường nông nghiệp',
      groupName: 'Nhóm IoT Smart Farm',
      students: ['Nguyễn Văn X', 'Trần Thị Y'],
      supervisor: 'TS. Lê Văn B',
      deadline: '20/04/2026',
      status: 'PENDING_REVIEW',
      reportFile: 'bao_cao_KL2024-008.pdf',
    },
    {
      id: 2,
      thesisCode: 'KL2024-015',
      thesisTitle: 'Ứng dụng Blockchain trong quản lý chuỗi cung ứng',
      groupName: 'Nhóm Blockchain',
      students: ['Phạm Văn Z'],
      supervisor: 'TS. Hoàng Thị C',
      deadline: '22/04/2026',
      status: 'PENDING_REVIEW',
      reportFile: 'bao_cao_KL2024-015.pdf',
    },
    {
      id: 3,
      thesisCode: 'KL2024-003',
      thesisTitle: 'Hệ thống nhận diện biển số xe thông minh',
      groupName: 'Nhóm Computer Vision',
      students: ['Đỗ Văn M', 'Vũ Thị N'],
      supervisor: 'PGS. TS. Nguyễn Văn D',
      deadline: '18/04/2026',
      status: 'REVIEWED',
      reviewScore: 8.5,
      reviewDate: '15/04/2026',
      reportFile: 'bao_cao_KL2024-003.pdf',
    },
  ];

  const handleOpenReviewModal = (reviewId: number) => {
    setSelectedReview(reviewId);
    setIsReviewModalOpen(true);
  };

  const selectedReviewData = reviews.find(r => r.id === selectedReview);

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'TS. Nguyễn Văn A'}
      title="Lịch phản biện"
      subtitle="Danh sách khóa luận cần phản biện"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-amber-600 mb-1">2</div>
            <p className="text-sm text-muted-foreground">Chờ phản biện</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">1</div>
            <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">8.5</div>
            <p className="text-sm text-muted-foreground">Điểm TB đã chấm</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{review.thesisTitle}</h3>
                    <Badge variant={getStatusBadgeVariant(review.status)}>
                      {review.status === 'PENDING_REVIEW' && 'Chờ phản biện'}
                      {review.status === 'REVIEWED' && 'Đã phản biện'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Mã: {review.thesisCode}</p>
                  <p className="text-sm text-muted-foreground">{review.groupName}</p>
                </div>
                {review.status === 'REVIEWED' && review.reviewScore && (
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-green-600">{review.reviewScore}</div>
                    <p className="text-xs text-muted-foreground">Điểm phản biện</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sinh viên</p>
                  <div className="space-y-1">
                    {review.students.map((student, idx) => (
                      <p key={idx} className="text-sm font-medium">{student}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Giảng viên hướng dẫn</p>
                  <p className="text-sm font-medium">{review.supervisor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {review.status === 'REVIEWED' ? 'Ngày phản biện' : 'Hạn phản biện'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {review.status === 'REVIEWED' ? review.reviewDate : review.deadline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                  Tải báo cáo
                </Button>
                {review.status === 'PENDING_REVIEW' ? (
                  <Button size="sm" onClick={() => handleOpenReviewModal(review.id)}>
                    <FileText className="w-4 h-4" />
                    Viết nhận xét
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => handleOpenReviewModal(review.id)}>
                    <FileText className="w-4 h-4" />
                    Xem nhận xét
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={selectedReviewData?.status === 'REVIEWED' ? 'Xem nhận xét phản biện' : 'Viết nhận xét phản biện'}
        size="lg"
      >
        {selectedReviewData && (
          <div className="space-y-6">
            {/* Thesis Info */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">{selectedReviewData.thesisTitle}</h4>
              <p className="text-sm text-muted-foreground">Mã: {selectedReviewData.thesisCode}</p>
              <p className="text-sm text-muted-foreground">Nhóm: {selectedReviewData.groupName}</p>
            </div>

            {/* Report File */}
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{selectedReviewData.reportFile}</p>
                    <p className="text-sm text-muted-foreground">PDF • 2.5 MB</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                  Tải xuống
                </Button>
              </div>
            </div>

            {selectedReviewData.status === 'PENDING_REVIEW' ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nhận xét nội dung</label>
                  <textarea
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-32 resize-y"
                    placeholder="Nhận xét về nội dung báo cáo..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Đánh giá đề tài</label>
                  <textarea
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-24 resize-y"
                    placeholder="Đánh giá về tính khả thi, tính mới..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Đánh giá kết quả</label>
                  <textarea
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-24 resize-y"
                    placeholder="Đánh giá về kết quả đạt được..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Góp ý cải thiện</label>
                  <textarea
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg min-h-24 resize-y"
                    placeholder="Các góp ý để cải thiện luận văn..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Điểm phản biện (0-10)</label>
                  <Input type="number" min="0" max="10" step="0.5" placeholder="VD: 8.5" required />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="defenseApproval" className="w-4 h-4" />
                  <label htmlFor="defenseApproval" className="text-sm">
                    Đồng ý cho bảo vệ
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload file nhận xét (tuỳ chọn)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click để upload hoặc kéo thả file</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="ghost" type="button" onClick={() => setIsReviewModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Nộp nhận xét</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-900">Điểm phản biện</h4>
                    <div className="text-3xl font-bold text-green-600">{selectedReviewData.reviewScore}</div>
                  </div>
                  <p className="text-sm text-green-800">✓ Đồng ý cho bảo vệ</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Nhận xét nội dung</h4>
                  <p className="text-sm text-muted-foreground">
                    Nội dung báo cáo được trình bày rõ ràng, logic. Kết quả thực nghiệm đầy đủ và có tính thuyết phục cao.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Góp ý cải thiện</h4>
                  <p className="text-sm text-muted-foreground">
                    Nên bổ sung thêm phần so sánh với các giải pháp khác. Cần làm rõ hơn về hạn chế của hệ thống.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
