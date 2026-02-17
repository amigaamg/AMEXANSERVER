'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../../context/AuthContext";
import { api } from '@/lib/utils/api';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import TodayAppointments from '@/components/doctor/TodayAppointments';
import PatientList from '@/components/doctor/PatientList';
import AlertItem from '@/components/doctor/AlertItem';
import QuickActions from '@/components/doctor/QuickActions';

export default function DoctorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [aptRes, patientRes, alertRes] = await Promise.all([
          api(`/api/doctors/${user.id}/appointments/today`),
          api(`/api/doctors/${user.id}/patients`),
          api(`/api/doctors/${user.id}/alerts`), // endpoint to fetch alerts for this doctor's patients
        ]);
        setAppointments(aptRes);
        setPatients(patientRes);
        setAlerts(alertRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (authLoading || loading) {
    return <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>Loading dashboard...</div>
    </div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'patients', label: 'Patients', icon: '👥' },
    { id: 'alerts', label: 'Alerts', icon: '🔔', badge: alerts.length },
    { id: 'messages', label: 'Messages', icon: '💬' },
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#2563eb' }}>Dr. {user.name}</span>
            </div>
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
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
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
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
            <TodayAppointments appointments={appointments} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Recent Alerts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alerts.slice(0, 5).map(alert => <AlertItem key={alert._id} alert={alert} />)}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Quick Actions</h3>
              <QuickActions />
            </div>
          </div>
        )}
        {activeTab === 'appointments' && (
          <TodayAppointments appointments={appointments} expanded />
        )}
        {activeTab === 'patients' && (
          <PatientList patients={patients} />
        )}
        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map(alert => <AlertItem key={alert._id} alert={alert} />)}
          </div>
        )}
        {activeTab === 'messages' && (
          <div>Messages view (similar to patient but from doctor perspective)</div>
        )}
      </div>

      {/* Floating action buttons (optional) */}
      <QuickActions floating />
    </div>
  );
}