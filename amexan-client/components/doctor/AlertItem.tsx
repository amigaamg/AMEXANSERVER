import Button from '@/components/common/Button';

interface Alert {
  _id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action?: string;
  createdAt: string;
  isRead: boolean;
}

interface AlertItemProps {
  alert: Alert;
}

const severityColors: Record<string, { bg: string; color: string; border: string }> = {
  low:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  high:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

export default function AlertItem({ alert }: AlertItemProps) {
  const colors = severityColors[alert.severity] ?? severityColors.low;

  return (
    <div style={{
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 10,
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          background: colors.color,
          color: 'white',
          borderRadius: 6,
          padding: '2px 8px',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          {alert.severity}
        </span>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{alert.title}</span>
      </div>
      <p style={{ fontSize: 13, color: '#1e293b', marginTop: 4 }}>{alert.message}</p>
      {alert.action && (
        <Button
          variant="outline"
          style={{ marginTop: 8, padding: '4px 12px', fontSize: 12 }}
        >
          {alert.action}
        </Button>
      )}
    </div>
  );
}