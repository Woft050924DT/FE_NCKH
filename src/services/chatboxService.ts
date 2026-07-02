import { apiClient } from './apiClient';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  groupId?: string;
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export const chatboxService = {
  /**
   * Get all messages
   * GET /api/chatbox/messages
   * Headers: Authorization: Bearer <token>
   */
  async getMessages(params?: {
    conversationId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Message[]> {
    const queryParams = new URLSearchParams();
    if (params?.conversationId) queryParams.append('conversationId', params.conversationId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    return apiClient.get<Message[]>(
      `/api/chatbox/messages${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Send a new message
   * POST /api/chatbox/messages
   * Headers: Authorization: Bearer <token>
   */
  async sendMessage(data: {
    content: string;
    receiverId: string;
    groupId?: string;
  }): Promise<Message> {
    return apiClient.post<Message>('/api/chatbox/messages', data);
  },

  /**
   * Get all conversations
   * GET /api/chatbox/conversations
   * Headers: Authorization: Bearer <token>
   */
  async getConversations(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>('/api/chatbox/conversations');
  },

  /**
   * Get conversation details by ID
   * GET /api/chatbox/conversations/:id
   * Headers: Authorization: Bearer <token>
   */
  async getConversationById(id: string): Promise<Conversation> {
    return apiClient.get<Conversation>(`/api/chatbox/conversations/${id}`);
  },
};
