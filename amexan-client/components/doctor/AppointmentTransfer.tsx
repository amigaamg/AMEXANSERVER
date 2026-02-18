import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { api } from '@/lib/utils/api';

interface AppointmentTransferProps {
  appointmentId: string;
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
}

export default function AppointmentTransfer({ appointmentId, patientId, onClose, onSuccess }: AppointmentTransferProps) {
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [reason, setReason] = useState('');
  const [refund, setRefund] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchDoctors = async () => {
    if (!doctorSearch) return;
    const res = await api(`/api/doctors/search?q=${doctorSearch}`);
    setDoctors(res);
  };

  const handleTransfer = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    try {
      await api(`/api/appointments/${appointmentId}/transfer`, {
        method: 'PUT',
        body: JSON.stringify({
          toDoctorId: selectedDoctor._id,
          reason,
          refund,
        }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Transfer Appointment" width={500}>
      <Input label="Find Doctor (name or specialty)" value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} />
      <Button onClick={searchDoctors} style={{ marginBottom: 12 }}>Search</Button>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
        {doctors.map(d => (
          <div
            key={d._id}
            onClick={() => setSelectedDoctor(d)}
            style={{
              padding: 8,
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              marginBottom: 4,
              cursor: 'pointer',
              background: selectedDoctor?._id === d._id ? '#eff6ff' : 'white',
            }}
          >
            Dr. {d.name} - {d.specialty}
          </div>
        ))}
      </div>
      <Input label="Reason for transfer" value={reason} onChange={e => setReason(e.target.value)} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input type="checkbox" checked={refund} onChange={e => setRefund(e.target.checked)} />
        <span>Process refund automatically</span>
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" onClick={handleTransfer} loading={loading}>Transfer</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}