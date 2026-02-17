import { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { api } from '@/lib/utils/api';

interface PatientHistoryProps {
  patientId: string;
}

export default function PatientHistory({ patientId }: PatientHistoryProps) {
  const [history, setHistory] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ pastMedical: '', familyHistory: '', allergies: '', medications: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api(`/api/patients/${patientId}/history`).then(setHistory).catch(console.error);
  }, [patientId]);

  const handleEdit = () => {
    if (history) {
      setForm({
        pastMedical: history.data.pastMedical || '',
        familyHistory: history.data.familyHistory || '',
        allergies: history.data.allergies?.join(', ') || '',
        medications: history.data.medications?.join(', ') || '',
      });
    }
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        allergies: form.allergies.split(',').map(s => s.trim()).filter(s => s),
        medications: form.medications.split(',').map(s => s.trim()).filter(s => s),
      };
      await api(`/api/patients/${patientId}/history`, {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
      setEditing(false);
      // refresh history
      const updated = await api(`/api/patients/${patientId}/history`);
      setHistory(updated);
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!history && !editing) return <Card>No history recorded yet. <Button onClick={handleEdit}>Create History</Button></Card>;

  if (editing) {
    return (
      <Card>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Edit Medical History</h4>
        <Input label="Past Medical" value={form.pastMedical} onChange={e => setForm(f => ({ ...f, pastMedical: e.target.value }))} />
        <Input label="Family History" value={form.familyHistory} onChange={e => setForm(f => ({ ...f, familyHistory: e.target.value }))} />
        <Input label="Allergies (comma separated)" value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} />
        <Input label="Current Medications (comma separated)" value={form.medications} onChange={e => setForm(f => ({ ...f, medications: e.target.value }))} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="primary" onClick={handleSave} loading={saving}>Save (signed)</Button>
          <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600 }}>Medical History (v{history.version})</h4>
        <Button variant="outline" onClick={handleEdit}>Edit</Button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Past Medical:</strong> {history.data.pastMedical}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Family History:</strong> {history.data.familyHistory}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Allergies:</strong> {history.data.allergies?.join(', ') || 'None'}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong>Medications:</strong> {history.data.medications?.join(', ') || 'None'}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>
        Last updated by Dr. {history.authorName} on {new Date(history.createdAt).toLocaleString()}<br />
        Signature: {history.signature?.slice(0, 20)}…
      </div>
    </Card>
  );
}