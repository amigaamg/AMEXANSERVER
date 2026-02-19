'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/utils/api';
import PatientHeader from '@/components/patient/PatientHeader';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';
import { useSocket } from '@/context/SocketContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function MessageThreadPage() {
  const { threadId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (threadId) {
      api(`/api/messages/thread/${threadId}`).then(data => {
        setMessages(data);
        setLoading(false);
      });
    }
  }, [threadId]);

  useEffect(() => {
    if (!socket) return;
    socket.on(`thread:${threadId}:message`, (msg: any) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socket.off(`thread:${threadId}:message`);
    };
  }, [socket, threadId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await api('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          threadId,
          content: newMessage,
          senderId: patientId,
        }),
      });
      setNewMessage('');
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PatientHeader
        patient={db.patient!}
        unreadAlerts={0}
        unreadNotifications={0}
        onShowQR={() => {}}
        onShowNotifications={() => {}}
      />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Messages</h1>
        <div style={{ background: 'white', borderRadius: 12, padding: 20, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
            {messages.map(msg => (
              <div key={msg._id} style={{ marginBottom: 12, textAlign: msg.senderId === patientId ? 'right' : 'left' }}>
                <div style={{ display: 'inline-block', background: msg.senderId === patientId ? '#2563eb' : '#f1f5f9', color: msg.senderId === patientId ? 'white' : '#1e293b', padding: '10px 16px', borderRadius: 18, maxWidth: '70%' }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}