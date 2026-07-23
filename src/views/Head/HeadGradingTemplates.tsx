import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Trash2, Upload, FileText, Settings, Loader2, Save,
  Bold, Italic, Underline, Strikethrough, Type, Highlighter,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Search, MousePointer2, Replace
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/plugins/api';
import { useAuth } from '@/contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function HeadGradingTemplates() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [templateContent, setTemplateContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({
    name: '',
    type: 'SUPERVISION',
    criteria_config: [{ name: '', max_score: 1 }],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }, { 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<any[]>('/api/v1/thesis/admin/grading-templates');
      setTemplates(response);
    } catch (error) {
      toast.error('Không thể tải danh sách mẫu phiếu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (!currentTemplate.name) {
        toast.error('Vui lòng nhập tên phiếu');
        return;
      }

      const formData = new FormData();
      formData.append('name', currentTemplate.name);
      formData.append('type', currentTemplate.type);
      formData.append('criteria_config', JSON.stringify(currentTemplate.criteria_config));
      if (selectedFile) {
        formData.append('template_file', selectedFile);
      }

      await apiClient.post('/api/v1/thesis/admin/grading-templates', formData, true, {
        'Content-Type': 'multipart/form-data'
      });

      toast.success('Lưu mẫu phiếu thành công');
      setIsDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error('Lỗi khi lưu mẫu phiếu');
    }
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'Trưởng bộ môn'}
      title="Quản lý Phiếu chấm điểm"
      subtitle="Thiết lập các tiêu chí đánh giá và tải lên file mẫu (Word/PDF)"
    >
      <style>{`
        .grading-quill .ql-toolbar {
          background: #1f2937;
          border: none !important;
          border-bottom: 1px solid #374151 !important;
          padding: 12px 24px;
        }
        .grading-quill .ql-toolbar .ql-stroke { stroke: #d1d5db; }
        .grading-quill .ql-toolbar .ql-fill { fill: #d1d5db; }
        .grading-quill .ql-toolbar .ql-picker { color: #d1d5db; }
        .grading-quill .ql-toolbar .ql-picker-options { background: #374151; color: white; border-color: #4b5563; }
        .grading-quill .ql-container {
          background: #f3f4f6;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          padding: 2rem 0;
          border: none !important;
          height: calc(90vh - 140px);
        }
        .grading-quill .ql-editor {
          background: white;
          width: 21cm;
          min-height: 29.7cm;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          padding: 2.5cm;
          font-family: 'Times New Roman', Times, serif;
          font-size: 14pt;
        }
        .grading-quill .ql-editor p {
          margin-bottom: 0.5rem;
        }
      `}</style>

      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setCurrentTemplate({ name: '', type: 'SUPERVISION', criteria_config: [{ name: '', max_score: 1 }] });
              setSelectedFile(null);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Tạo mẫu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1100px] w-[95vw] p-0 overflow-hidden bg-[#f3f4f6]">
            <Tabs defaultValue="scratch" className="w-full flex flex-col h-full max-h-[90vh]">
              <DialogHeader className="px-6 py-4 bg-white border-b m-0 flex flex-row items-center justify-between pr-14 shrink-0">
                <div className="flex items-center gap-6">
                  <DialogTitle className="text-xl">Thiết lập Mẫu phiếu chấm điểm</DialogTitle>
                  <TabsList className="bg-gray-100 h-9">
                    <TabsTrigger value="scratch" className="text-xs">Tạo mẫu trực tuyến</TabsTrigger>
                    <TabsTrigger value="upload" className="text-xs">Tải lên file mẫu</TabsTrigger>
                  </TabsList>
                </div>

                <Button onClick={handleSaveTemplate} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
                  <Save className="h-4 w-4 mr-2" /> Lưu mẫu phiếu
                </Button>
              </DialogHeader>

              <div className="bg-white border-b px-6 py-4 flex gap-6 items-end shadow-sm shrink-0 relative z-20">
                <div className="space-y-1.5 flex-[2]">
                  <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tên phiếu</Label>
                  <Input 
                    placeholder="VD: Phiếu chấm hướng dẫn K16..."
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                    className="bg-gray-50 border-gray-200 focus-visible:ring-blue-500 h-9"
                  />
                </div>
                <div className="space-y-1.5 flex-[1] min-w-[200px]">
                  <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Loại phiếu</Label>
                  <Select 
                    value={currentTemplate.type}
                    onValueChange={(val) => setCurrentTemplate({ ...currentTemplate, type: val })}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPERVISION">Hướng dẫn</SelectItem>
                      <SelectItem value="REVIEW">Phản biện</SelectItem>
                      <SelectItem value="DEFENSE">Hội đồng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="scratch" className="m-0 border-0 p-0 flex flex-col overflow-hidden bg-[#f3f4f6]">
                <ReactQuill 
                  theme="snow"
                  value={templateContent}
                  onChange={setTemplateContent}
                  modules={quillModules}
                  className="grading-quill flex flex-col w-full"
                  placeholder="Bắt đầu soạn thảo nội dung phiếu chấm điểm tại đây..."
                />
              </TabsContent>

              <TabsContent value="upload" className="m-0 border-0 p-0 flex-1 flex flex-col overflow-hidden bg-[#f3f4f6]">
                <div className="p-10 flex flex-col items-center justify-center flex-1 min-h-[500px]">
                  <div className="bg-white p-12 rounded-xl shadow-sm border-2 border-dashed border-blue-300 flex flex-col items-center max-w-lg w-full text-center hover:border-blue-500 transition-colors">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Kéo thả hoặc tải lên File mẫu</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-sm">
                      Tải lên file biểu mẫu (Word/PDF) đã soạn sẵn của bộ môn. Hệ thống sẽ lưu trữ và cho phép giảng viên tải xuống khi chấm điểm.
                    </p>
                    <div className="w-full relative">
                      <Input 
                        type="file" 
                        accept=".doc,.docx,.pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full h-12 pt-2.5 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {selectedFile && (
                      <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md font-medium text-sm">
                        <FileText className="w-4 h-4" />
                        Đã chọn: {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <Card key={tpl.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span>{tpl.name}</span>
                  <span className="text-xs font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {tpl.type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tiêu chí đánh giá:</p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                    {tpl.criteria_config?.map((c, i) => (
                      <li key={i}>{c.name} ({c.max_score}đ)</li>
                    ))}
                  </ul>
                  <p className="text-sm font-medium pt-2 border-t text-right">
                    Tổng điểm: {tpl.criteria_config?.reduce((sum, c) => sum + (c.max_score || 0), 0)}đ
                  </p>
                </div>
                {tpl.template_file_url && (
                  <Button variant="outline" className="w-full" onClick={() => window.open(`http://localhost:8002${tpl.template_file_url}`)}>
                    <FileText className="h-4 w-4 mr-2" /> Xem file mẫu
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
