import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface ChangeRequestModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  currentHistory: any;
}

export default function ChangeRequestModal({ open, onClose, patientId, currentHistory }: ChangeRequestModalProps) {
  const [field, setField] = useState('');
  const [proposedValue, setProposedValue] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api(`/api/patients/${patientId}/history/request-change`, {
        method: 'POST',
        body: JSON.stringify({
          field,
          currentValue: currentHistory?.data?.[field],
          proposedValue,
          reason,
        }),
      });
      alert('Change request sent to your doctor.');
      onClose();
    } catch (err) {
      alert('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Request Medical History Change" width={500}>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        Use this form to request a correction to your medical history. Your doctor will review and approve it.
      </p>
      <Input label="Field to change" value={field} onChange={e => setField(e.target.value)} placeholder="e.g., allergies, pastMedical" />
      <Input label="Proposed new value" value={proposedValue} onChange={e => setProposedValue(e.target.value)} multiline rows={3} />
      <Input label="Reason for change" value={reason} onChange={e => setReason(e.target.value)} multiline rows={2} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>Submit Request</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}