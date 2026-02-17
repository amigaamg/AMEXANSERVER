import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import { api } from '@/lib/utils/api';
import type { Medication } from '@/types/patient';

interface MedicationsPanelProps {
  medications: Medication[];
  patientId: string;
  onUpdate: () => void;
  expanded?: boolean;
}

export default function MedicationsPanel({ medications, patientId, onUpdate, expanded }: MedicationsPanelProps) {
  const [taken, setTaken] = useState<Record<string, boolean>>({});
  const [requestingRefill, setRequestingRefill] = useState<string | null>(null);

  const toggleTaken = async (medId: string, current: boolean) => {
    setTaken(prev => ({ ...prev, [medId]: !current }));
    try {
      await api(`/api/patients/${patientId}/medications/${medId}/toggle`, { method: 'POST' });
      onUpdate();
    } catch {
      setTaken(prev => ({ ...prev, [medId]: current }));
    }
  };

  const requestRefill = async (medId: string) => {
    setRequestingRefill(medId);
    try {
      await api(`/api/patients/${patientId}/medications/${medId}/refill`, { method: 'POST' });
      alert('Refill requested. Your doctor will be notified.');
    } catch {
      alert('Failed to request refill.');
    } finally {
      setRequestingRefill(null);
    }
  };

  const total = medications.length;
  const takenCount = medications.filter(m => taken[m._id] ?? m.takenToday).length;
  const adherence = total > 0 ? Math.round((takenCount / total) * 100) : 0;

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Today's Medications</h3>
      {total > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 4 }}>
            <span>Adherence today</span>
            <span style={{ fontWeight: 700, color: adherence >= 80 ? '#22c55e' : adherence >= 50 ? '#f59e0b' : '#ef4444' }}>
              {adherence}%
            </span>
          </div>
          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${adherence}%`, borderRadius: 99, background: adherence >= 80 ? '#22c55e' : adherence >= 50 ? '#f59e0b' : '#ef4444' }} />
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {medications.slice(0, expanded ? undefined : 3).map(med => {
          const isTaken = taken[med._id] ?? med.takenToday;
          return (
            <div key={med._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div
                onClick={() => toggleTaken(med._id, isTaken)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: `2px solid ${isTaken ? '#22c55e' : '#cbd5e1'}`,
                  background: isTaken ? '#22c55e' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {isTaken && <span style={{ color: 'white', fontSize: 16 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {med.name} <span style={{ fontWeight: 400, color: '#64748b' }}>{med.dose}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{med.frequency} · {med.scheduledTime}</div>
              </div>
              {med.stockDays <= 7 && (
                <Pill color="#f97316" bg="#fff7ed">
                  ⚠️ {med.stockDays} days left
                </Pill>
              )}
              <Button
                variant="text"
                size="sm"
                onClick={() => requestRefill(med._id)}
                disabled={requestingRefill === med._id}
              >
                Refill
              </Button>
            </div>
          );
        })}
      </div>
      {!expanded && medications.length > 3 && (
        <button style={{ marginTop: 12, color: '#2563eb', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
          View all {medications.length} medications →
        </button>
      )}
    </Card>
  );
}