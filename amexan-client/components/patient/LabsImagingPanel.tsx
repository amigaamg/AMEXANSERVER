import Card from '@/components/common/Card';
import Pill from '@/components/common/Pill';
import Button from '@/components/common/Button';
import { formatDate } from '@/lib/utils/date';
import type { Lab, ImagingStudy } from '@/types/patient';

interface LabsImagingPanelProps {
  labs: Lab[];
  imaging: ImagingStudy[];
  expanded?: boolean;
}

export default function LabsImagingPanel({ labs, imaging, expanded }: LabsImagingPanelProps) {
  const statusStyles = {
    normal:   { color: '#22c55e', bg: '#f0fdf4' },
    warning:  { color: '#f59e0b', bg: '#fffbeb' },
    critical: { color: '#ef4444', bg: '#fef2f2' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Labs */}
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Lab Results</h3>
        {labs.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No lab results available.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {labs.slice(0, expanded ? undefined : 4).map(lab => (
              <div key={lab._id} style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{lab.name}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: statusStyles[lab.status]?.color || '#1e293b' }}>
                  {lab.value} <span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>{lab.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <Pill color={statusStyles[lab.status]?.color} bg={statusStyles[lab.status]?.bg}>
                    {lab.status}
                  </Pill>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{formatDate(lab.date)}</span>
                </div>
                {lab.trend && (
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    {lab.trend === 'rising' ? '↑ Rising' : lab.trend === 'improving' ? '↓ Falling' : '→ Stable'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Imaging */}
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Imaging Studies</h3>
        {imaging.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No imaging records found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {imaging.slice(0, expanded ? undefined : 4).map(img => (
              <div key={img._id} style={{ background: '#f8fafc', borderRadius: 12, padding: 12, border: '1px solid #e2e8f0' }}>
                {img.thumbnailUrl && (
                  <img
                    src={img.thumbnailUrl}
                    alt={img.type}
                    style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                  />
                )}
                <div style={{ fontWeight: 600, fontSize: 14 }}>{img.type}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{formatDate(img.date)}</div>
                <div style={{ marginTop: 8 }}>
                  <Pill
                    color={img.status === 'completed' ? '#22c55e' : '#f59e0b'}
                    bg={img.status === 'completed' ? '#f0fdf4' : '#fffbeb'}
                  >
                    {img.status}
                  </Pill>
                </div>
                {img.fullUrl && (
                  <Button
                    variant="outline"
                    style={{ marginTop: 8, width: '100%', padding: '4px 12px', fontSize: 12 }}
                    onClick={() => window.open(img.fullUrl!, '_blank')}
                  >
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}