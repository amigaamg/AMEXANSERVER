import { useState } from 'react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

export default function PatientHistoryEditor({ patientId, initialHistory, onUpdate }) {
  const [history, setHistory] = useState(initialHistory?.data || {
    pastMedical: '',
    familyHistory: '',
    socialHistory: '',
    allergies: [],
    medications: [],
  });
  const [version, setVersion] = useState(initialHistory?.version || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...history,
        allergies: Array.isArray(history.allergies) ? history.allergies : history.allergies.split(',').map(s => s.trim()).filter(s => s),
        medications: Array.isArray(history.medications) ? history.medications : history.medications.split(',').map(s => s.trim()).filter(s => s),
      };
      const res = await api(`/api/patients/${patientId}/history`, {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
      setVersion(res.version);
      onUpdate?.();
    } catch (err) {
      alert('Failed to save history');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600 }}>Medical History {version > 0 ? `(v${version})` : ''}</h4>
      </div>
      <Input label="Past Medical" value={history.pastMedical} onChange={e => setHistory(h => ({ ...h, pastMedical: e.target.value }))} />
      <Input label="Family History" value={history.familyHistory} onChange={e => setHistory(h => ({ ...h, familyHistory: e.target.value }))} />
      <Input label="Social History" value={history.socialHistory} onChange={e => setHistory(h => ({ ...h, socialHistory: e.target.value }))} />
      <Input label="Allergies (comma separated)" value={Array.isArray(history.allergies) ? history.allergies.join(', ') : history.allergies} onChange={e => setHistory(h => ({ ...h, allergies: e.target.value }))} />
      <Input label="Medications (comma separated)" value={Array.isArray(history.medications) ? history.medications.join(', ') : history.medications} onChange={e => setHistory(h => ({ ...h, medications: e.target.value }))} />
      <Button variant="primary" onClick={handleSave} loading={saving} style={{ marginTop: 12 }}>Save (signed)</Button>
    </Card>
  );
}