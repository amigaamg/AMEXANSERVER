'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePatientData } from '@/lib/hooks/usePatientData';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import HealthSnapshot from '@/components/patient/HealthSnapshot';
import AlertsPanel from '@/components/patient/AlertsPanel';
import AppointmentsList from '@/components/patient/AppointmentsList';
import MedicalHistory from '@/components/patient/MedicalHistory';
import ClinicalSheet from '@/components/patient/ClinicalSheet';
import CareTeam from '@/components/patient/CareTeam';
import MedicationsPanel from '@/components/patient/MedicationsPanel';
import LabsImagingPanel from '@/components/patient/LabsImagingPanel';
import PaymentsPanel from '@/components/patient/PaymentsPanel';
import MessagesPanel from '@/components/patient/MessagesPanel';
import EducationPanel from '@/components/patient/EducationPanel';
import SettingsPanel from '@/components/patient/SettingsPanel';
import QuickActions from '@/components/patient/QuickActions';
import QRModal from '@/components/patient/QRModal';
import LogBPModal from '@/components/patient/LogBPModal';
import BookingModal from '@/components/patient/BookingModal';
import EmergencyModal from '@/components/patient/EmergencyModal';
import type { CareTeamMember } from '@/types/patient';

export default function PatientDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  console.log('PatientDashboard - authLoading:', authLoading, 'user:', user);

  const patientId = user?._id || user?.id || '';
  console.log('PatientDashboard - patientId:', patientId);

  const db = usePatientData(patientId);

  const [activeTab, setActiveTab] = useState('overview');
  const [showQR, setShowQR] = useState(false);
  const [showBPModal, setShowBPModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading authentication…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('PatientDashboard - no user, redirecting to login');
    router.push('/login');
    return null;
  }

  if (db.loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading your health dashboard…</p>
        </div>
      </div>
    );
  }

  if (!db.patient) {
    console.log('PatientDashboard - db.patient is null, error:', db.error);
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Session expired</h2>
          <p style={{ color: '#64748b', marginTop: 8 }}>Please sign in again.</p>
          <Button onClick={() => router.push('/login')} style={{ marginTop: 20 }}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  const unreadMsgs = db.messages.filter(m => !m.read).length;
  // Cast severity to string to support 'critical' values from the API
  const criticalAlerts = db.alerts.filter(a => (a.severity as string) === 'critical').length;

  // Prefer careTeam stored on the patient record; fall back to deriving from appointments.
  // Appointment has no specialty field, so we leave it blank when falling back.
  const careTeamMembers: CareTeamMember[] =
    db.patient.careTeam && db.patient.careTeam.length > 0
      ? db.patient.careTeam
      : Array.from(
          new Map(
            db.appointments
              .filter(a => a.doctorId && a.doctorName)
              .map(a => [
                a.doctorId,
                {
                  _id: a.doctorId,
                  name: a.doctorName ?? '',
                  role: 'Doctor',
                  specialty: '',
                  avatar: '',
                } as CareTeamMember,
              ])
          ).values()
        );

  const tabs: { id: string; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'vitals', label: 'Vitals', icon: '❤️' },
    { id: 'medications', label: 'Meds', icon: '💊' },
    { id: 'appointments', label: 'Visits', icon: '📅' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'labs', label: 'Labs', icon: '🧪' },
    { id: 'messages', label: 'Messages', icon: '💬', badge: unreadMsgs },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
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
              <span style={{ color: '#94a3b8', fontSize: 12, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>Patient Portal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {criticalAlerts > 0 && (
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>
                  <span style={{ fontSize: 22 }}>🔔</span>
                  <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {criticalAlerts}
                  </span>
                </div>
              )}
              <button onClick={() => setShowQR(true)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>
                🪪 Smartcard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px 0', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
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

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            <HealthSnapshot
              latestBP={db.measurements.filter(m => m.type === 'bp').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0]}
              bpHistory={db.measurements.filter(m => m.type === 'bp')}
              onLogBP={() => setShowBPModal(true)}
            />
            <AlertsPanel alerts={db.alerts} />
            <MedicationsPanel medications={db.medications} patientId={patientId} onUpdate={db.refresh} />
            <AppointmentsList appointments={db.appointments} onBook={() => setShowBookingModal(true)} />
            <MessagesPanel messages={db.messages.slice(0, 3)} patientId={patientId} onUpdate={db.refresh} compact />
            <EducationPanel items={db.education.slice(0, 2)} compact />
          </div>
        )}

        {activeTab === 'vitals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            <HealthSnapshot
              latestBP={db.measurements.find(m => m.type === 'bp')}
              bpHistory={db.measurements.filter(m => m.type === 'bp')}
              onLogBP={() => setShowBPModal(true)}
            />
          </div>
        )}

        {activeTab === 'medications' && (
          <MedicationsPanel medications={db.medications} patientId={patientId} onUpdate={db.refresh} expanded />
        )}

        {activeTab === 'appointments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
            <AppointmentsList appointments={db.appointments} onBook={() => setShowBookingModal(true)} expanded />
            <CareTeam members={careTeamMembers} />
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
            <MedicalHistory patientId={patientId} />
            <ClinicalSheet visits={db.visits} labs={db.labs} messages={db.messages} />
          </div>
        )}

        {activeTab === 'labs' && (
          <LabsImagingPanel labs={db.labs} imaging={db.imaging} />
        )}

        {activeTab === 'messages' && (
          <MessagesPanel messages={db.messages} patientId={patientId} onUpdate={db.refresh} expanded />
        )}

        {activeTab === 'payments' && (
          <PaymentsPanel payments={db.payments} patientId={patientId} onUpdate={db.refresh} />
        )}

        {activeTab === 'education' && (
          <EducationPanel items={db.education} expanded />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel patient={db.patient} patientId={patientId} onUpdate={db.refresh} />
        )}
      </div>

      {/* Floating Action Buttons */}
      <QuickActions
        onEmergency={() => setShowEmergencyModal(true)}
        onLogBP={() => setShowBPModal(true)}
        onBook={() => setShowBookingModal(true)}
      />

      {/* Mobile Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', zIndex: 40, padding: '4px 0' }}>
        {[
          { id: 'overview', icon: '🏠', label: 'Home' },
          { id: 'vitals', icon: '❤️', label: 'Vitals' },
          { id: 'medications', icon: '💊', label: 'Meds' },
          { id: 'appointments', icon: '📅', label: 'Visits' },
          { id: 'messages', icon: '💬', label: 'Messages', badge: unreadMsgs },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 4px',
              background: 'transparent',
              border: 'none',
              color: activeTab === item.id ? '#2563eb' : '#94a3b8',
              fontSize: 12,
              fontWeight: activeTab === item.id ? 600 : 500,
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span style={{ position: 'absolute', top: 2, right: '20%', background: '#ef4444', color: 'white', borderRadius: '50%', width: 14, height: 14, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Modals */}
      <QRModal open={showQR} onClose={() => setShowQR(false)} patient={db.patient} />
      <LogBPModal open={showBPModal} onClose={() => setShowBPModal(false)} patientId={patientId} onSaved={db.refresh} />
      <BookingModal open={showBookingModal} onClose={() => setShowBookingModal(false)} patientId={patientId} onBooked={db.refresh} services={db.services} />
      <EmergencyModal open={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} patientId={patientId} />
    </div>
  );
}