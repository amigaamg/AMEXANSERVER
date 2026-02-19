'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/utils/api';
import PatientHeader from '@/components/patient/PatientHeader';
import BookingFlow from '@/components/patient/BookingFlow';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';
import type { Doctor } from '@/types/doctor';

export default function BookingPage() {
  const { doctorId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (doctorId) {
      api(`/api/doctors/${doctorId}`).then(setDoctor);
    }
  }, [doctorId]);

  if (!doctor) return <div>Loading...</div>;

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
        <BookingFlow doctor={doctor} onComplete={() => router.push('/dashboard/patient/appointments')} />
      </div>
    </div>
  );
}