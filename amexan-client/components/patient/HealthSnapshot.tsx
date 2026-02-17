import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import { bpCategory } from '@/lib/utils/bp';
import { formatDate, timeAgo } from '@/lib/utils/date';

interface HealthSnapshotProps {
  latestBP?: any;
  bpHistory?: any[];
  onLogBP: () => void;
}

export default function HealthSnapshot({ latestBP, bpHistory = [], onLogBP }: HealthSnapshotProps) {
  const cat = latestBP ? bpCategory(latestBP.systolic, latestBP.diastolic) : null;

  // Simple sparkline (you can use a proper chart library)
  const renderSparkline = () => {
    if (bpHistory.length < 2) return null;
    const values = bpHistory.slice(-10).map(m => m.systolic);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const width = 200;
    const height = 48;
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 48 }}>
        <polyline points={points} stroke={cat?.color || '#2563eb'} strokeWidth="2" fill="none" />
        <circle cx={width} cy={points.split(' ').pop()?.split(',')[1] || 0} r="3" fill={cat?.color || '#2563eb'} />
      </svg>
    );
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Health Snapshot</h3>
        {cat && <Pill color={cat.color} bg={cat.bg}>{cat.icon} {cat.label}</Pill>}
      </div>
      {latestBP ? (
        <>
          <div style={{ fontSize: 48, fontWeight: 800, color: cat?.color || '#1e293b', lineHeight: 1 }}>
            {latestBP.systolic}/{latestBP.diastolic}
            <span style={{ fontSize: 16, color: '#94a3b8', marginLeft: 8 }}>mmHg</span>
          </div>
          {latestBP.pulse && (
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              Pulse {latestBP.pulse} bpm · {timeAgo(latestBP.recordedAt)}
            </div>
          )}
          <div style={{ marginTop: 12 }}>{renderSparkline()}</div>
          <div style={{ marginTop: 12 }}>
            <Button onClick={onLogBP} variant="primary" style={{ width: '100%' }}>+ Log BP</Button>
          </div>
        </>
      ) : (
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
          <p>No recent readings</p>
          <Button onClick={onLogBP} variant="primary" style={{ marginTop: 12 }}>Log First Reading</Button>
        </div>
      )}
    </Card>
  );
}