import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import { useSocket } from './useSocket';
import type { MessageThread, Message } from '@/types/notification';

interface UseMessagesReturn {
  threads: MessageThread[];
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
  sendMessage: (threadId: string, content: string) => Promise<void>;
  markRead: (threadId: string) => void;
  refresh: () => void;
}

export function useMessages(patientId: string): UseMessagesReturn {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const fetchThreads = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await api(`/api/messages/patient/${patientId}/threads`);
      setThreads(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    if (!socket) return;
    socket.on('message', (msg: Message) => {
      setMessages(prev => ({
        ...prev,
        [msg.threadId]: [...(prev[msg.threadId] || []), msg],
      }));
    });
    return () => {
      socket.off('message');
    };
  }, [socket]);

  const sendMessage = async (threadId: string, content: string) => {
    try {
      await api(API_ROUTES.MESSAGES.SEND, {
        method: 'POST',
        body: JSON.stringify({ threadId, content, senderId: patientId }),
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const markRead = (threadId: string) => {
    // optimistically mark read, could also call API
    setThreads(prev =>
      prev.map(t => (t._id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  return { threads, messages, loading, error, sendMessage, markRead, refresh: fetchThreads };
}