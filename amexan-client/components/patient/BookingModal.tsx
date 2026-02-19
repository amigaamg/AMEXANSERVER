'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import api from '@/lib/utils/api';                  // ✅ default import (not named)
import type { DoctorService } from '@/types/services';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  onBooked: () => void;
  services?: DoctorService[] | null;                // ✅ optional + nullable
  preselectedService?: DoctorService | null;        // ✅ from DoctorCard "Book" button
}

export default function BookingModal({
  open,
  onClose,
  patientId,
  onBooked,
  services,
  preselectedService,
}: BookingModalProps) {
  // ✅ Normalise to array once — prevents .filter/.map crashes no matter what the API returns
  const safeServices: DoctorService[] = Array.isArray(services) ? services : [];

  const [step, setStep] = useState<'triage' | 'services' | 'confirm'>('triage');
  const [triage, setTriage] = useState({ symptom: '', duration: '', severity: '' });
  const [selectedService, setSelectedService] = useState<DoctorService | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState<'in-person' | 'telemedicine'>('in-person');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-select service when coming from a DoctorCard
  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
      setStep('confirm');
    }
  }, [preselectedService]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep(preselectedService ? 'confirm' : 'triage');
      setTriage({ symptom: '', duration: '', severity: '' });
      if (!preselectedService) setSelectedService(null);
      setDate('');
      setTime('');
      setReason('');
      setError('');
    }
  }, [open, preselectedService]);

  // ── Triage logic ────────────────────────────────────────────────────────
  const runTriage = () => {
    const s = triage.symptom.toLowerCase();
    let recommendation = 'General Medicine';
    if (s.includes('head') || s.includes('dizz') || s.includes('pressure') || s.includes('bp')) recommendation = 'Cardiology';
    else if (s.includes('sugar') || s.includes('diabetes') || s.includes('glucose')) recommendation = 'Endocrinology';
    else if (s.includes('breath') || s.includes('asthma') || s.includes('lung')) recommendation = 'Pulmonology';
    else if (s.includes('skin') || s.includes('rash') || s.includes('itch')) recommendation = 'Dermatology';
    else if (s.includes('bone') || s.includes('joint') || s.includes('knee')) recommendation = 'Orthopedics';
    else if (s.includes('mental') || s.includes('anxiety') || s.includes('depress')) recommendation = 'Mental Health';

    if (triage.severity === 'severe') {
      setError('⚠️ Severe symptoms — please go to A&E or call emergency services immediately.');
      return;
    }
    setError(`💡 Recommended specialty: ${recommendation}`);
    setStep('services');
  };

  // ── Book ─────────────────────────────────────────────────────────────────
  const handleBook = async () => {
    if (!selectedService || !date || !reason) {
      setError('Please fill in date and reason for visit.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // ✅ api.post() — not bare api() call, no /api prefix (handled by API_BASE)
      await api.post('/appointments', {
        patientId,
        doctorId: selectedService.doctorId,
        doctorName: selectedService.doctorName,
        serviceId: selectedService._id,
        clinicName: selectedService.clinic ?? selectedService.name,
        specialty: selectedService.specialty,
        date,
        time,
        reason,
        type,
        fee: selectedService.fee,
      });
      onBooked();
      onClose();
    } catch (err: any) {
      setError(err.message ?? 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Available services — match DoctorService field name ─────────────────
  const availableServices = safeServices.filter(
    s => s.isAvailableNow || s.nextSlot   // ✅ uses correct field (not s.available)
  );

  // Minimum date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal open={open} onClose={onClose} title="Book Appointment" width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Step indicator ─────────────────────────────────────────────── */}
        {!preselectedService && (
          <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
            {(['triage', 'services', 'confirm'] as const).map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: step === s ? '#2563eb' : ((['triage', 'services', 'confirm'].indexOf(step) > i) ? '#22c55e' : '#e2e8f0'),
                  color: step === s || (['triage', 'services', 'confirm'].indexOf(step) > i) ? 'white' : '#94a3b8',
                }}>
                  {['triage', 'services', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1, height: 2, background: ['triage', 'services', 'confirm'].indexOf(step) > i ? '#22c55e' : '#e2e8f0', display: i < 2 ? 'block' : 'none', marginLeft: 4 }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Error / Info banner ─────────────────────────────────────────── */}
        {error && (
          <div style={{ background: error.startsWith('⚠️') ? '#fef2f2' : '#eff6ff', border: `1px solid ${error.startsWith('⚠️') ? '#fecaca' : '#bfdbfe'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: error.startsWith('⚠️') ? '#dc2626' : '#1d4ed8' }}>
            {error}
          </div>
        )}

        {/* ── STEP 1: Triage ─────────────────────────────────────────────── */}
        {step === 'triage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              Answer a few quick questions and we'll guide you to the right specialist.
            </p>
            <Input
              label="Main symptom"
              placeholder="e.g. persistent headache, chest pain…"
              value={triage.symptom}
              onChange={e => setTriage(t => ({ ...t, symptom: e.target.value }))}
            />
            <Input
              label="How long have you had this?"
              placeholder="e.g. 3 days, 2 weeks…"
              value={triage.duration}
              onChange={e => setTriage(t => ({ ...t, duration: e.target.value }))}
            />
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Severity</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['mild', 'moderate', 'severe'].map(sev => (
                  <button key={sev} onClick={() => setTriage(t => ({ ...t, severity: sev }))} style={{
                    flex: 1, padding: '9px 0', borderRadius: 10, border: '1.5px solid',
                    borderColor: triage.severity === sev ? (sev === 'severe' ? '#dc2626' : sev === 'moderate' ? '#f59e0b' : '#22c55e') : '#e2e8f0',
                    background: triage.severity === sev ? (sev === 'severe' ? '#fef2f2' : sev === 'moderate' ? '#fffbeb' : '#f0fdf4') : 'white',
                    color: triage.severity === sev ? (sev === 'severe' ? '#dc2626' : sev === 'moderate' ? '#d97706' : '#16a34a') : '#64748b',
                    fontWeight: triage.severity === sev ? 700 : 500, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize',
                  }}>{sev}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Button variant="primary" onClick={runTriage}>Get Recommendation →</Button>
              <Button variant="outline" onClick={() => setStep('services')}>Skip Triage</Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Choose Service ──────────────────────────────────────── */}
        {step === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#64748b' }}>Select a doctor or clinic to book with.</p>

            {safeServices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔭</div>
                <p style={{ fontSize: 14 }}>No services available right now.</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Check back soon or use the Discover tab to find doctors.</p>
              </div>
            ) : (
              <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {safeServices.map(s => (
                  <div
                    key={s._id}
                    onClick={() => setSelectedService(s)}
                    style={{
                      padding: '12px 14px',
                      border: `1.5px solid ${selectedService?._id === s._id ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      background: selectedService?._id === s._id ? '#eff6ff' : 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Dr. {s.doctorName}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: s.isAvailableNow ? '#dcfce7' : '#f1f5f9', color: s.isAvailableNow ? '#16a34a' : '#94a3b8' }}>
                        {s.isAvailableNow ? '● Available' : 'Next slot'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{s.specialty} · {s.clinic ?? 'Private Practice'}</div>
                    <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, marginTop: 4 }}>KES {s.fee?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" onClick={() => setStep('triage')}>← Back</Button>
              {selectedService && (
                <Button variant="primary" onClick={() => setStep('confirm')}>Continue →</Button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm & Pay ───────────────────────────────────────── */}
        {step === 'confirm' && selectedService && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Selected doctor summary */}
            <div style={{ background: '#f8fafc', borderRadius: 14, padding: '14px 16px', border: '1.5px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Dr. {selectedService.doctorName}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{selectedService.specialty} · {selectedService.clinic ?? 'Private Practice'}</div>
              <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 700, marginTop: 4 }}>KES {selectedService.fee?.toLocaleString()}</div>
            </div>

            {/* Visit type toggle */}
            {(selectedService.serviceType === 'both' || selectedService.serviceType === 'telemedicine') && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Visit Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['in-person', 'telemedicine'] as const).map(t => (
                    <button key={t} onClick={() => setType(t)} style={{
                      flex: 1, padding: '9px 0', borderRadius: 10, border: `1.5px solid ${type === t ? '#2563eb' : '#e2e8f0'}`,
                      background: type === t ? '#eff6ff' : 'white', color: type === t ? '#2563eb' : '#64748b',
                      fontWeight: type === t ? 700 : 500, fontSize: 13, cursor: 'pointer',
                    }}>
                      {t === 'in-person' ? '🏥 In-Person' : '📡 Telemedicine'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Input label="Preferred Date" type="date" value={date} onChange={e => setDate(e.target.value)} min={today} />
            <Input label="Preferred Time" type="time" value={time} onChange={e => setTime(e.target.value)} />
            <Input label="Reason for visit" placeholder="Brief description of your concern…" value={reason} onChange={e => setReason(e.target.value)} />

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {!preselectedService && (
                <Button variant="outline" onClick={() => setStep('services')}>← Back</Button>
              )}
              <Button
                variant="primary"
                onClick={handleBook}
                loading={loading}
                style={{ flex: 1 }}
              >
                ✓ Confirm & Pay — KES {selectedService.fee?.toLocaleString()}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}