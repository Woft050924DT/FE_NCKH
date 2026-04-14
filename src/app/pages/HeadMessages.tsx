import { useEffect, useState } from 'react';
import { MessageSquare, Search, Send, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

export function HeadMessages() {
  const { user } = useAuth();
  const userRole = user?.role || 'head';
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // TODO: Fetch from actual API
        setConversations([]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message to API
      setMessage('');
    }
  };

  return (
    <PageLayout
      userRole={userRole as any}
      userName={user?.fullName || 'PGS. TS. Nguyễn Văn A'}
      title="Tin nhắn"
      subtitle="Giao tiếp với giảng viên và sinh viên"
    >
      <div className="h-[calc(100vh-200px)] flex gap-6">
        {/* Conversation List */}
        <Card className="w-80 flex flex-col">
          <CardContent className="p-4 flex-1 flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm cuộc trò chuyện..." className="pl-10" />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conv.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={conv.avatar} name={conv.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">{conv.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-sm truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardContent className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={selectedConversation.avatar}
                      name={selectedConversation.name}
                      size="md"
                    />
                    <div>
                      <p className="font-medium">{selectedConversation.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.role === 'instructor' && 'Giảng viên'}
                        {selectedConversation.role === 'student' && 'Sinh viên'}
                        {selectedConversation.role === 'group' && 'Nhóm'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Sample messages */}
                  <div className="flex gap-3">
                    <Avatar
                      src={selectedConversation.avatar}
                      name={selectedConversation.name}
                      size="sm"
                    />
                    <div className="max-w-md">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm">Xin chào thầy, em muốn hỏi về đề tài khóa luận...</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="max-w-md">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3">
                        <p className="text-sm">Chào em, thầy đã nhận được. Em hãy gửi chi tiết đề tài qua email nhé.</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-right">10:35 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Message Input */}
              <CardContent className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4 mr-2" />
                    Gửi
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Chọn một cuộc trò chuyện để bắt đầu</p>
                <Button>Tạo cuộc trò chuyện mới</Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
