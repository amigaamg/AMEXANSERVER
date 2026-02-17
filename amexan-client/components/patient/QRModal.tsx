import Modal from '@/components/common/Modal';
import type { Patient } from '@/types/patient';

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export default function QRModal({ open, onClose, patient }: QRModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Patient Smartcard" width={380}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 200,
          height: 200,
          margin: '0 auto 16px',
          background: '#f8fafc',
          borderRadius: 16,
          border: '2px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Placeholder QR code – replace with actual QR generation */}
          <svg width="160" height="160" viewBox="0 0 160 160">
            <rect x="0" y="0" width="160" height="160" fill="white" />
            {Array.from({ length: 20 }, (_, r) => Array.from({ length: 20 }, (_, c) => {
              const fill = Math.random() > 0.5;
              return fill ? <rect key={`${r}-${c}`} x={c*8} y={r*8} width={6} height={6} fill="#1e293b" /> : null;
            }))}
          </svg>
        </div>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{patient?.name}</h4>
        <div style={{ fontFamily: 'monospace', color: '#2563eb', fontSize: 14, margin: '4px 0' }}>
          {patient?.universalId}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: 8 }}>
            <div style={{ fontSize: 10, color: '#64748b' }}>Blood Type</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{patient?.bloodType || '—'}</div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: 8 }}>
            <div style={{ fontSize: 10, color: '#64748b' }}>Condition</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{patient?.condition || 'Hypertension'}</div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 16 }}>
          Present this QR at any AMEXAN facility for instant check‑in.
        </p>
      </div>
    </Modal>
  );
}