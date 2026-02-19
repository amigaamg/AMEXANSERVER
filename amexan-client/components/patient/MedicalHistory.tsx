import { useEffect, useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface MedicalHistoryProps {
  patientId: string;
}

export default function MedicalHistory({ patientId }: MedicalHistoryProps) {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  api.get(`/patients/${patientId}/history`)
    .then(data => setHistory(Array.isArray(data) ? data : []))
    .catch(console.error)
    .finally(() => setLoading(false));
}, [patientId]);
  if (loading) return <Card><div>Loading history...</div></Card>;

  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Medical History</h3>
      {history ? (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>Past Medical</div>
            <div style={{ fontSize: 14, color: '#1e293b' }}>{history.data.pastMedical}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>Family History</div>
            <div style={{ fontSize: 14, color: '#1e293b' }}>{history.data.familyHistory}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>Allergies</div>
            <div style={{ fontSize: 14, color: '#1e293b' }}>{history.data.allergies?.join(', ') || 'None'}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>Current Medications</div>
            <div style={{ fontSize: 14, color: '#1e293b' }}>{history.data.medications?.join(', ') || 'None'}</div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 12 }}>
            Last updated by Dr. {history.authorName} (v{history.version}) on {new Date(history.createdAt).toLocaleDateString()}
            <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>Signature: {history.signature.slice(0, 16)}…</div>
          </div>
          <Button variant="outline" style={{ marginTop: 16, width: '100%' }}>Request Change</Button>
        </>
      ) : (
        <div style={{ color: '#94a3b8' }}>No medical history recorded yet.</div>
      )}
    </Card>
  );
}