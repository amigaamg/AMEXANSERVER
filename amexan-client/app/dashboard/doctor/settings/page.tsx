'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DoctorHeader from '@/components/doctor/DoctorHeader';
import DoctorSettings from '@/components/doctor/DoctorSettings';
import Spinner from '@/components/common/Spinner';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== 'doctor') return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <DoctorHeader doctor={user} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <DoctorSettings doctor={user} />
      </div>
    </div>
  );
}