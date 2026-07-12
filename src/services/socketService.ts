import { io, Socket } from 'socket.io-client';

// Socket.IO kết nối TRỰC TIẾP đến ChatService (bypass API Gateway)
// Vì Gateway không proxy WebSocket
const SOCKET_URL = import.meta.env.VITE_CHAT_SOCKET_URL || 'http://localhost:8006';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

/**
 * Khởi tạo kết nối Socket.IO với JWT token
 * Gọi hàm này sau khi user đăng nhập thành công
 */
export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },          // ChatService socket middleware đọc token từ đây
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('[Socket] ✅ Kết nối thành công, socketId:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] ❌ Lỗi kết nối:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn('[Socket] ⚠️ Mất kết nối:', reason);
  });

  return socket;
}

/** Ngắt kết nối socket (khi logout hoặc unmount) */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** Tham gia phòng chat của 1 conversation */
export function joinConversation(conversationId: number): void {
  socket?.emit('joinConversation', { conversationId });
}

/** Rời khỏi phòng chat của 1 conversation */
export function leaveConversation(conversationId: number): void {
  socket?.emit('leaveConversation', { conversationId });
}

/** Gửi tin nhắn qua socket */
export function sendSocketMessage(conversationId: number, content: string): void {
  socket?.emit('sendMessage', { conversationId, content });
}

/** Báo đang gõ phím */
export function startTyping(conversationId: number): void {
  socket?.emit('startTyping', { conversationId });
}

/** Báo ngừng gõ phím */
export function stopTyping(conversationId: number): void {
  socket?.emit('stopTyping', { conversationId });
}
