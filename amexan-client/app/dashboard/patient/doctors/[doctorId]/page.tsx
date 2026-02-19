'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import PatientHeader from '@/components/patient/PatientHeader';
import DoctorProfileModal from '@/components/patient/DoctorProfileModal';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';
import type { Doctor } from '@/types/doctor';

export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (doctorId) {
      api(`/api/doctors/${doctorId}`).then(setDoctor);
    }
  }, [doctorId]);

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
        {doctor && <DoctorProfileModal open={true} onClose={() => {}} doctor={doctor} />}
      </div>
    </div>
  );
}