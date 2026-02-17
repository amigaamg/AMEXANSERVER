import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { formatDate } from '@/lib/utils/date';
import type { Visit, Lab, Message } from '@/types/patient';

interface PatientClinicalSheetProps {
  visits: Visit[];
  labs: Lab[];
  messages: Message[];
  expanded?: boolean;
}

export default function PatientClinicalSheet({ visits, labs, messages, expanded }: PatientClinicalSheetProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const timeline = [
    ...visits.map(v => ({ ...v, type: 'visit' as const, date: v.date })),
    ...labs.map(l => ({ ...l, type: 'lab' as const, date: l.date })),
    ...messages.map(m => ({ ...m, type: 'message' as const, date: m.createdAt })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'visit': return '🩺';
      case 'lab': return '🧪';
      case 'message': return '💬';
      default: return '📄';
    }
  };

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Clinical Timeline</h3>
      <div style={{ maxHeight: expanded ? undefined : 500, overflowY: expanded ? undefined : 'auto' }}>
        {timeline.map(item => (
          <div key={`${item.type}-${item._id}`} style={{ marginBottom: 12 }}>
            <div
              onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
              style={{ display: 'flex', gap: 12, cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}
            >
              <div style={{ fontSize: 20, width: 32 }}>{getIcon(item.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {item.type === 'visit' ? `Visit – ${item.clinicName}` : item.type === 'lab' ? `Lab: ${item.name}` : `Message from ${item.from}`}
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDate(item.date)}</span>
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {item.type === 'visit' ? item.diagnosis : item.type === 'lab' ? `${item.value} ${item.unit}` : item.preview}
                </div>
              </div>
            </div>
            {expandedId === item._id && (
              <div style={{ marginTop: 8, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(item, null, 2)}</pre>
                {item.type === 'visit' && <Button variant="outline" size="sm" style={{ marginTop: 8 }}>Add Note</Button>}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}