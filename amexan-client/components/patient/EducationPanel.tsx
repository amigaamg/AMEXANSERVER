import Card from '@/components/common/Card';
import type { EducationItem } from '@/types/patient';

interface EducationPanelProps {
  items: EducationItem[];
  compact?: boolean;
  expanded?: boolean;
}

export default function EducationPanel({ items, compact, expanded }: EducationPanelProps) {
  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Health Education</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.slice(0, expanded ? undefined : 3).map(item => (
          <div key={item._id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#2563eb' }}>{item.title}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2, lineHeight: 1.5 }}>{item.content}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{item.category}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}