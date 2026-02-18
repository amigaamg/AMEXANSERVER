import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Pill from '@/components/common/Pill';
import { api } from '@/lib/utils/api';
import type { Medication } from '@/types/patient';

interface PatientMedicationsProps {
  patientId: string;
  medications: Medication[];
  onUpdate: () => void;
}

export default function PatientMedications({ patientId, medications, onUpdate }: PatientMedicationsProps) {
  const [showPrescribe, setShowPrescribe] = useState(false);
  const [newMeds, setNewMeds] = useState({ name: '', dose: '', frequency: '', time: '' });
  const [saving, setSaving] = useState(false);

  const handlePrescribe = async () => {
    if (!newMeds.name || !newMeds.dose) return;
    setSaving(true);
    try {
      await api(`/api/patients/${patientId}/medications`, {
        method: 'POST',
        body: JSON.stringify(newMeds),
      });
      setShowPrescribe(false);
      setNewMeds({ name: '', dose: '', frequency: '', time: '' });
      onUpdate();
    } catch {
      alert('Failed to prescribe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Medications</h3>
        <Button
          variant="primary"
          style={{ padding: '4px 12px', fontSize: 12 }}
          onClick={() => setShowPrescribe(true)}
        >
          + Prescribe
        </Button>
      </div>

      {showPrescribe && (
        <div style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>New Prescription</h4>
          <Input label="Medication name" value={newMeds.name} onChange={e => setNewMeds(m => ({ ...m, name: e.target.value }))} />
          <Input label="Dose (e.g., 5mg)" value={newMeds.dose} onChange={e => setNewMeds(m => ({ ...m, dose: e.target.value }))} />
          <Input label="Frequency (e.g., Once daily)" value={newMeds.frequency} onChange={e => setNewMeds(m => ({ ...m, frequency: e.target.value }))} />
          <Input label="Time (e.g., 8:00 PM)" value={newMeds.time} onChange={e => setNewMeds(m => ({ ...m, time: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={handlePrescribe} loading={saving}>Prescribe</Button>
            <Button variant="outline" onClick={() => setShowPrescribe(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {medications.map(med => (
          <div key={med._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{med.name} {med.dose}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{med.frequency} · {med.scheduledTime}</div>
            </div>
            <div>
              <Pill color={med.stockDays <= 7 ? '#f97316' : '#22c55e'} bg={med.stockDays <= 7 ? '#fff7ed' : '#f0fdf4'}>
                {med.stockDays <= 7 ? `⚠️ ${med.stockDays}d left` : 'In stock'}
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}