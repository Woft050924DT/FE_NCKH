import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { gradingService } from '../../services/gradingService';
import { useAuth } from '../../contexts/AuthContext';

interface InstructorGradingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  studentData?: {
    name?: string;
    studentId?: string;
    className?: string;
    major?: string;
    topicName?: string;
    thesisCode?: string;
    thesisId?: number;
    gradingType?: 'supervision' | 'review';
    reviewAssignmentId?: number;
  };
  instructorData?: {
    name?: string;
    academicTitle?: string;
    degree?: string;
    unit?: string;
  };
}

export function InstructorGradingForm({ 
  isOpen, 
  onClose, 
  onSuccess, 
  studentData, 
  instructorData 
}: InstructorGradingFormProps) {
  const { user } = useAuth();
  const gradingType = studentData?.gradingType || 'supervision';
  
  const [formData, setFormData] = useState({
    // Instructor info
    instructorName: instructorData?.name || '',
    academicTitle: instructorData?.academicTitle || '',
    degree: instructorData?.degree || '',
    unit: instructorData?.unit || '',
    
    // Student info
    studentName: studentData?.name || '',
    studentId: studentData?.studentId || '',
    className: studentData?.className || '',
    major: studentData?.major || '',
    topicName: studentData?.topicName || '',
    thesisCode: studentData?.thesisCode || '',
    
    // Supervision grading fields
    commentContent: '',
    attitudeEvaluation: '',
    capabilityEvaluation: '',
    resultEvaluation: '',
    supervisionScore: 0,
    defenseApproval: true,
    rejectionReason: '',
    
    // Review grading fields
    reviewContent: '',
    topicEvaluation: '',
    improvementSuggestions: '',
    reviewScore: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (value: number) => {
    // Validate score between 0-10
    const validatedValue = Math.min(10, Math.max(0, value));
    if (gradingType === 'supervision') {
      setFormData(prev => ({ ...prev, supervisionScore: validatedValue }));
    } else {
      setFormData(prev => ({ ...prev, reviewScore: validatedValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const instructorId = user?.instructorId || user?.id || 0;

      if (gradingType === 'supervision') {
        await gradingService.submitSupervisionComment({
          thesis_id: studentData?.thesisId || 0,
          comment_content: formData.commentContent,
          attitude_evaluation: formData.attitudeEvaluation,
          capability_evaluation: formData.capabilityEvaluation,
          result_evaluation: formData.resultEvaluation,
          supervision_score: formData.supervisionScore,
          defense_approval: formData.defenseApproval,
          rejection_reason: formData.rejectionReason || null,
          instructor_id: instructorId,
        });
      } else {
        await gradingService.submitReviewResult({
          review_assignment_id: studentData?.reviewAssignmentId || 0,
          review_content: formData.reviewContent,
          topic_evaluation: formData.topicEvaluation,
          result_evaluation: formData.resultEvaluation,
          improvement_suggestions: formData.improvementSuggestions || null,
          review_score: formData.reviewScore,
          defense_approval: formData.defenseApproval,
          rejection_reason: formData.rejectionReason || null,
          review_file: null,
          instructor_id: instructorId,
        });
      }
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={gradingType === 'supervision' ? 'Phiếu đánh giá hướng dẫn' : 'Phiếu đánh giá phản biện'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="text-center border-b border-border pb-4">
          <h2 className="text-lg font-bold">BỘ GIÁO DỤC VÀ ĐÀO TẠO</h2>
          <h3 className="font-semibold">TRƯỜNG ĐẠI HỌC SPKT HƯNG YÊN</h3>
          <p className="text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
          <p className="text-sm">Độc lập - Tự do - Hạnh phúc</p>
        </div>

        {/* I. Thông tin chung */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">I. THÔNG TIN CHUNG</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ tên cán bộ hướng dẫn</label>
                <Input
                  name="instructorName"
                  value={formData.instructorName}
                  onChange={handleChange}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Học hàm, học vị</label>
                <Input
                  name="academicTitle"
                  value={`${formData.academicTitle} ${formData.degree}`.trim()}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicTitle: e.target.value }))}
                  placeholder="VD: Thạc sĩ"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Đơn vị công tác</label>
              <Input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Nhập đơn vị công tác"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ tên SV</label>
                <Input
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Nhập họ tên sinh viên"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mã số SV</label>
                <Input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Nhập mã số sinh viên"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lớp</label>
                <Input
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="Nhập lớp"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ngành</label>
                <Input
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Nhập ngành"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tên đề tài</label>
              <Input
                name="topicName"
                value={formData.topicName}
                onChange={handleChange}
                placeholder="Nhập tên đề tài"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mã đồ án</label>
              <Input
                name="thesisCode"
                value={formData.thesisCode}
                onChange={handleChange}
                placeholder="Nhập mã đồ án"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* II. Nhận xét */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">II. NHẬN XÉT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gradingType === 'supervision' ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nội dung nhận xét:</label>
                  <Textarea
                    name="commentContent"
                    value={formData.commentContent}
                    onChange={handleChange}
                    placeholder="Nhập nhận xét về quá trình thực hiện đồ án"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đánh giá thái độ:</label>
                  <Input
                    name="attitudeEvaluation"
                    value={formData.attitudeEvaluation}
                    onChange={handleChange}
                    placeholder="VD: Tốt, Khá, Đạt"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đánh giá năng lực:</label>
                  <Input
                    name="capabilityEvaluation"
                    value={formData.capabilityEvaluation}
                    onChange={handleChange}
                    placeholder="VD: Tốt, Khá, Đạt"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đánh giá kết quả:</label>
                  <Input
                    name="resultEvaluation"
                    value={formData.resultEvaluation}
                    onChange={handleChange}
                    placeholder="VD: Đạt yêu cầu, Cần cải thiện"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nội dung phản biện:</label>
                  <Textarea
                    name="reviewContent"
                    value={formData.reviewContent}
                    onChange={handleChange}
                    placeholder="Nhập nội dung phản biện về đồ án"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đánh giá đề tài:</label>
                  <Input
                    name="topicEvaluation"
                    value={formData.topicEvaluation}
                    onChange={handleChange}
                    placeholder="Đánh giá về tính phù hợp và thực tiễn của đề tài"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đánh giá kết quả:</label>
                  <Input
                    name="resultEvaluation"
                    value={formData.resultEvaluation}
                    onChange={handleChange}
                    placeholder="Đánh giá về kết quả đạt được"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gợi ý cải thiện:</label>
                  <Textarea
                    name="improvementSuggestions"
                    value={formData.improvementSuggestions}
                    onChange={handleChange}
                    placeholder="Nhập các gợi ý cải thiện"
                    rows={3}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* III. Đánh giá */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">III. ĐÁNH GIÁ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Điểm số (0-10):
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={gradingType === 'supervision' ? formData.supervisionScore : formData.reviewScore}
                onChange={(e) => handleScoreChange(parseFloat(e.target.value) || 0)}
                className="w-24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duyệt bảo vệ:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="defenseApproval"
                    checked={formData.defenseApproval}
                    onChange={() => setFormData(prev => ({ ...prev, defenseApproval: true }))}
                  />
                  <span className="text-sm">Đồng ý</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="defenseApproval"
                    checked={!formData.defenseApproval}
                    onChange={() => setFormData(prev => ({ ...prev, defenseApproval: false }))}
                  />
                  <span className="text-sm">Không đồng ý</span>
                </label>
              </div>
            </div>

            {!formData.defenseApproval && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Lý do từ chối:</label>
                <Textarea
                  name="rejectionReason"
                  value={formData.rejectionReason}
                  onChange={handleChange}
                  placeholder="Nhập lý do từ chối duyệt bảo vệ"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
