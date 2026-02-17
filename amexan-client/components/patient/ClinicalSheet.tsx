import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { formatDate } from '@/lib/utils/date';
import type { Visit, Lab, Message } from '@/types/patient';

interface ClinicalSheetProps {
  visits: Visit[];
  labs: Lab[];
  messages: Message[];
  expanded?: boolean;
}

export default function ClinicalSheet({ visits, labs, messages, expanded }: ClinicalSheetProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Combine all events into a timeline
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

  const getTitle = (item: any) => {
    if (item.type === 'visit') return `${item.type} – ${item.clinicName}`;
    if (item.type === 'lab') return `Lab: ${item.name}`;
    if (item.type === 'message') return `Message from ${item.from}`;
    return '';
  };

  const getDetail = (item: any) => {
    if (item.type === 'visit') return item.diagnosis;
    if (item.type === 'lab') return `${item.value} ${item.unit}`;
    if (item.type === 'message') return item.preview;
    return '';
  };

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
        Continuous Clinical Record
      </h3>
      <div style={{ maxHeight: expanded ? undefined : 400, overflowY: expanded ? undefined : 'auto' }}>
        {timeline.map(item => (
          <div key={`${item.type}-${item._id}`} style={{ marginBottom: 16 }}>
            <div
              onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
              style={{
                display: 'flex',
                gap: 12,
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ fontSize: 20, width: 32, textAlign: 'center' }}>{getIcon(item.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{getTitle(item)}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDate(item.date)}</span>
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{getDetail(item)}</div>
              </div>
            </div>
            {expandedId === item._id && (
              <div style={{ marginTop: 8, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                <pre style={{ fontSize: 13, whiteSpace: 'pre-wrap', color: '#1e293b' }}>
                  {JSON.stringify(item, null, 2)}
                </pre>
                <Button variant="outline" size="sm" style={{ marginTop: 8 }}>📄 Download</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}