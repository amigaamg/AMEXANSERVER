import Card from '@/components/common/Card';
import Pill from '@/components/common/Pill';
import { timeAgo } from '@/lib/utils/date';
import { Alert } from '@/types/patient';

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Active Alerts</h3>
        <p style={{ color: '#94a3b8' }}>✅ No active alerts — all clear.</p>
      </Card>
    );
  }

  const severityStyles = {
    high: { border: '#ef4444', bg: '#fef2f2', color: '#ef4444' },
    medium: { border: '#f59e0b', bg: '#fffbeb', color: '#f59e0b' },
    low: { border: '#2563eb', bg: '#eff6ff', color: '#2563eb' },
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Active Alerts</h3>
        <Pill color="#ef4444" bg="#fef2f2">{alerts.length} active</Pill>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.slice(0, 5).map(alert => {
          const style = severityStyles[alert.severity] || severityStyles.low;
          return (
            <div key={alert._id} style={{ padding: 12, background: style.bg, borderRadius: 8, borderLeft: `4px solid ${style.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: style.color }}>{alert.title}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{timeAgo(alert.createdAt)}</span>
              </div>
              <p style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.5 }}>{alert.message}</p>
              {alert.action && (
                <button style={{ marginTop: 8, background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: style.color, cursor: 'pointer' }}>
                  {alert.action}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}