import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import Input from '@/components/common/Input';
import { api } from '@/lib/utils/api';
import { formatDate } from '@/lib/utils/date';
import type { Payment } from '@/types/patient';

interface PaymentsPanelProps {
  payments: Payment[];
  patientId: string;
  onUpdate: () => void;
}

export default function PaymentsPanel({ payments, patientId, onUpdate }: PaymentsPanelProps) {
  const [showMpesa, setShowMpesa] = useState(false);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const owed = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const statusStyles = {
    paid: { color: '#22c55e', bg: '#f0fdf4' },
    pending: { color: '#f59e0b', bg: '#fffbeb' },
    failed: { color: '#ef4444', bg: '#fef2f2' },
    refunded: { color: '#64748b', bg: '#f1f5f9' },
  };

  const initiateMpesa = async () => {
    if (!phone || !amount) return;
    setLoading(true);
    try {
      await api('/api/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          phone: phone.replace(/^0/, '254'),
          amount: Number(amount),
          description: 'AMEXAN Medical Payment',
        }),
      });
      alert(`✅ M-Pesa request sent to ${phone}. Enter your PIN to complete.`);
      setShowMpesa(false);
      setPhone('');
      setAmount('');
      onUpdate();
    } catch {
      alert('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Payments & Receipts</h3>
      {owed > 0 && (
        <div style={{
          marginBottom: 16,
          padding: 16,
          background: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#b45309' }}>Outstanding Balance</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#b45309' }}>KES {owed.toLocaleString()}</div>
          </div>
          <Button variant="success" onClick={() => setShowMpesa(true)}>Pay Now</Button>
        </div>
      )}

      {showMpesa && (
        <div style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>M-Pesa Payment</h4>
          <Input label="Phone number" placeholder="07xxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input label="Amount (KES)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="success" onClick={initiateMpesa} loading={loading}>Send M-Pesa Request</Button>
            <Button variant="outline" onClick={() => setShowMpesa(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {payments.slice(0, 10).map(p => (
          <div key={p._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #f1f5f9',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.description}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {formatDate(p.createdAt)} · {p.method} · #{p.reference}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>KES {p.amount.toLocaleString()}</div>
              <Pill color={statusStyles[p.status]?.color} bg={statusStyles[p.status]?.bg}>
                {p.status}
              </Pill>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}