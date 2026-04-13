import { useState } from 'react';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { cn } from '../../utils/cn';

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [message, setMessage] = useState('');

  const conversations: any[] = [];

  const messages: any[] = [];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending:', message);
      setMessage('');
    }
  };

  return (
    <PageLayout
      userRole="student"
      userName="Nguyễn Văn A"
    >
      <div className="flex h-[calc(100vh-180px)] bg-card rounded-xl shadow-sm overflow-hidden -mt-8">
        {/* Conversation List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold mb-3">Tin nhắn</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                className="w-full pl-10 pr-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={cn(
                  'flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-border',
                  selectedConversation === conv.id ? 'bg-primary/10' : 'hover:bg-muted'
                )}
              >
                <div className="relative">
                  <Avatar name={conv.name} size="md" />
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium truncate">{conv.name}</p>
                    <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{conv.unread}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar name={selectedConv?.name || ''} size="md" />
                {selectedConv?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{selectedConv?.name}</h3>
                {selectedConv?.isOnline && (
                  <p className="text-xs text-green-600">Đang hoạt động</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="icon">
                <Info className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Hôm nay
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3',
                  msg.isOwn && 'flex-row-reverse'
                )}
              >
                {!msg.isOwn && (
                  <Avatar name={msg.senderName} size="sm" />
                )}
                <div className={cn(
                  'max-w-md',
                  msg.isOwn && 'flex flex-col items-end'
                )}>
                  {!msg.isOwn && selectedConv?.type === 'group' && (
                    <p className="text-xs text-muted-foreground mb-1">{msg.senderName}</p>
                  )}
                  <div
                    className={cn(
                      'px-4 py-2 rounded-2xl',
                      msg.isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end gap-2">
              <Button variant="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="w-full px-4 py-2 pr-12 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary max-h-32"
                  rows={1}
                />
                <Button
                  variant="icon"
                  className="absolute right-2 bottom-2"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
