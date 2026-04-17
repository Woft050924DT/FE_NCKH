import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { councilService } from '../../services/councilService';
import { instructorService } from '../../services/instructorService';
import { thesisRoundsService } from '../../services/thesisRoundsService';
import type { CreateCouncilRequest, ThesisRound } from '../../services/types';

interface ModalCreateBoardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  thesisRoundId?: number;
}

export function ModalCreateBoard({ isOpen, onClose, onSuccess, thesisRoundId }: ModalCreateBoardProps) {
  const [formData, setFormData] = useState({
    council_code: '',
    council_name: '',
    notes: '',
    thesis_round_id: thesisRoundId || 0,
    chairman_id: 0,
    secretary_id: 0,
    defense_date: '',
    start_time: '',
    end_time: '',
    venue: '',
  });
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [thesisRounds, setThesisRounds] = useState<ThesisRound[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingInstructors, setFetchingInstructors] = useState(false);
  const [fetchingThesisRounds, setFetchingThesisRounds] = useState(false);
  const [error, setError] = useState('');

  // Fetch instructors and thesis rounds when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setFetchingInstructors(true);
        setFetchingThesisRounds(true);
        try {
          const [instructorsData, thesisRoundsData] = await Promise.all([
            instructorService.getInstructors(),
            thesisRoundsService.getActiveThesisRoundsForHead()
          ]);
          setInstructors(instructorsData);
          // Handle different response formats from thesisRoundsService
          const roundsArray = Array.isArray(thesisRoundsData) 
            ? thesisRoundsData 
            : (thesisRoundsData as any)?.data || [];
          setThesisRounds(roundsArray);
          
          // If thesisRoundId prop is provided, set it in form data
          if (thesisRoundId && !formData.thesis_round_id) {
            setFormData(prev => ({ ...prev, thesis_round_id: thesisRoundId }));
          }
        } catch (err: any) {
          console.error('Error fetching data:', err);
          setError(err.message || 'Không thể tải dữ liệu');
        } finally {
          setFetchingInstructors(false);
          setFetchingThesisRounds(false);
        }
      };

      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestData: CreateCouncilRequest = {
        council_code: formData.council_code,
        council_name: formData.council_name,
        thesis_round_id: formData.thesis_round_id,
        chairman_id: formData.chairman_id,
        secretary_id: formData.secretary_id || undefined,
        defense_date: formData.defense_date || undefined,
        start_time: formData.start_time || undefined,
        end_time: formData.end_time || undefined,
        venue: formData.venue || undefined,
        notes: formData.notes || undefined,
        members: selectedMembers.map((instructorId, index) => ({
          instructor_id: instructorId,
          role: 'MEMBER',
          order_number: index + 1,
        })),
      };

      await councilService.createCouncil(requestData);
      
      // Reset form
      setFormData({
        council_code: '',
        council_name: '',
        notes: '',
        thesis_round_id: thesisRoundId || 0,
        chairman_id: 0,
        secretary_id: 0,
        defense_date: '',
        start_time: '',
        end_time: '',
        venue: '',
      });
      setSelectedMembers([]);
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Không thể tạo hội đồng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo hội đồng mới" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="council_name" className="text-sm font-medium">
            Tên hội đồng <span className="text-destructive">*</span>
          </label>
          <Input
            id="council_name"
            name="council_name"
            placeholder="Nhập tên hội đồng"
            value={formData.council_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="council_code" className="text-sm font-medium">
            Mã hội đồng <span className="text-destructive">*</span>
          </label>
          <Input
            id="council_code"
            name="council_code"
            placeholder="Nhập mã hội đồng"
            value={formData.council_code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="thesis_round_id" className="text-sm font-medium">
            Đợt đồ án <span className="text-destructive">*</span>
          </label>
          <Select 
            value={formData.thesis_round_id.toString()} 
            onValueChange={(value: string) => setFormData(prev => ({ ...prev, thesis_round_id: parseInt(value) }))} 
            disabled={fetchingThesisRounds}
          >
            <SelectTrigger>
              <SelectValue placeholder={fetchingThesisRounds ? "Đang tải..." : "Chọn đợt đồ án"} />
            </SelectTrigger>
            <SelectContent>
              {thesisRounds.length === 0 ? (
                <SelectItem value="none" disabled>
                  Không có đợt đồ án nào
                </SelectItem>
              ) : (
                thesisRounds.map((round) => (
                  <SelectItem key={round.id} value={round.id.toString()}>
                    {round.round_name} ({round.round_code || 'ĐK' + round.id}) - {round.academic_year}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Ghi chú
          </label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Nhập ghi chú về hội đồng"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="chairman_id" className="text-sm font-medium">
            Chủ tịch hội đồng <span className="text-destructive">*</span>
          </label>
          <Select value={formData.chairman_id.toString()} onValueChange={(value: string) => setFormData(prev => ({ ...prev, chairman_id: parseInt(value) }))} disabled={fetchingInstructors}>
            <SelectTrigger>
              <SelectValue placeholder={fetchingInstructors ? "Đang tải..." : "Chọn chủ tịch hội đồng"} />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id.toString()}>
                  {instructor.users?.full_name || instructor.instructor_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="secretary_id" className="text-sm font-medium">
            Thư ký hội đồng
          </label>
          <Select value={formData.secretary_id.toString()} onValueChange={(value: string) => setFormData(prev => ({ ...prev, secretary_id: parseInt(value) }))} disabled={fetchingInstructors}>
            <SelectTrigger>
              <SelectValue placeholder={fetchingInstructors ? "Đang tải..." : "Chọn thư ký hội đồng"} />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id.toString()}>
                  {instructor.users?.full_name || instructor.instructor_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Thành viên hội đồng
          </label>
          <div className="border border-border rounded-md p-4 max-h-40 overflow-y-auto">
            {fetchingInstructors ? (
              <p className="text-sm text-muted-foreground">Đang tải danh sách giáo viên...</p>
            ) : instructors.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có giáo viên nào</p>
            ) : (
              <div className="space-y-2">
                {instructors
                  .filter(instructor => 
                    instructor.id !== formData.chairman_id && 
                    instructor.id !== formData.secretary_id
                  )
                  .map((instructor) => {
                    const isSelected = selectedMembers.includes(instructor.id);
                    return (
                      <label key={instructor.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers(prev => [...prev, instructor.id]);
                            } else {
                              setSelectedMembers(prev => prev.filter(id => id !== instructor.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">
                          {instructor.users?.full_name || instructor.instructor_code}
                        </span>
                      </label>
                    );
                  })}
              </div>
            )}
          </div>
          {selectedMembers.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Đã chọn {selectedMembers.length} thành viên
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="defense_date" className="text-sm font-medium">
            Ngày bảo vệ
          </label>
          <Input
            id="defense_date"
            name="defense_date"
            type="date"
            value={formData.defense_date}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="start_time" className="text-sm font-medium">
              Giờ bắt đầu
            </label>
            <Input
              id="start_time"
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="end_time" className="text-sm font-medium">
              Giờ kết thúc
            </label>
            <Input
              id="end_time"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="venue" className="text-sm font-medium">
            Địa điểm
          </label>
          <Input
            id="venue"
            name="venue"
            placeholder="Nhập địa điểm bảo vệ"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang tạo...' : 'Tạo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
