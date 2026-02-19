'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/utils/api';
import TelemedicineRoom from '@/components/patient/TelemedicineRoom';
import PatientHeader from '@/components/patient/PatientHeader';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';

export default function ConsultationPage() {
  const { appointmentId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (appointmentId) {
      api(`/api/appointments/${appointmentId}`).then(setAppointment);
    }
  }, [appointmentId]);

  if (!appointment) return <div>Loading...</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <PatientHeader
        patient={db.patient!}
        unreadAlerts={0}
        unreadNotifications={0}
        onShowQR={() => {}}
        onShowNotifications={() => {}}
      />
      <TelemedicineRoom appointment={appointment} onEnd={() => router.push('/dashboard/patient/appointments')} />
    </div>
  );
}