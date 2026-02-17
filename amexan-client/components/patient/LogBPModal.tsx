import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { bpCategory } from '@/lib/utils/bp';
import { api } from '@/lib/utils/api';

interface LogBPModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  onSaved: () => void;
}

export default function LogBPModal({ open, onClose, patientId, onSaved }: LogBPModalProps) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!systolic || !diastolic) return;
    setSaving(true);
    try {
      await api(`/api/patients/${patientId}/measurements`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'bp',
          systolic: Number(systolic),
          diastolic: Number(diastolic),
          pulse: pulse ? Number(pulse) : undefined,
          notes,
          recordedAt: new Date().toISOString(),
        }),
      });
      onSaved();
      onClose();
      setSystolic('');
      setDiastolic('');
      setPulse('');
      setNotes('');
    } catch {
      alert('Failed to save reading');
    } finally {
      setSaving(false);
    }
  };

  const sysNum = Number(systolic);
  const diaNum = Number(diastolic);
  const cat = sysNum && diaNum ? bpCategory(sysNum, diaNum) : null;

  return (
    <Modal open={open} onClose={onClose} title="Log Blood Pressure" width={420}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Input label="Systolic" type="number" placeholder="128" value={systolic} onChange={e => setSystolic(e.target.value)} />
        <Input label="Diastolic" type="number" placeholder="82" value={diastolic} onChange={e => setDiastolic(e.target.value)} />
      </div>
      <Input label="Pulse (optional)" type="number" placeholder="72" value={pulse} onChange={e => setPulse(e.target.value)} />
      <Input label="Notes" placeholder="Feeling dizzy..." value={notes} onChange={e => setNotes(e.target.value)} />

      {cat && (
        <div style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 8,
          background: cat.bg,
          border: `1px solid ${cat.color}`,
          color: cat.color,
          fontWeight: 600,
        }}>
          {cat.icon} {cat.label} – {sysNum >= 180 || diaNum >= 120 ? 'Seek emergency help' : sysNum >= 140 || diaNum >= 90 ? 'Monitor closely' : 'Good range'}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="primary" onClick={handleSave} loading={saving} style={{ flex: 1 }}>Save Reading</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}