'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/utils/api';
import PatientHeader from '@/components/patient/PatientHeader';
import AppointmentDetailModal from '@/components/patient/AppointmentDetailModal';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (id) {
      api(`/api/appointments/${id}`).then(setAppointment);
    }
  }, [id]);

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
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <AppointmentDetailModal
          open={true}
          onClose={() => router.back()}
          appointment={appointment}
          onCancel={() => router.back()}
          onReschedule={() => {}}
        />
      </div>
    </div>
  );
}