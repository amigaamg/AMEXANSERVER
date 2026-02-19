import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { api } from '@/lib/utils/api';

export default function ReferralModal({ patientId, onClose, onSuccess }) {
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('routine');
  const [sending, setSending] = useState(false);

  const searchDoctors = async () => {
    if (!doctorSearch) return;
    const res = await api(`/api/doctors/search?q=${doctorSearch}`);
    setDoctors(res);
  };

  const sendReferral = async () => {
    if (!selectedDoctor || !reason) return;
    setSending(true);
    try {
      await api('/api/referrals', {
        method: 'POST',
        body: JSON.stringify({ patientId, toDoctorId: selectedDoctor._id, reason, priority }),
      });
      onSuccess();
      onClose();
    } catch {
      alert('Referral failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Refer Patient" width={500}>
      <Input label="Search doctor (name or specialty)" value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} />
      <Button onClick={searchDoctors} style={{ marginBottom: 12 }}>Search</Button>

      <div style={{ maxHeight: 150, overflowY: 'auto', marginBottom: 12 }}>
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

      <Input label="Reason for referral" value={reason} onChange={e => setReason(e.target.value)} />
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 12 }}>
          <input type="radio" value="routine" checked={priority === 'routine'} onChange={e => setPriority(e.target.value)} /> Routine
        </label>
        <label>
          <input type="radio" value="urgent" checked={priority === 'urgent'} onChange={e => setPriority(e.target.value)} /> Urgent
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" onClick={sendReferral} loading={sending}>Send Referral</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}