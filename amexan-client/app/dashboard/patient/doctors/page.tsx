'use client';

import { useState } from 'react';
import DoctorDiscovery from '@/components/patient/DoctorDiscovery';
import PatientHeader from '@/components/patient/PatientHeader';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';

export default function DoctorsPage() {
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
        <DoctorDiscovery />
      </div>
    </div>
  );
}