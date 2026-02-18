import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { api } from '@/lib/utils/api';
import { timeAgo } from '@/lib/utils/date';
import type { Message } from '@/types/patient';

interface PatientMessagesProps {
  patientId: string;
  messages: Message[];
  onUpdate: () => void;
}

export default function PatientMessages({ patientId, messages, onUpdate }: PatientMessagesProps) {
  const [compose, setCompose] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!body) return;
    setSending(true);
    try {
      await api('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          subject,
          body,
          senderType: 'doctor',
        }),
      });
      setCompose(false);
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
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Messages</h3>
        <Button
          variant="primary"
          style={{ padding: '4px 12px', fontSize: 12 }}
          onClick={() => setCompose(true)}
        >
          + Compose
        </Button>
      </div>

      {compose && (
        <div style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
          <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <textarea
            rows={4}
            placeholder="Message..."
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: '100%', padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, marginTop: 8 }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={sendMessage} loading={sending}>Send</Button>
            <Button variant="outline" onClick={() => setCompose(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map(msg => (
          <div key={msg._id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{msg.from}</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{timeAgo(msg.createdAt)}</span>
            </div>
            {msg.subject && <div style={{ fontSize: 13, color: '#2563eb' }}>{msg.subject}</div>}
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{msg.preview}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}