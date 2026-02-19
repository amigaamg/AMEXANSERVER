'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/utils/api';
import DoctorHeader from '@/components/doctor/DoctorHeader';
import PatientDetailPage from '@/components/doctor/PatientDetailPage';
import Spinner from '@/components/common/Spinner';

export default function PatientDetailRoute() {
  const { patientId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (patientId) {
      api(`/api/doctors/patients/${patientId}`)
        .then(setPatientData)
        .finally(() => setLoading(false));
    }
  }, [patientId]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== 'doctor') return null;
  if (!patientData) return <div>Patient not found</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <DoctorHeader doctor={user} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <PatientDetailPage patientData={patientData} onBack={() => router.back()} />
      </div>
    </div>
  );
}