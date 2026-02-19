'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/utils/api';
import DoctorHeader from '@/components/doctor/DoctorHeader';
import AppointmentDetail from '@/components/doctor/AppointmentDetail'; // we need this component
import Spinner from '@/components/common/Spinner';

export default function AppointmentDetailRoute() {
  const { appointmentId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (appointmentId) {
      api(`/api/appointments/${appointmentId}`)
        .then(setAppointment)
        .finally(() => setLoading(false));
    }
  }, [appointmentId]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== 'doctor') return null;
  if (!appointment) return <div>Appointment not found</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <DoctorHeader doctor={user} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <AppointmentDetail appointment={appointment} onBack={() => router.back()} />
      </div>
    </div>
  );
}