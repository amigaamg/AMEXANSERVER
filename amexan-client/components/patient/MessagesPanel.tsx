import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Pill from '@/components/common/Pill';
import { api } from '@/lib/utils/api';
import { timeAgo } from '@/lib/utils/date';
import type { Message } from '@/types/patient';

interface MessagesPanelProps {
  messages: Message[];
  patientId: string;
  onUpdate: () => void;
  compact?: boolean;
  expanded?: boolean;
}

export default function MessagesPanel({ messages, patientId, onUpdate, compact, expanded }: MessagesPanelProps) {
  const [compose, setCompose] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const unread = messages.filter(m => !m.read).length;

  const sendMessage = async () => {
    if (!to || !body) return;
    setSending(true);
    try {
      await api('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          to,
          subject,
          body,
          senderType: 'patient',
        }),
      });
      setCompose(false);
      setTo('');
      setSubject('');
      setBody('');
      onUpdate();
    } catch {
      alert('Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Secure Messages</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {unread > 0 && <Pill color="#2563eb" bg="#eff6ff">{unread} new</Pill>}
          <Button
            variant="outline"
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={() => setCompose(true)}
          >
            + Compose
          </Button>
        </div>
      </div>

      {compose && (
        <div style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
          <Input label="To (doctor/clinic)" value={to} onChange={e => setTo(e.target.value)} />
          <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <textarea
            rows={3}
            placeholder="Your message…"
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={sendMessage} loading={sending}>Send</Button>
            <Button variant="outline" onClick={() => setCompose(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{ maxHeight: expanded ? undefined : 400, overflowY: expanded ? undefined : 'auto' }}>
        {messages.slice(0, expanded ? undefined : 5).map(m => (
          <div key={m._id} style={{
            display: 'flex',
            gap: 12,
            padding: '12px 0',
            borderBottom: '1px solid #f1f5f9',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}>
              {m.from?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: m.read ? 500 : 700, fontSize: 14 }}>{m.from}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{timeAgo(m.createdAt)}</span>
              </div>
              {!compact && <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{m.subject}</div>}
              <div style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {m.preview}
              </div>
            </div>
            {!m.read && <div style={{ width: 8, height: 8, background: '#2563eb', borderRadius: '50%', marginTop: 8 }} />}
          </div>
        ))}
      </div>
    </Card>
  );
}