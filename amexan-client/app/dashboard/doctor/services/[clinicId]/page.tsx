'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/utils/api';
import DoctorHeader from '@/components/doctor/DoctorHeader';
import ServiceForm from '@/components/doctor/ServiceForm'; // we need this component
import Spinner from '@/components/common/Spinner';

export default function EditServicePage() {
  const { clinicId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (clinicId) {
      api(`/api/clinics/${clinicId}`)
        .then(setService)
        .finally(() => setLoading(false));
    }
  }, [clinicId]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== 'doctor') return null;
  if (!service) return <div>Service not found</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <DoctorHeader doctor={user} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <ServiceForm service={service} onSave={() => router.push('/dashboard/doctor/services')} onCancel={() => router.back()} />
      </div>
    </div>
  );
}