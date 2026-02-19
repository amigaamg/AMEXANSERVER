'use client';

import React from 'react';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import { formatDistanceToNow } from '@/lib/utils/date';
import type { Notification } from '@/types/notification';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsDrawer({
  open,
  onClose,
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
}: NotificationsDrawerProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 380,
          maxWidth: '90%',
          background: 'white',
          height: '100%',
          overflowY: 'auto',
          padding: 20,
          boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>
            Notifications {unreadCount > 0 && <span style={{ color: '#ef4444' }}>({unreadCount})</span>}
          </h3>
          <Button variant="text" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications" description="You're all caught up!" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                style={{
                  padding: 12,
                  background: n.read ? 'white' : '#eff6ff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => onMarkRead(n._id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: n.read ? 500 : 700, fontSize: 14 }}>{n.title}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    {formatDistanceToNow(n.createdAt)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.5 }}>{n.body}</p>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllRead} style={{ marginTop: 16, width: '100%' }}>
            Mark All as Read
          </Button>
        )}
      </div>
    </div>
  );
}