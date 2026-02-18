import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import type { CareTeamMember } from '@/types/patient';

interface CareTeamProps {
  members: CareTeamMember[];
}

export default function CareTeam({ members }: CareTeamProps) {
  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>My Care Team</h3>
      {members.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No care team assigned yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {members.map(m => (
            <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
              }}>
                {m.avatar || m.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>Dr. {m.name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{m.role} • {m.specialty}</div>
              </div>
              <Button variant="outline" style={{ padding: '4px 10px', fontSize: 14 }}>💬</Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}