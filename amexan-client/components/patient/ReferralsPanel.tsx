import React, { useState, useEffect } from 'react';
import { api } from '@/lib/utils/api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatDate } from '@/lib/utils/format';
import type { Referral } from '@/types/condition';

interface ReferralsPanelProps {
  patientId: string;
}

export default function ReferralsPanel({ patientId }: ReferralsPanelProps) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/api/patients/${patientId}/referrals`).then(data => {
      setReferrals(data);
      setLoading(false);
    });
  }, [patientId]);

  const statusVariant: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
    pending: 'warning',
    accepted: 'info',
    completed: 'success',
    rejected: 'danger',
  };

  if (loading) return <div>Loading referrals...</div>;

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Referrals</h3>
      {referrals.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No referrals yet.</p>
      ) : (
        referrals.map(ref => (
          <div key={ref._id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>To: Dr. {ref.toDoctorId}</span>
              <Badge variant={statusVariant[ref.status]}>{ref.status}</Badge>
            </div>
            <p style={{ fontSize: 13, color: '#1e293b' }}>{ref.reason}</p>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Created: {formatDate(ref.createdAt)}</div>
          </div>
        ))
      )}
    </Card>
  );
}