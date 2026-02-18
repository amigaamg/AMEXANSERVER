'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/utils/api';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import TodayAppointments from '@/components/doctor/TodayAppointments';
import PatientList from '@/components/doctor/PatientList';
import AlertItem from '@/components/doctor/AlertItem';
import QuickActions from '@/components/doctor/QuickActions';

export default function DoctorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'doctor') return;
    const doctorId = user._id || user.id;
    if (!doctorId) {
      setError('Invalid doctor ID');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch each endpoint independently so one failure doesn't block others
        const [aptRes, patientRes, alertRes] = await Promise.allSettled([
          api(`/api/doctors/${doctorId}/appointments/today`),
          api(`/api/doctors/${doctorId}/patients`),
          api(`/api/doctors/${doctorId}/alerts`),
        ]);

        if (aptRes.status === 'fulfilled') {
          setAppointments(Array.isArray(aptRes.value) ? aptRes.value : []);
        } else {
          console.warn('Appointments fetch failed:', aptRes.reason?.message);
          setAppointments([]);
        }

        if (patientRes.status === 'fulfilled') {
          setPatients(Array.isArray(patientRes.value) ? patientRes.value : []);
        } else {
          console.warn('Patients fetch failed:', patientRes.reason?.message);
          setPatients([]);
        }

        if (alertRes.status === 'fulfilled') {
          setAlerts(Array.isArray(alertRes.value) ? alertRes.value : []);
        } else {
          console.warn('Alerts fetch failed:', alertRes.reason?.message);
          setAlerts([]);
        }

      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'doctor') return null;

  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: '🏠' },
    { id: 'appointments',  label: 'Appointments',   icon: '📅' },
    { id: 'patients',      label: 'Patients',       icon: '👥' },
    { id: 'alerts',        label: 'Alerts',         icon: '🔔', badge: alerts.length },
    { id: 'messages',      label: 'Messages',       icon: '💬' },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2563eb,#1e40af)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18 }}>⚕️</div>
              <span style={{ color: '#1e293b', fontWeight: 700, fontSize: 18 }}>AMEXAN</span>
              <span style={{ color: '#94a3b8', fontSize: 12, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>Doctor Portal</span>
            </div>
            <span style={{ fontSize: 14, color: '#2563eb' }}>Dr. {user.name}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px 0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#64748b',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: 14,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>

        {/* Error banner - non-blocking, dashboard still shows */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#dc2626', fontSize: 14 }}>⚠️ {error}</span>
            <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
                <TodayAppointments appointments={appointments} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Recent Alerts</h3>
                  {alerts.length === 0
                    ? <Card><p style={{ color: '#94a3b8' }}>No alerts.</p></Card>
                    : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{alerts.slice(0, 5).map(a => <AlertItem key={a._id} alert={a} />)}</div>
                  }
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Quick Actions</h3>
                  <QuickActions />
                </div>
              </div>
            )}
            {activeTab === 'appointments' && <TodayAppointments appointments={appointments} expanded />}
            {activeTab === 'patients' && <PatientList patients={patients} />}
            {activeTab === 'alerts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alerts.length === 0
                  ? <Card><p style={{ color: '#94a3b8' }}>No alerts.</p></Card>
                  : alerts.map(a => <AlertItem key={a._id} alert={a} />)
                }
              </div>
            )}
            {activeTab === 'messages' && (
              <Card style={{ padding: 24, textAlign: 'center' }}>
                <p style={{ color: '#94a3b8' }}>Messages feature coming soon.</p>
              </Card>
            )}
          </>
        )}
      </div>

      <QuickActions floating />
    </div>
  );
}