import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface OrderImagingModalProps {
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderImagingModal({ patientId, onClose, onSuccess }: OrderImagingModalProps) {
  const [form, setForm] = useState({
    type: '',
    notes: '',
    priority: 'routine',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.type) return;
    setLoading(true);
    try {
      await api(`/api/patients/${patientId}/imaging`, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      onSuccess();
      onClose();
    } catch {
      alert('Failed to order imaging');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Order Imaging" width={500}>
      <Input label="Imaging Type (e.g., X-ray Chest)" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required />
      <Input label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline rows={2} />
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 12 }}><input type="radio" value="routine" checked={form.priority === 'routine'} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} /> Routine</label>
        <label><input type="radio" value="urgent" checked={form.priority === 'urgent'} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} /> Urgent</label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>Order Imaging</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}