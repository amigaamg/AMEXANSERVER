'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from '@/lib/utils/api';
import type { Notification } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { on, off } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const data = await api.get(`/patients/${user._id}/notifications`);
      setNotifications(Array.isArray(data) ? data : data?.notifications ?? []);
    } catch (err: any) {
      // Silently ignore 404 — backend route may not be deployed yet
      if (!err.message?.includes('404')) {
        console.error('Notifications fetch error:', err.message);
      }
    }
  }, [user?._id]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time new notifications via socket
  useEffect(() => {
    if (!user) return;
    const handleNew = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };
    on('notification', handleNew);
    return () => off('notification', handleNew);
  }, [user, on, off]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err: any) {
      if (!err.message?.includes('404')) {
        console.error('Mark as read error:', err.message);
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err: any) {
      if (!err.message?.includes('404')) {
        console.error('Mark all read error:', err.message);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, refresh: fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};