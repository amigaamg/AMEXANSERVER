import Button from '@/components/common/Button';
import { timeAgo } from '@/lib/utils/date';
import type { Alert } from '@/types/patient';

interface AlertItemProps {
  alert: Alert;
  onMarkRead?: (id: string) => void;
  onClick?: () => void;
}

export default function AlertItem({ alert, onMarkRead, onClick }: AlertItemProps) {
  const severityStyle = {
    high: { border: '#ef4444', bg: '#fef2f2', color: '#ef4444' },
    medium: { border: '#f59e0b', bg: '#fffbeb', color: '#f59e0b' },
    low: { border: '#2563eb', bg: '#eff6ff', color: '#2563eb' },
  }[alert.severity];

  return (
    <div
      onClick={onClick}
      style={{
        padding: 12,
        background: severityStyle.bg,
        borderLeft: `4px solid ${severityStyle.border}`,
        borderRadius: 8,
        cursor: onClick ? 'pointer' : 'default',
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: severityStyle.color }}>{alert.title}</span>
        <span style={{ fontSize: 11, color: '#64748b' }}>{timeAgo(alert.createdAt)}</span>
      </div>
      <p style={{ fontSize: 13, color: '#1e293b', marginTop: 4 }}>{alert.message}</p>
      {alert.action && (
        <Button variant="outline" size="sm" style={{ marginTop: 8 }}>{alert.action}</Button>
      )}
    </div>
  );
}