import React from 'react';
import Input from '@/components/common/Input';

interface BookingStep2Props {
  reason: string;
  notes: string;
  onReasonChange: (val: string) => void;
  onNotesChange: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function BookingStep2_Reason({ reason, notes, onReasonChange, onNotesChange, onNext, onPrev }: BookingStep2Props) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Reason for Visit</h3>
      <Input label="Reason" value={reason} onChange={e => onReasonChange(e.target.value)} required />
      <Input label="Additional Notes (optional)" value={notes} onChange={e => onNotesChange(e.target.value)} multiline rows={3} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={onPrev}>Back</button>
        <button onClick={onNext} disabled={!reason}>Next</button>
      </div>
    </div>
  );
}