import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { SPECIALTIES } from '@/lib/config/specialties';

interface TriageModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (recommendedSpecialty: string) => void;
}

export default function TriageModal({ open, onClose, onComplete }: TriageModalProps) {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [step, setStep] = useState(1);

  const runTriage = () => {
    const s = symptoms.toLowerCase();
    let matched = SPECIALTIES.find(spec =>
      spec.triageKeywords.some(keyword => s.includes(keyword))
    );
    const rec = matched?.name || 'General Medicine';
    onComplete(rec);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Symptom Check" width={500}>
      {step === 1 && (
        <>
          <p style={{ color: '#64748b', marginBottom: 16 }}>Help us direct you to the right specialist.</p>
          <Input label="What are your main symptoms?" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g., headache, chest pain" />
          <Input label="How long have you had them?" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 3 days, 2 weeks" />
          <Input label="Severity (mild/moderate/severe)" value={severity} onChange={e => setSeverity(e.target.value)} placeholder="mild" />
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button variant="primary" onClick={() => setStep(2)}>Continue</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <p>Based on your symptoms, we recommend:</p>
          <div style={{ padding: 16, background: '#eff6ff', borderRadius: 8, marginBottom: 16 }}>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>{SPECIALTIES.find(spec => spec.triageKeywords.some(k => symptoms.toLowerCase().includes(k)))?.name || 'General Medicine'}</span>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>We'll show you doctors in this specialty. You can still browse others.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={runTriage}>Continue</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </>
      )}
    </Modal>
  );
}