import React from 'react';
import Card from '@/components/common/Card';
import QRCode from 'qrcode.react';
import type { Patient } from '@/types/patient';

interface SmartcardDisplayProps {
  patient: Patient;
  size?: number;
  showQR?: boolean;
}

export default function SmartcardDisplay({ patient, size = 200, showQR = true }: SmartcardDisplayProps) {
  const cardData = {
    name: patient.name,
    universalId: patient.universalId,
    dob: patient.dob,
    bloodType: patient.bloodType,
    allergies: patient.allergies,
    emergencyContact: patient.emergencyContact,
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>AMEXAN Smartcard</h3>
      {showQR && (
        <div style={{ marginBottom: 20 }}>
          <QRCode value={JSON.stringify(cardData)} size={size} />
        </div>
      )}
      <p style={{ fontSize: 18, fontWeight: 600 }}>{patient.name}</p>
      <p style={{ color: '#64748b', fontFamily: 'monospace' }}>{patient.universalId}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
        <div><strong>DOB</strong><br />{patient.dob || '—'}</div>
        <div><strong>Blood Type</strong><br />{patient.bloodType || '—'}</div>
        <div><strong>Allergies</strong><br />{patient.allergies?.join(', ') || 'None'}</div>
        <div><strong>Emergency</strong><br />{patient.emergencyContact || '—'}</div>
      </div>
    </Card>
  );
}