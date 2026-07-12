import { apiClient } from './apiClient';

// ─── Types đồng bộ với backend ─────────────────────────────────────────────

export interface ConversationMember {
  user_id: number;
  role: string;
  unread_count: number;
  users: {
    id: number;
    username: string;
    full_name: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: number;
  conversation_name?: string;
  conversation_avatar?: string;
  conversation_type_id: number;
  thesis_id?: number;
  last_message_at?: string;
  created_at: string;
  conversation_members: ConversationMember[];
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  users: {
    id: number;
    username: string;
    full_name: string;
    avatar?: string;
  };
  message_read_status?: { user_id: number; read_at: string }[];
}

export interface MessagesResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor: number | null;
}

export const chatboxService = {
  /**
   * Lấy danh sách conversation của user hiện tại
   * GET /api/v1/chatbox/conversations
   */
  async getConversations(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>('/api/v1/chatbox/conversations');
  },

  /**
   * Lấy tin nhắn của 1 conversation (cursor pagination)
   * GET /api/v1/chatbox/conversations/:id/messages?cursor=X
   */
  async getMessages(conversationId: number, cursor?: number): Promise<MessagesResponse> {
    const query = cursor ? `?cursor=${cursor}` : '';
    return apiClient.get<MessagesResponse>(
      `/api/v1/chatbox/conversations/${conversationId}/messages${query}`
    );
  },

  /**
   * Gửi tin nhắn qua HTTP (fallback khi socket mất kết nối)
   * POST /api/v1/chatbox/conversations/:id/messages
   */
  async sendMessage(conversationId: number, content: string): Promise<{ success: boolean; message: ChatMessage }> {
    return apiClient.post(`/api/v1/chatbox/conversations/${conversationId}/messages`, { content });
  },
};
