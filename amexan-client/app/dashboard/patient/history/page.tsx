'use client';

import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';
import PatientHeader from '@/components/patient/PatientHeader';
import MedicalHistory from '@/components/patient/MedicalHistory';
import ClinicalSheet from '@/components/patient/ClinicalSheet';

export default function HistoryPage() {
  const { user } = useAuth();
  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PatientHeader
        patient={db.patient!}
        unreadAlerts={0}
        unreadNotifications={0}
        onShowQR={() => {}}
        onShowNotifications={() => {}}
      />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Medical History</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <MedicalHistory patientId={patientId} />
          <ClinicalSheet visits={db.visits} labs={db.labs} messages={db.messages} />
        </div>
      </div>
    </div>
  );
}