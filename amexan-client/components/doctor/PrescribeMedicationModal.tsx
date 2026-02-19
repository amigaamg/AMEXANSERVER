import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface PrescribeMedicationModalProps {
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PrescribeMedicationModal({ patientId, onClose, onSuccess }: PrescribeMedicationModalProps) {
  const [form, setForm] = useState({
    name: '',
    dose: '',
    frequency: '',
    scheduledTime: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.dose || !form.frequency) return;
    setLoading(true);
    try {
      await api(`/api/patients/${patientId}/medications`, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      onSuccess();
      onClose();
    } catch {
      alert('Failed to prescribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Prescribe Medication" width={500}>
      <Input label="Medication Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      <Input label="Dose (e.g., 5mg)" value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} required />
      <Input label="Frequency (e.g., Once daily)" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} required />
      <Input label="Scheduled Time (e.g., 8:00 PM)" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))} />
      <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
      <Input label="End Date (optional)" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
      <Input label="Instructions" value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} multiline rows={2} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>Prescribe</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}