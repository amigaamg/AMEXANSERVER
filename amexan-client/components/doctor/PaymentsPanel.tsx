import Card from '@/components/common/Card';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function PaymentsPanel({ earnings }) {
  if (!earnings) {
    return (
      <Card>
        <p style={{ color: '#94a3b8' }}>No earnings data yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Earnings Overview</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Today</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{formatCurrency(earnings.today || 0)}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>This Week</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{formatCurrency(earnings.week || 0)}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>This Month</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{formatCurrency(earnings.month || 0)}</div>
        </div>
      </div>
      <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recent Transactions</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(earnings.transactions || []).slice(0, 5).map(tx => (
          <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{tx.description}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{formatDate(tx.date)}</div>
            </div>
            <div style={{ fontWeight: 700, color: tx.amount > 0 ? '#22c55e' : '#ef4444' }}>
              {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}