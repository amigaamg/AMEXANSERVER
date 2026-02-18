import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { api } from '@/lib/utils/api';
import type { ClinicService } from '@/types/patient';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  onBooked: () => void;
  services: ClinicService[];
}

export default function BookingModal({ open, onClose, patientId, onBooked, services }: BookingModalProps) {
  const [step, setStep] = useState<'triage' | 'services'>('triage');
  const [triage, setTriage] = useState({ symptom: '', duration: '', severity: '' });
  const [selectedService, setSelectedService] = useState<ClinicService | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const runTriage = () => {
    const s = triage.symptom.toLowerCase();
    const recommendation = s.includes('head') || s.includes('dizz') || s.includes('pressure')
      ? 'Hypertension Clinic'
      : 'General Medicine';
    alert(`Recommended: ${recommendation}`);
    setStep('services');
  };

  const handleBook = async () => {
    if (!selectedService || !date || !reason) return;
    setLoading(true);
    try {
      await api('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          clinicId: selectedService._id,
          clinicName: selectedService.name,
          specialty: selectedService.specialty,
          date,
          time,
          reason,
        }),
      });
      onBooked();
      onClose();
    } catch {
      alert('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Book Appointment" width={500}>
      {step === 'triage' ? (
        <>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Answer a few questions to get the right clinic.</p>
          <Input label="Main symptom" placeholder="e.g. headache" value={triage.symptom} onChange={e => setTriage(t => ({ ...t, symptom: e.target.value }))} />
          <Input label="Duration" placeholder="e.g. 3 days" value={triage.duration} onChange={e => setTriage(t => ({ ...t, duration: e.target.value }))} />
          <Input label="Severity" placeholder="mild / moderate / severe" value={triage.severity} onChange={e => setTriage(t => ({ ...t, severity: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={runTriage}>Get Recommendation</Button>
            <Button variant="outline" onClick={() => setStep('services')}>Skip</Button>
          </div>
        </>
      ) : (
        <>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Select a Service</h4>
          <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
            {services.filter(s => s.available).map(s => (
              <div
                key={s._id}
                onClick={() => setSelectedService(s)}
                style={{
                  padding: 12,
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  marginBottom: 6,
                  cursor: 'pointer',
                  background: selectedService?._id === s._id ? '#eff6ff' : 'white',
                }}
              >
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.specialty} · {s.doctors} doctors</div>
              </div>
            ))}
          </div>
          {selectedService && (
            <>
              <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
              <Input label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} />
              <Input label="Reason for visit" value={reason} onChange={e => setReason(e.target.value)} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button variant="primary" onClick={handleBook} loading={loading}>Confirm & Pay</Button>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}