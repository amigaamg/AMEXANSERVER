import React, { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface BookingStep3Props {
  amount: number;
  patientId: string;
  onNext: () => void;
  onPrev: () => void;
}

export default function BookingStep3_Payment({ amount, patientId, onNext, onPrev }: BookingStep3Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api('/api/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          phone: phone.replace(/^0/, '254'),
          amount,
          description: 'Appointment booking',
        }),
      });
      onNext();
    } catch (err) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Payment</h3>
      <p style={{ marginBottom: 16 }}>Amount: KES {amount}</p>
      <Input label="M-Pesa Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07xxxxxxxx" />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button variant="success" onClick={handlePayment} loading={loading}>Pay Now</Button>
      </div>
    </div>
  );
}