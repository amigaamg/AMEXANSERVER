import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface VisitNoteFormProps {
  patientId: string;
  appointmentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VisitNoteForm({ patientId, appointmentId, onClose, onSuccess }: VisitNoteFormProps) {
  const [form, setForm] = useState({
    reason: '',
    findings: '',
    diagnosis: '',
    treatment: '',
    orders: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.reason || !form.diagnosis) return;
    setLoading(true);
    try {
      await api('/api/visits', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          appointmentId,
          ...form,
          orders: form.orders.split('\n').map(s => s.trim()).filter(s => s),
        }),
      });
      onSuccess();
      onClose();
    } catch {
      alert('Failed to save visit note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Add Visit Note" width={600}>
      <Input label="Reason for Visit" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required />
      <Input label="Findings" value={form.findings} onChange={e => setForm(f => ({ ...f, findings: e.target.value }))} multiline rows={3} />
      <Input label="Diagnosis" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} required />
      <Input label="Treatment" value={form.treatment} onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))} multiline rows={2} />
      <Input label="Orders (one per line)" value={form.orders} onChange={e => setForm(f => ({ ...f, orders: e.target.value }))} multiline rows={3} />
      <Input label="Additional Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline rows={2} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>Save Note</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}