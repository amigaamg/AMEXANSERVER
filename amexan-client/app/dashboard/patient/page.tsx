'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AMEXAN Patient Dashboard  – Full Production Build
// File: app/dashboard/patient/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useSocket } from '@/context/SocketContext';
import { usePatientData } from '@/lib/hooks/usePatientData';
import api from '@/lib/utils/api';
import { formatDate, formatRelative, countdown } from '@/lib/utils/date';
import { bpCategory, bpColor } from '@/lib/utils/bp';

// ─── common ──────────────────────────────────────────────────────────────────
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

// ─── patient panels ──────────────────────────────────────────────────────────
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

// ─── types ───────────────────────────────────────────────────────────────────
import type { CareTeamMember, Patient } from '@/types/patient';
import type { Notification } from '@/types/notification';
import type { DoctorService, Specialty, Clinic } from '@/types/services';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// ── Countdown Badge ──────────────────────────────────────────────────────────
function CountdownBadge({ date }: { date: string }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    const tick = () => setLabel(countdown(date));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [date]);
  return (
    <span style={{
      background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
      color: 'white',
      fontSize: 11,
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: 99,
      letterSpacing: 0.3,
    }}>{label}</span>
  );
}

// ── Realtime Status Dot ──────────────────────────────────────────────────────
function RealtimeDot({ connected }: { connected: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: connected ? '#22c55e' : '#f59e0b' }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: connected ? '#22c55e' : '#f59e0b',
        boxShadow: connected ? '0 0 0 3px rgba(34,197,94,0.25)' : 'none',
        animation: connected ? 'pulse 2s infinite' : 'none',
        display: 'inline-block',
      }} />
      {connected ? 'Live' : 'Reconnecting…'}
    </span>
  );
}

// ── Personalised Hero Banner ─────────────────────────────────────────────────
function HeroBanner({ patient, nextAppointment, daysToNext, criticalAlerts, alerts }: {
  patient: Patient;
  nextAppointment: any;
  daysToNext: number | null;
  criticalAlerts: number;
  alerts: any[];
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Disease-specific personalisation
  const diseaseMessages: Record<string, { color: string; bg: string; tip: string; icon: string }> = {
    'Diabetes': {
      color: '#d97706', bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)',
      tip: 'Track your glucose levels daily — consistent monitoring is your superpower. 🩸',
      icon: '🩸',
    },
    'Hypertension': {
      color: '#dc2626', bg: 'linear-gradient(135deg,#fff1f2,#fecdd3)',
      tip: 'Keep stress low, salt lower. You\'re managing your pressure — and that\'s powerful. 💪',
      icon: '❤️',
    },
    'Asthma': {
      color: '#2563eb', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
      tip: 'Always carry your inhaler. Clear lungs, clear skies ahead. 🌬️',
      icon: '🌬️',
    },
    'default': {
      color: '#2563eb', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
      tip: 'Small daily actions build lifelong health. You\'re on the right track! 🌟',
      icon: '🌟',
    },
  };

  const d = diseaseMessages[patient.condition ?? ''] ?? diseaseMessages['default'];
  const statusColor = criticalAlerts > 0 ? '#ef4444' : alerts.some(a => a.severity === 'medium') ? '#f59e0b' : '#22c55e';
  const statusLabel = criticalAlerts > 0 ? 'Urgent Review Needed' : alerts.some(a => a.severity === 'medium') ? 'Needs Attention' : 'All Clear — Stable';
  const statusBg = criticalAlerts > 0 ? '#fef2f2' : alerts.some(a => a.severity === 'medium') ? '#fffbeb' : '#f0fdf4';

  return (
    <Card style={{ background: d.bg, border: 'none', overflow: 'hidden', position: 'relative' }}>
      {/* Decorative blob */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 180, height: 180,
        borderRadius: '50%', background: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, flexShrink: 0,
            boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
            border: '3px solid white',
          }}>
            {patient.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ color: d.color, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{greeting}</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{patient.name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#475569', background: 'rgba(255,255,255,0.7)', padding: '2px 10px', borderRadius: 99 }}>
                ID: <strong style={{ fontFamily: 'monospace' }}>{patient.universalId || '—'}</strong>
              </span>
              <span style={{ fontSize: 12, color: '#475569', background: 'rgba(255,255,255,0.7)', padding: '2px 10px', borderRadius: 99 }}>
                {patient.age ?? '—'} yrs • {patient.gender ?? '—'}
              </span>
              {patient.bloodGroup && (
                <span style={{ fontSize: 12, background: '#fee2e2', color: '#dc2626', fontWeight: 700, padding: '2px 10px', borderRadius: 99 }}>
                  🩸 {patient.bloodGroup}
                </span>
              )}
              <span style={{ fontSize: 12, fontWeight: 700, color: statusColor, background: statusBg, padding: '2px 10px', borderRadius: 99 }}>
                {statusLabel}
              </span>
            </div>
            {patient.condition && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>{d.icon}</span>
                <span style={{ fontSize: 13, color: '#475569', fontStyle: 'italic' }}>{d.tip}</span>
              </div>
            )}
          </div>
        </div>

        {/* Next appointment countdown */}
        {nextAppointment && daysToNext !== null && (
          <div style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(10px)',
            padding: '14px 20px',
            borderRadius: 16,
            textAlign: 'right',
            border: '1px solid rgba(255,255,255,0.9)',
          }}>
            <div style={{ fontSize: 10, color: '#2563eb', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Next Appointment</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
              {daysToNext === 0 ? '🔴 Today!' : daysToNext === 1 ? 'Tomorrow' : `In ${daysToNext} days`}
            </div>
            <CountdownBadge date={nextAppointment.date} />
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
              {nextAppointment.doctorName || 'Your doctor'}<br />
              <span style={{ fontSize: 11 }}>{formatDate(nextAppointment.date)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Doctor Service Card ──────────────────────────────────────────────────────
function DoctorCard({ service, onBook }: { service: DoctorService; onBook: (s: DoctorService) => void }) {
  const [expanded, setExpanded] = useState(false);
  const available = service.isAvailableNow;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'white',
        borderRadius: 18,
        border: '1.5px solid #e2e8f0',
        padding: 18,
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: expanded ? '0 8px 32px rgba(37,99,235,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: expanded ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: service.avatar
            ? `url(${service.avatar}) center/cover`
            : `linear-gradient(135deg,${service.gradientStart ?? '#2563eb'},${service.gradientEnd ?? '#7c3aed'})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        }}>
          {!service.avatar && service.doctorName?.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Dr. {service.doctorName}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
              background: available ? '#dcfce7' : '#f1f5f9',
              color: available ? '#16a34a' : '#94a3b8',
            }}>
              {available ? '● Available Now' : 'Next: ' + (service.nextSlot ? formatDate(service.nextSlot) : '—')}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {service.specialty} • {service.clinic || 'General Practice'}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {service.tags?.map(tag => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: 99 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9', animation: 'fadeIn 0.2s ease' }}>
          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>
            {service.bio || 'Experienced specialist dedicated to patient-centred care.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              ['🎓 Experience', `${service.yearsExperience ?? '—'} yrs`],
              ['⭐ Rating', `${service.rating ?? '—'} / 5`],
              ['📍 Location', service.location || '—'],
              ['🗣️ Languages', (service.languages ?? ['English']).join(', ')],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ background: '#f8fafc', borderRadius: 10, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Consultation Fee</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                KES {service.fee?.toLocaleString() ?? '—'}
              </div>
            </div>
            <Button
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onBook(service); }}
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Discover Doctors / Triage Panel ─────────────────────────────────────────
function DiscoverDoctors({
  services,
  onBook,
}: {
  services: DoctorService[];
  onBook: (s: DoctorService) => void;
}) {
  const [query, setQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterFeeMax, setFilterFeeMax] = useState(100_000);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [activeSpecGroup, setActiveSpecGroup] = useState('All');

  // ✅ AFTER — normalise to array first
const safeServices = Array.isArray(services) ? services : [];
const specialties = ['All', ...Array.from(new Set(safeServices.map(s => s.specialty).filter(Boolean)))];
const locations = ['All', ...Array.from(new Set(safeServices.map(s => s.location).filter(Boolean)))];
  const specGroups = [
    { id: 'All', label: '🏥 All', },
    { id: 'General', label: '👨‍⚕️ General' },
    { id: 'Cardiology', label: '❤️ Heart' },
    { id: 'Endocrinology', label: '🩸 Diabetes' },
    { id: 'Neurology', label: '🧠 Neuro' },
    { id: 'Pulmonology', label: '🫁 Respiratory' },
    { id: 'Oncology', label: '🎗️ Oncology' },
    { id: 'Pediatrics', label: '👶 Paediatrics' },
    { id: 'Dermatology', label: '🧴 Skin' },
    { id: 'Orthopedics', label: '🦴 Ortho' },
    { id: 'Mental Health', label: '🧘 Mental' },
    { id: 'Telemedicine', label: '💻 Virtual' },
  ];

  const filtered = services.filter(s => {
    if (query && !`${s.doctorName} ${s.specialty} ${s.clinic}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (filterSpecialty !== 'All' && s.specialty !== filterSpecialty) return false;
    if (filterLocation !== 'All' && s.location !== filterLocation) return false;
    if (s.fee && s.fee > filterFeeMax) return false;
    if (filterAvailable && !s.isAvailableNow) return false;
    if (activeSpecGroup !== 'All' && !s.specialty?.toLowerCase().includes(activeSpecGroup.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Speciality Group pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', marginBottom: 16 }}>
        {specGroups.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveSpecGroup(g.id)}
            style={{
              whiteSpace: 'nowrap',
              padding: '8px 16px',
              borderRadius: 99,
              border: 'none',
              background: activeSpecGroup === g.id ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#f1f5f9',
              color: activeSpecGroup === g.id ? 'white' : '#475569',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: activeSpecGroup === g.id ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Search + Filters row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="🔍  Search doctors, specialties, clinics…"
          style={{ flex: '1 1 220px', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }}
        />
        <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, background: 'white', color: '#1e293b', cursor: 'pointer' }}>
          {specialties.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, background: 'white', color: '#1e293b', cursor: 'pointer' }}>
          {locations.map(l => <option key={l}>{l}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569', cursor: 'pointer', padding: '0 12px', background: filterAvailable ? '#eff6ff' : '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12 }}>
          <input type="checkbox" checked={filterAvailable} onChange={e => setFilterAvailable(e.target.checked)} />
          Available Now
        </label>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
        Showing <strong style={{ color: '#1e293b' }}>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
        {activeSpecGroup !== 'All' ? ` in ${activeSpecGroup}` : ''}
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔭</div>
          <p>No doctors match your filters. Try broadening your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(s => (
            <DoctorCard key={s._id} service={s} onBook={onBook} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Triage Wizard ────────────────────────────────────────────────────────────
function TriageWizard({ onComplete }: { onComplete: (specialty: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    { q: 'What is your main concern?', options: ['Heart / Chest pain', 'Blood Sugar / Diabetes', 'Breathing problems', 'Mental health', 'Skin issues', 'Bone / Joint pain', 'Children\'s health', 'General checkup', 'Other'] },
    { q: 'How long have you had this issue?', options: ['Today', 'A few days', 'A few weeks', 'Over a month', 'Chronic (years)'] },
    { q: 'How severe is it right now?', options: ['Mild — can wait', 'Moderate — affects my day', 'Severe — need urgent help', 'Emergency — need 911'] },
  ];

  const specialtyMap: Record<string, string> = {
    'Heart / Chest pain': 'Cardiology',
    'Blood Sugar / Diabetes': 'Endocrinology',
    'Breathing problems': 'Pulmonology',
    'Mental health': 'Mental Health',
    'Skin issues': 'Dermatology',
    'Bone / Joint pain': 'Orthopedics',
    "Children's health": 'Pediatrics',
    'General checkup': 'General',
    'Other': 'General',
  };

  const select = (ans: string) => {
    const next = [...answers, ans];
    setAnswers(next);
    if (step === questions.length - 1) {
      const specialty = specialtyMap[next[0]] ?? 'General';
      if (next[2] === 'Emergency — need 911') {
        alert('🚨 Please call emergency services immediately!');
      }
      onComplete(specialty);
    } else {
      setStep(s => s + 1);
    }
  };

  const q = questions[step];
  const progress = ((step) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: '#e2e8f0', borderRadius: 99, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#2563eb,#7c3aed)', transition: 'width 0.4s ease' }} />
      </div>
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Step {step + 1} of {questions.length}</p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>{q.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map(opt => (
          <button
            key={opt}
            onClick={() => select(opt)}
            style={{
              padding: '12px 18px',
              background: 'white',
              border: '1.5px solid #e2e8f0',
              borderRadius: 12,
              fontSize: 14,
              color: '#1e293b',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#2563eb'; (e.target as HTMLElement).style.background = '#eff6ff'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#e2e8f0'; (e.target as HTMLElement).style.background = 'white'; }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Disease Tools Panel ──────────────────────────────────────────────────────
function DiseaseTools({ condition, measurements, onLogBP }: { condition?: string; measurements: any[]; onLogBP: () => void }) {
  const tools: Record<string, Array<{ label: string; icon: string; action?: () => void; value?: string }>> = {
    'Hypertension': [
      { label: 'Log Blood Pressure', icon: '🩺', action: onLogBP },
      { label: 'BP Trend (7 days)', icon: '📈', value: 'View' },
      { label: 'Salt Tracker', icon: '🧂', value: 'Coming Soon' },
      { label: 'Medication Adherence', icon: '💊', value: 'View' },
    ],
    'Diabetes': [
      { label: 'Log Glucose Level', icon: '🩸', value: 'Log' },
      { label: 'HbA1c Tracker', icon: '📊', value: 'View' },
      { label: 'Carb Counter', icon: '🍞', value: 'Coming Soon' },
      { label: 'Insulin Log', icon: '💉', value: 'Log' },
    ],
    'Asthma': [
      { label: 'Peak Flow Log', icon: '🌬️', value: 'Log' },
      { label: 'Trigger Diary', icon: '📓', value: 'View' },
      { label: 'Inhaler Reminders', icon: '⏰', value: 'Set' },
      { label: 'Air Quality Index', icon: '🌍', value: 'Check' },
    ],
  };

  const current = condition ? (tools[condition] ?? []) : [];

  if (current.length === 0) return null;

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
        🛠️ Tools for {condition}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {current.map(t => (
          <button
            key={t.label}
            onClick={t.action}
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: 14,
              padding: '14px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'; (e.currentTarget as HTMLElement).style.background = '#eff6ff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{t.label}</div>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ── Telemedicine Card ────────────────────────────────────────────────────────
function TelemedicineCard({ appointment, onJoin }: { appointment?: any; onJoin: (id: string) => void }) {
  if (!appointment) return null;
  const isLive = new Date(appointment.date).getTime() - Date.now() < 10 * 60 * 1000; // within 10 min

  return (
    <Card style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', color: 'white', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, position: 'relative' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#a5b4fc', textTransform: 'uppercase', marginBottom: 4 }}>
            {isLive ? '🔴 LIVE — Join Now' : '📡 Upcoming Telemedicine'}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Video with Dr. {appointment.doctorName}</h3>
          <p style={{ color: '#c7d2fe', fontSize: 13, marginTop: 4 }}>{formatDate(appointment.date)}</p>
          <CountdownBadge date={appointment.date} />
        </div>
        <Button
          onClick={() => onJoin(appointment._id)}
          style={{
            background: isLive ? '#22c55e' : 'rgba(255,255,255,0.15)',
            border: isLive ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: 14,
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          {isLive ? '🎥 Join Now' : 'Get Ready'}
        </Button>
      </div>
    </Card>
  );
}

// ── Stats Strip ──────────────────────────────────────────────────────────────
function StatsStrip({ measurements, medications, appointments, alerts }: any) {
  const latestBP = measurements.filter((m: any) => m.type === 'bp').sort((a: any, b: any) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
  const activeMeds = medications.filter((m: any) => m.active).length;
  const upcomingCount = appointments.filter((a: any) => a.status === 'scheduled').length;
  const alertCount = alerts.filter((a: any) => a.severity === 'high').length;

  const stats = [
    { label: 'Blood Pressure', value: latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : '—', sub: latestBP ? bpCategory(latestBP.systolic, latestBP.diastolic) : 'No reading', color: latestBP ? bpColor(latestBP.systolic, latestBP.diastolic) : '#94a3b8', icon: '❤️' },
    { label: 'Active Medications', value: String(activeMeds), sub: 'prescribed', color: '#2563eb', icon: '💊' },
    { label: 'Upcoming Visits', value: String(upcomingCount), sub: 'scheduled', color: '#7c3aed', icon: '📅' },
    { label: 'Active Alerts', value: String(alertCount), sub: alertCount > 0 ? 'need review' : 'all clear', color: alertCount > 0 ? '#ef4444' : '#22c55e', icon: alertCount > 0 ? '🔴' : '✅' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
      {stats.map(s => (
        <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px' }}>
          <span style={{ fontSize: 28 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.sub}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}


// =============================================================================
// MAIN DASHBOARD
// =============================================================================

export default function PatientDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const { socket } = useSocket();

  const patientId = user?._id || user?.id || '';
  const db = usePatientData(patientId);

  // ── local UI state ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const [showQR, setShowQR] = useState(false);
  const [showBPModal, setShowBPModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTriage, setShowTriage] = useState(false);
  const [triageComplete, setTriageComplete] = useState(false);
  const [triageSpecialty, setTriageSpecialty] = useState('All');
  const [selectedService, setSelectedService] = useState<DoctorService | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // ── redirect unauthenticated users (never call router.push during render) ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // ── real-time socket listeners ─────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    setSocketConnected(socket.connected);
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('patient:alert', () => db.refresh());
    socket.on('patient:appointment:updated', () => db.refresh());
    socket.on('patient:message:new', () => db.refresh());
    socket.on('patient:payment:update', () => db.refresh());
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('patient:alert');
      socket.off('patient:appointment:updated');
      socket.off('patient:message:new');
      socket.off('patient:payment:update');
    };
  }, [socket, db.refresh]);

  // ── derived data ───────────────────────────────────────────────────────────
  const unreadMsgs = db.messages.filter(m => !m.read).length;
  const criticalAlerts = db.alerts.filter(a => a.severity === 'high').length;

  const nextAppointment = db.appointments
    .filter(a => a.status === 'scheduled' && new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const daysToNext = nextAppointment
    ? Math.ceil((new Date(nextAppointment.date).getTime() - Date.now()) / 86_400_000)
    : null;

  const nextTelemedicine = db.appointments.find(
    a => a.status === 'scheduled' && a.type === 'telemedicine' && new Date(a.date) > new Date()
  );

  const careTeamMembers: CareTeamMember[] =
    db.patient?.careTeam?.length
      ? db.patient.careTeam
      : Array.from(
          new Map(
            db.appointments
              .filter(a => a.doctorId && a.doctorName)
              .map(a => [a.doctorId, { _id: a.doctorId, name: a.doctorName ?? '', role: 'Doctor', specialty: '', avatar: '' } as CareTeamMember])
          ).values()
        );

  // ── tabs config ────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'overview',      label: 'Overview',    icon: '🏠' },
    { id: 'discover',      label: 'Find Doctors', icon: '🔍' },
    { id: 'vitals',        label: 'Vitals',       icon: '❤️' },
    { id: 'medications',   label: 'Meds',         icon: '💊' },
    { id: 'appointments',  label: 'Visits',       icon: '📅' },
    { id: 'history',       label: 'History',      icon: '📋' },
    { id: 'labs',          label: 'Labs',         icon: '🧪' },
    { id: 'messages',      label: 'Messages',     icon: '💬', badge: unreadMsgs },
    { id: 'payments',      label: 'Payments',     icon: '💰' },
    { id: 'education',     label: 'Education',    icon: '📚' },
    { id: 'settings',      label: 'Settings',     icon: '⚙️' },
  ];

  const navTabs = [
    { id: 'overview',     icon: '🏠', label: 'Home' },
    { id: 'discover',     icon: '🔍', label: 'Discover' },
    { id: 'vitals',       icon: '❤️', label: 'Vitals' },
    { id: 'appointments', icon: '📅', label: 'Visits' },
    { id: 'messages',     icon: '💬', label: 'Messages', badge: unreadMsgs },
  ];

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleBookService = (service: DoctorService) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleTriageDone = (specialty: string) => {
    setTriageSpecialty(specialty);
    setTriageComplete(true);
    setShowTriage(false);
    setActiveTab('discover');
  };

  const handleJoinTelemedicine = async (appointmentId: string) => {
    try {
      const { data } = await api.post(`/appointments/${appointmentId}/join-room`);
      if (data.roomUrl) window.open(data.roomUrl, '_blank');
    } catch {
      alert('Could not join session. Please try again.');
    }
  };

  // ── loading & guard states ─────────────────────────────────────────────────
  const Spinner = ({ label }: { label: string }) => (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b' }}>{label}</p>
      </div>
    </div>
  );

  if (authLoading) return <Spinner label="Checking authentication…" />;
  if (!user) return null; // redirect handled in useEffect above
  if (db.loading) return <Spinner label="Loading your health profile…" />;

  if (!db.patient) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Session expired</h2>
          <p style={{ color: '#64748b', marginTop: 8 }}>Please sign in again to continue.</p>
          <Button onClick={() => router.push('/login')} style={{ marginTop: 20 }}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── GLOBAL CSS (injected inline for portability) ──────────────────── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      {/* ── STICKY HEADER ────────────────────────────────────────────────── */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '10px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38,
                background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>⚕️</div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', letterSpacing: -0.5 }}>AMEXAN</span>
              <span style={{ fontSize: 11, color: '#94a3b8', borderLeft: '1px solid #e2e8f0', paddingLeft: 10 }}>Patient Portal</span>
              <RealtimeDot connected={socketConnected} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

              {/* Triage button */}
              <button
                onClick={() => setShowTriage(true)}
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 99,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔍 Find Right Doctor
              </button>

              {/* Notification bell */}
              <div
                style={{ position: 'relative', cursor: 'pointer', padding: '4px 8px' }}
                onClick={() => setShowNotifications(true)}
              >
                <span style={{ fontSize: 22 }}>🔔</span>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 0, right: 0,
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: 17, height: 17,
                    fontSize: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700,
                  }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </div>

              {/* Smartcard */}
              <button
                onClick={() => setShowQR(true)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 10,
                  padding: '7px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#2563eb',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                🪪 Smartcard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '20px auto 0', padding: '0 16px' }}>
        <HeroBanner
          patient={db.patient}
          nextAppointment={nextAppointment}
          daysToNext={daysToNext}
          criticalAlerts={criticalAlerts}
          alerts={db.alerts}
        />
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '16px auto 0', padding: '0 16px' }}>
        <StatsStrip
          measurements={db.measurements}
          medications={db.medications}
          appointments={db.appointments}
          alerts={db.alerts}
        />
      </div>

      {/* ── TELEMEDICINE CARD (if applicable) ────────────────────────────── */}
      {nextTelemedicine && (
        <div style={{ maxWidth: 1280, margin: '16px auto 0', padding: '0 16px' }}>
          <TelemedicineCard appointment={nextTelemedicine} onJoin={handleJoinTelemedicine} />
        </div>
      )}

      {/* ── TAB BAR ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '16px auto 0', padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 2, borderBottom: '2px solid #e2e8f0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: -2,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '24px auto 0', padding: '0 16px', animation: 'fadeIn 0.2s ease' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Disease Tools (condition-specific) */}
            <DiseaseTools
              condition={db.patient.condition}
              measurements={db.measurements}
              onLogBP={() => setShowBPModal(true)}
            />
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
          </div>
        )}

        {/* DISCOVER DOCTORS */}
        {activeTab === 'discover' && (
          <div>
            {!triageComplete && (
              <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Not sure which doctor to choose?</h3>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Our smart triage tool will guide you to the right specialist in under a minute.</p>
                </div>
                <Button onClick={() => setShowTriage(true)} style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Start Triage →
                </Button>
              </div>
            )}
            {triageComplete && (
              <div style={{ background: '#dcfce7', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>
                  ✅ Triage complete — showing <strong>{triageSpecialty}</strong> specialists
                </span>
                <button onClick={() => { setTriageComplete(false); setTriageSpecialty('All'); }} style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                  Reset
                </button>
              </div>
            )}
            <DiscoverDoctors services={Array.isArray(db.services) ? db.services : []} onBook={handleBookService} />
          </div>
        )}

        {/* VITALS */}
        {activeTab === 'vitals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            <HealthSnapshot
              latestBP={db.measurements.filter(m => m.type === 'bp').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0]}
              bpHistory={db.measurements.filter(m => m.type === 'bp')}
              onLogBP={() => setShowBPModal(true)}
              expanded
            />
            <DiseaseTools condition={db.patient.condition} measurements={db.measurements} onLogBP={() => setShowBPModal(true)} />
          </div>
        )}

        {/* MEDICATIONS */}
        {activeTab === 'medications' && (
          <MedicationsPanel medications={db.medications} patientId={patientId} onUpdate={db.refresh} expanded />
        )}

        {/* APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
            <AppointmentsList appointments={db.appointments} onBook={() => setShowBookingModal(true)} expanded />
            <CareTeam members={careTeamMembers} />
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
            <MedicalHistory patientId={patientId} />
            <ClinicalSheet visits={db.visits} labs={db.labs} messages={db.messages} />
          </div>
        )}

        {/* LABS */}
        {activeTab === 'labs' && (
          <LabsImagingPanel labs={db.labs} imaging={db.imaging} />
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <MessagesPanel messages={db.messages} patientId={patientId} onUpdate={db.refresh} expanded />
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <PaymentsPanel payments={db.payments} patientId={patientId} onUpdate={db.refresh} />
        )}

        {/* EDUCATION */}
        {activeTab === 'education' && (
          <EducationPanel items={db.education} expanded />
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsPanel patient={db.patient} patientId={patientId} onUpdate={db.refresh} />
        )}
      </div>

      {/* ── QUICK ACTION BUTTONS (FAB) ────────────────────────────────────── */}
      <QuickActions
        onEmergency={() => setShowEmergencyModal(true)}
        onLogBP={() => setShowBPModal(true)}
        onBook={() => setShowBookingModal(true)}
      />

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        zIndex: 40,
        padding: '4px 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}>
        {navTabs.map(item => (
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
              fontSize: 11,
              fontWeight: activeTab === item.id ? 700 : 500,
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            <span style={{ fontSize: 20, transition: 'transform 0.15s', transform: activeTab === item.id ? 'scale(1.15)' : 'none' }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span style={{ position: 'absolute', top: 2, right: '18%', background: '#ef4444', color: 'white', borderRadius: '50%', width: 14, height: 14, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── NOTIFICATIONS DRAWER ─────────────────────────────────────────── */}
      {showNotifications && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
          onClick={() => setShowNotifications(false)}
        >
          <div
            style={{ width: 400, maxWidth: '92%', background: 'white', height: '100%', overflowY: 'auto', padding: 24, boxShadow: '-4px 0 20px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Notifications</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {notifications.length > 0 && (
                  <Button variant="text" size="sm" onClick={markAllAsRead}>Mark all read</Button>
                )}
                <Button variant="text" size="sm" onClick={() => setShowNotifications(false)}>✕</Button>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                <p>You're all caught up!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifications.map(n => (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    style={{
                      padding: '12px 14px',
                      background: n.read ? 'white' : '#eff6ff',
                      borderRadius: 12,
                      border: `1.5px solid ${n.read ? '#e2e8f0' : '#bfdbfe'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: n.read ? 500 : 700, fontSize: 14 }}>{n.title}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{formatRelative(n.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 1.5 }}>{n.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TRIAGE MODAL ──────────────────────────────────────────────────── */}
      {showTriage && (
        <Modal open onClose={() => setShowTriage(false)} title="🏥 Smart Triage — Find Your Specialist">
          <TriageWizard onComplete={handleTriageDone} />
        </Modal>
      )}

      {/* ── MODALS ────────────────────────────────────────────────────────── */}
      <QRModal open={showQR} onClose={() => setShowQR(false)} patient={db.patient} />

      <LogBPModal
        open={showBPModal}
        onClose={() => setShowBPModal(false)}
        patientId={patientId}
        onSaved={db.refresh}
      />

      <BookingModal
        open={showBookingModal}
        onClose={() => { setShowBookingModal(false); setSelectedService(null); }}
        patientId={patientId}
        onBooked={db.refresh}
        services={db.services}
        preselectedService={selectedService}
      />

      <EmergencyModal
        open={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        patientId={patientId}
      />
    </div>
  );
}