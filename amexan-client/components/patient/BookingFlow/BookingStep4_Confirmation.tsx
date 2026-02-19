import React from 'react';
import Button from '@/components/common/Button';

interface BookingStep4Props {
  onComplete: () => void;
}

export default function BookingStep4_Confirmation({ onComplete }: BookingStep4Props) {
  return (
    <div style={{ textAlign: 'center', padding: 24 }}>
      <span style={{ fontSize: 48 }}>✅</span>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 16 }}>Booking Confirmed!</h3>
      <p style={{ color: '#64748b', marginTop: 8 }}>Your appointment has been booked and payment is confirmed.</p>
      <Button variant="primary" onClick={onComplete} style={{ marginTop: 24 }}>View Appointments</Button>
    </div>
  );
}