import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import { bpCategory } from '@/lib/utils/bp';
import { timeAgo } from '@/lib/utils/date';
import { Measurement } from '@/types/patient';

interface HealthSnapshotProps {
  measurements?: Measurement[]; // ✅ FIX: marked optional so TypeScript knows it can be undefined
  onLogBP: () => void;
}

// ✅ FIX: Default `measurements` to [] so .filter() never runs on undefined
export default function HealthSnapshot({ measurements = [], onLogBP }: HealthSnapshotProps) {
  const bpReadings = measurements
    .filter(m => m.type === 'bp')
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  const latest = bpReadings[0];
  const cat = latest ? bpCategory(latest.systolic!, latest.diastolic!) : null;

  // Simple sparkline (can be replaced with proper chart later)
  const sparkline = bpReadings.slice(0, 7).reverse().map((r, i) => (
    <div
      key={i}
      style={{
        flex: 1,
        height: `${(r.systolic! / 200) * 100}%`,
        background: cat?.color || '#2563eb',
        borderRadius: 2,
      }}
    />
  ));

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Health Snapshot</h3>
        {cat && <Pill color={cat.color} bg={cat.bg}>{cat.icon} {cat.label}</Pill>}
      </div>

      {latest ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: cat?.color || '#1e293b', lineHeight: 1 }}>
              {latest.systolic}/{latest.diastolic}
            </span>
            <span style={{ color: '#64748b', fontSize: 14 }}>mmHg</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            {latest.pulse && `Pulse ${latest.pulse} bpm · `}{timeAgo(latest.recordedAt)}
          </div>
          {bpReadings.length > 1 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 2, height: 48, alignItems: 'flex-end' }}>
                {sparkline}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 11, marginTop: 4 }}>
                <span>Last {Math.min(7, bpReadings.length)} readings</span>
                <span>{cat?.label === 'Controlled' ? '✅ Good' : '⚠️ Needs attention'}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
          <p>No recent readings</p>
        </div>
      )}

      <Button variant="primary" onClick={onLogBP} style={{ width: '100%', marginTop: 16 }}>
        {latest ? '+ Log New Reading' : 'Log First Reading'}
      </Button>
    </Card>
  );
}