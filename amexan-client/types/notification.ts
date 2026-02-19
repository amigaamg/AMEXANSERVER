export interface Notification {
  _id: string;
  userId: string;
  type: 'alert' | 'message' | 'appointment' | 'lab' | 'payment';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface MessageThread {
  _id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  _id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: string[];
  readBy: string[];
  createdAt: string;
}