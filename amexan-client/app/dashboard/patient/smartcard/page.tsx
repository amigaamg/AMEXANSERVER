'use client';

import { useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';
import PatientHeader from '@/components/patient/PatientHeader';
import Button from '@/components/common/Button';
import QRCode from 'qrcode.react';

export default function SmartcardPage() {
  const { user } = useAuth();
  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && qrRef.current) {
      printWindow.document.write(`
        <html>
          <head><title>AMEXAN Smartcard</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 40px;">
            ${qrRef.current.outerHTML}
          </body>
        </html>
      `);
      printWindow.print();
    }
  };

  if (!db.patient) return null;

  const smartcardData = {
    name: db.patient.name,
    universalId: db.patient.universalId,
    dob: db.patient.dob,
    bloodType: db.patient.bloodType,
    allergies: db.patient.allergies,
    emergencyContact: db.patient.emergencyContact,
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PatientHeader
        patient={db.patient}
        unreadAlerts={0}
        unreadNotifications={0}
        onShowQR={() => {}}
        onShowNotifications={() => {}}
      />
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div ref={qrRef}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>AMEXAN Smartcard</h2>
          <div style={{ marginBottom: 20 }}>
            <QRCode value={JSON.stringify(smartcardData)} size={200} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 600 }}>{db.patient.name}</p>
          <p style={{ color: '#64748b', fontFamily: 'monospace' }}>{db.patient.universalId}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
            <div><strong>DOB</strong><br />{db.patient.dob || '—'}</div>
            <div><strong>Blood Type</strong><br />{db.patient.bloodType || '—'}</div>
            <div><strong>Allergies</strong><br />{db.patient.allergies?.join(', ') || 'None'}</div>
            <div><strong>Emergency</strong><br />{db.patient.emergencyContact || '—'}</div>
          </div>
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="primary" onClick={handlePrint}>Print / Download</Button>
          <Button variant="outline" onClick={() => window.print()}>Print</Button>
        </div>
      </div>
    </div>
  );
}