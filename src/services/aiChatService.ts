const BASE_URL = 'http://localhost:3000';

export const aiChatService = {
  /**
   * Send message to AI
   * POST /api/chat/message
   * Headers: Authorization: Bearer <jwt_token>, x-api-key: <your_api_key>
   */
  async sendMessage(
    message: string,
    conversationId?: string,
    context?: any,
    apiKey?: string
  ): Promise<{ reply: string; conversationId: string }> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(`${BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        conversationId,
        context,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to send message' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get conversation history
   * GET /api/chat/conversations/:id
   * Headers: Authorization: Bearer <jwt_token>, x-api-key: <your_api_key>
   */
  async getConversation(id: string, apiKey?: string): Promise<any> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(`${BASE_URL}/api/chat/conversations/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to get conversation' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
