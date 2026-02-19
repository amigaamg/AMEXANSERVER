'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useDoctorData } from '@/lib/hooks/useDoctorData';

// ── Components ────────────────────────────────────────────────────────────────
import DoctorHeader from '@/components/doctor/DoctorHeader';
import TodayAppointments from '@/components/doctor/TodayAppointments';
import AppointmentList from '@/components/doctor/AppointmentList';
import PatientList from '@/components/doctor/PatientList';
import AlertItem from '@/components/doctor/AlertItem';
import PaymentsPanel from '@/components/doctor/PaymentsPanel';
import ServiceManager from '@/components/doctor/ServiceManager';
import DoctorSettings from '@/components/doctor/DoctorSettings';
import QuickActions from '@/components/doctor/QuickActions';
import Card from '@/components/common/Card';

// =============================================================================
// INLINE SUB-COMPONENTS
// =============================================================================

// ── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '3px solid #1e293b', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      {label && <p style={{ color: '#64748b', fontSize: 14 }}>{label}</p>}
    </div>
  );
}

// ── Stats Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, trend }: {
  icon: string; label: string; value: string | number;
  sub?: string; color: string; trend?: { value: number; label: string };
}) {
  return (
    <div style={{ background: 'white', borderRadius: 18, padding: '18px 20px', border: '1.5px solid #e2e8f0', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      {/* Background blob */}
      <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, borderRadius: '50%', background: color, opacity: 0.08, pointerEvents: 'none' }} />
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>{sub}</div>}
      {trend && (
        <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: trend.value >= 0 ? '#22c55e' : '#ef4444', background: trend.value >= 0 ? '#f0fdf4' : '#fef2f2', padding: '2px 8px', borderRadius: 99 }}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </div>
  );
}

// ── Overview Hero ─────────────────────────────────────────────────────────────
function OverviewHero({ doctor, stats, appointments }: { doctor: any; stats: any; appointments: any }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todayTotal = appointments?.today?.length ?? 0;
  const completed = appointments?.today?.filter((a: any) => a.status === 'completed').length ?? 0;
  const inProgress = appointments?.today?.find((a: any) => a.status === 'in-progress');
  const progress = todayTotal > 0 ? Math.round((completed / todayTotal) * 100) : 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a5f 100%)',
      borderRadius: 22, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: '40%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(37,99,235,0.08)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, position: 'relative' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>{greeting}</p>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
            Dr. {doctor?.name ?? '—'}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 12, background: 'rgba(37,99,235,0.3)', color: '#93c5fd', padding: '3px 12px', borderRadius: 99, fontWeight: 600 }}>
              {doctor?.specialty ?? 'Specialist'}
            </span>
            {doctor?.uniqueId && (
              <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.08)', color: '#94a3b8', padding: '3px 12px', borderRadius: 99, fontFamily: 'monospace' }}>
                ID: {doctor.uniqueId}
              </span>
            )}
            {doctor?.clinic && (
              <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '3px 12px', borderRadius: 99 }}>
                🏥 {doctor.clinic}
              </span>
            )}
          </div>

          {/* Today's progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Today's progress</span>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{completed}/{todayTotal} completed</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, width: 260, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#2563eb,#22c55e)', borderRadius: 99, transition: 'width 0.8s ease' }} />
            </div>
            {inProgress && (
              <p style={{ fontSize: 11, color: '#f59e0b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, background: '#f59e0b', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                Currently with: {inProgress.patientName}
              </p>
            )}
          </div>
        </div>

        {/* Today's snapshot */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minWidth: 240 }}>
          {[
            { label: 'Total Today', value: todayTotal, color: '#2563eb', icon: '📅' },
            { label: 'Completed', value: completed, color: '#22c55e', icon: '✅' },
            { label: 'Patients', value: stats?.totalPatients ?? 0, color: '#7c3aed', icon: '👥' },
            { label: 'Active Alerts', value: stats?.activeAlerts ?? 0, color: stats?.activeAlerts > 0 ? '#ef4444' : '#22c55e', icon: stats?.activeAlerts > 0 ? '🔴' : '🟢' },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{item.value}</div>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Upcoming Appointments Strip ───────────────────────────────────────────────
function UpcomingStrip({ appointments, onViewAll }: { appointments: any[]; onViewAll: () => void }) {
  if (!appointments?.length) return null;
  const next3 = appointments.slice(0, 3);

  return (
    <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid #e2e8f0', padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>📅 Upcoming Appointments</h3>
        <button onClick={onViewAll} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View All →</button>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {next3.map((apt: any) => {
          const d = new Date(apt.date);
          const isToday = d.toDateString() === new Date().toDateString();
          const isTomorrow = d.toDateString() === new Date(Date.now() + 86400000).toDateString();
          const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
          return (
            <div key={apt._id} style={{ minWidth: 180, background: '#f8fafc', borderRadius: 14, padding: '12px 14px', border: '1.5px solid #e2e8f0', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? '#2563eb' : '#64748b', marginBottom: 4 }}>{dayLabel}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{apt.patientName ?? 'Patient'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {apt.type === 'telemedicine' ? '📡' : '🏥'}</div>
              <div style={{ marginTop: 6, fontSize: 11, color: '#64748b', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason ?? 'Consultation'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── High-Risk Patients Panel ──────────────────────────────────────────────────
function HighRiskPanel({ patients, onViewPatient }: { patients: any[]; onViewPatient: () => void }) {
  const highRisk = patients.filter(p => p.riskLevel === 'high').slice(0, 5);
  if (!highRisk.length) return null;

  return (
    <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid #fca5a5', padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#dc2626' }}>🔴 High-Risk Patients</h3>
        <button onClick={onViewPatient} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View All →</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {highRisk.map((p: any) => (
          <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {p.name?.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#dc2626' }}>{p.condition ?? 'Unknown condition'}</div>
            </div>
            <span style={{ fontSize: 10, background: '#fecaca', color: '#dc2626', padding: '2px 8px', borderRadius: 99, fontWeight: 700, flexShrink: 0 }}>HIGH RISK</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Messages Tab (full real-time) ─────────────────────────────────────────────
function MessagesTab({ doctorId, socket }: { doctorId: string; socket: any }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Dynamic import to avoid circular dep
  const api = require('@/lib/utils/api').default;

  const loadConversations = useCallback(async () => {
    try {
      const data = await api.get(`/doctors/${doctorId}/conversations`);
      setConversations(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }, [doctorId]);

  const loadMessages = useCallback(async (patientId: string) => {
    try {
      const data = await api.get(`/patients/${patientId}/messages`);
      setMessages(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (!socket) return;
    socket.on('patient:message:new', () => { loadConversations(); if (selected) loadMessages(selected.patientId); });
    return () => socket.off('patient:message:new');
  }, [socket, selected, loadConversations, loadMessages]);

  const selectConv = (conv: any) => {
    setSelected(conv);
    loadMessages(conv.patientId);
  };

  const sendMsg = async () => {
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      await api.post(`/patients/${selected.patientId}/messages`, { content: text, from: 'doctor' });
      setText('');
      loadMessages(selected.patientId);
      loadConversations();
    } catch {}
    setSending(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading conversations…</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0, background: 'white', borderRadius: 20, border: '1.5px solid #e2e8f0', overflow: 'hidden', minHeight: 600 }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid #f1f5f9', overflowY: 'auto' }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>💬 Messages</h3>
        </div>
        {conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <p style={{ fontSize: 13 }}>No conversations yet.</p>
          </div>
        ) : (
          conversations.map((conv: any) => (
            <div key={conv.patientId} onClick={() => selectConv(conv)}
              style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #f8fafc', background: selected?.patientId === conv.patientId ? '#eff6ff' : 'white', transition: 'background 0.1s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {conv.patientName?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: conv.unread ? 700 : 500, fontSize: 14, color: '#0f172a' }}>{conv.patientName}</span>
                    {conv.unread > 0 && (
                      <span style={{ background: '#2563eb', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{conv.unread}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{conv.lastMessage ?? 'No messages yet'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat area */}
      {!selected ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>Select a conversation</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Pick a patient from the list to start messaging.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Chat header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
              {selected.patientName?.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{selected.patientName}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{selected.condition ?? 'Patient'}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg: any) => {
              const fromDoctor = msg.from === 'doctor' || msg.senderRole === 'doctor';
              return (
                <div key={msg._id} style={{ display: 'flex', justifyContent: fromDoctor ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '72%', padding: '10px 14px', borderRadius: fromDoctor ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: fromDoctor ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#f1f5f9',
                    color: fromDoctor ? 'white' : '#1e293b',
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {msg.content ?? msg.body}
                    <div style={{ fontSize: 10, opacity: 0.65, marginTop: 4, textAlign: 'right' }}>
                      {new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compose */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
              placeholder="Type a message to your patient…"
              style={{ flex: 1, padding: '10px 16px', borderRadius: 99, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }}
            />
            <button onClick={sendMsg} disabled={sending || !text.trim()}
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', border: 'none', borderRadius: 99, padding: '10px 22px', fontWeight: 700, cursor: 'pointer', fontSize: 14, opacity: (!text.trim() || sending) ? 0.5 : 1 }}>
              {sending ? '…' : '→'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Disease Tools Panel (Doctor-side) ─────────────────────────────────────────
function DiseaseToolsPanel({ patients }: { patients: any[] }) {
  const conditions = ['All', ...Array.from(new Set(patients.map(p => p.condition).filter(Boolean)))];
  const [condition, setCondition] = useState('All');

  const tools: Record<string, Array<{ icon: string; label: string; desc: string; color: string }>> = {
    'Hypertension': [
      { icon: '📊', label: 'BP Trend Dashboard', desc: 'View population-level BP trends across your hypertension patients', color: '#dc2626' },
      { icon: '🔔', label: 'High BP Alert Rules', desc: 'Auto-alert when patient BP exceeds threshold', color: '#f59e0b' },
      { icon: '💊', label: 'Medication Compliance', desc: 'Track adherence to antihypertensives', color: '#2563eb' },
      { icon: '📋', label: 'JNC Protocol Checker', desc: 'Validate treatment against guidelines', color: '#7c3aed' },
    ],
    'Diabetes': [
      { icon: '🩸', label: 'Glucose Monitor', desc: 'Track HbA1c and daily readings per patient', color: '#d97706' },
      { icon: '📈', label: 'HbA1c Tracker', desc: 'Long-term glycaemic control charts', color: '#2563eb' },
      { icon: '💉', label: 'Insulin Log Review', desc: 'Review patient insulin logs and adjust doses', color: '#7c3aed' },
      { icon: '🍱', label: 'Diet Compliance', desc: 'Review patient carb and meal logs', color: '#22c55e' },
    ],
    'Asthma': [
      { icon: '🌬️', label: 'Peak Flow Monitor', desc: 'Track peak flow readings and trends', color: '#2563eb' },
      { icon: '📓', label: 'Trigger Analysis', desc: 'Identify and map common triggers per patient', color: '#f59e0b' },
      { icon: '💊', label: 'Inhaler Adherence', desc: 'Monitor whether patients are using preventers', color: '#dc2626' },
      { icon: '🌍', label: 'Air Quality Alerts', desc: 'Notify high-risk patients on bad air days', color: '#059669' },
    ],
  };

  const currentTools = condition !== 'All' ? (tools[condition] ?? []) : Object.values(tools).flat().slice(0, 6);

  return (
    <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid #e2e8f0', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>🛠️ Disease Management Tools</h3>
        <select value={condition} onChange={e => setCondition(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, background: 'white', cursor: 'pointer' }}>
          {conditions.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {currentTools.map(t => (
          <button key={t.label} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.color; (e.currentTarget as HTMLElement).style.background = '#eff6ff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD
// =============================================================================

export default function DoctorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socket } = useSocket();

  const doctorId = user?._id || user?.id || '';
  const { appointments, patients, alerts, earnings, stats, services, loading, error, refresh } = useDoctorData(doctorId);

  // Read ?tab= from URL so header nav links work
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(urlTab ?? 'overview');
  const [socketConnected, setSocketConnected] = useState(false);

  // ── Auth redirect ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ── Sync tab with URL param ──────────────────────────────────────────────
  useEffect(() => {
    if (urlTab) setActiveTab(urlTab);
  }, [urlTab]);

  // ── Socket listeners ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    setSocketConnected(socket.connected);
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('doctor:alert:new', () => refresh());
    socket.on('doctor:appointment:updated', () => refresh());
    socket.on('doctor:payment:received', () => refresh());
    socket.on('patient:message:new', () => refresh());
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('doctor:alert:new');
      socket.off('doctor:appointment:updated');
      socket.off('doctor:payment:received');
      socket.off('patient:message:new');
    };
  }, [socket, refresh]);

  // ── Guards ───────────────────────────────────────────────────────────────
  if (authLoading) return <Spinner label="Checking credentials…" />;
  if (!user || user.role !== 'doctor') return null;
  if (loading) return <Spinner label="Loading your dashboard…" />;

  // ── Derived ──────────────────────────────────────────────────────────────
  const unreadAlerts = alerts?.filter((a: any) => !a.read).length ?? 0;
  const unreadMessages = stats?.unreadMessages ?? 0;

  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: '🏠' },
    { id: 'appointments',  label: 'Appointments',  icon: '📅' },
    { id: 'patients',      label: 'Patients',      icon: '👥' },
    { id: 'alerts',        label: 'Alerts',        icon: '🔔', badge: unreadAlerts },
    { id: 'messages',      label: 'Messages',      icon: '💬', badge: unreadMessages },
    { id: 'tools',         label: 'Disease Tools', icon: '🛠️' },
    { id: 'services',      label: 'Services',      icon: '🏥' },
    { id: 'payments',      label: 'Payments',      icon: '💰' },
    { id: 'settings',      label: 'Settings',      icon: '⚙️' },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <DoctorHeader
        doctor={user}
        stats={{ unreadMessages, activeAlerts: unreadAlerts }}
        socketConnected={socketConnected}
      />

      {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '13px 16px',
                  border: 'none',
                  background: 'transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#64748b',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', width: 17, height: 17, fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', animation: 'fadeIn 0.2s ease' }}>

        {/* Error banner */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#dc2626', fontSize: 14 }}>⚠️ {error}</span>
            <button onClick={refresh} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontWeight: 700, textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Hero */}
            <OverviewHero doctor={user} stats={stats} appointments={appointments} />

            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
              <StatCard icon="👥" label="Total Patients" value={stats?.totalPatients ?? patients?.length ?? 0} sub="under your care" color="#2563eb" />
              <StatCard icon="📅" label="Today's Visits" value={stats?.todayCount ?? 0} sub={`${stats?.completedToday ?? 0} done · ${stats?.upcomingToday ?? 0} pending`} color="#7c3aed" />
              <StatCard icon="💰" label="Month Revenue" value={`KES ${(earnings?.monthRevenue ?? 0).toLocaleString()}`} color="#22c55e" trend={earnings?.growth !== undefined ? { value: earnings.growth, label: 'vs last month' } : undefined} />
              <StatCard icon="⭐" label="Active Services" value={services?.length ?? 0} sub="listed on marketplace" color="#f59e0b" />
              <StatCard icon="🔔" label="Unread Alerts" value={unreadAlerts} sub={unreadAlerts > 0 ? 'need attention' : 'all clear'} color={unreadAlerts > 0 ? '#ef4444' : '#22c55e'} />
            </div>

            {/* Upcoming strip */}
            <UpcomingStrip appointments={appointments?.upcoming ?? []} onViewAll={() => setActiveTab('appointments')} />

            {/* Today + High Risk side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
              <TodayAppointments
                appointments={appointments?.today ?? []}
                onViewAll={() => setActiveTab('appointments')}
                onRefresh={refresh}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <HighRiskPanel patients={patients ?? []} onViewPatient={() => setActiveTab('patients')} />
                {/* Recent alerts preview */}
                <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid #e2e8f0', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>🔔 Recent Alerts</h3>
                    <button onClick={() => setActiveTab('alerts')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View All →</button>
                  </div>
                  {alerts?.length ? (
                    alerts.slice(0, 4).map((a: any) => <AlertItem key={a._id} alert={a} onRead={refresh} />)
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>✅ No active alerts</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── APPOINTMENTS ───────────────────────────────────────────────── */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <TodayAppointments
              appointments={appointments?.today ?? []}
              onViewAll={() => {}}
              onRefresh={refresh}
            />
            <AppointmentList appointments={appointments?.all ?? []} onRefresh={refresh} />
          </div>
        )}

        {/* ── PATIENTS ───────────────────────────────────────────────────── */}
        {activeTab === 'patients' && (
          <PatientList patients={patients ?? []} onRefresh={refresh} />
        )}

        {/* ── ALERTS ─────────────────────────────────────────────────────── */}
        {activeTab === 'alerts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Patient Alerts</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{unreadAlerts} unread</span>
                {unreadAlerts > 0 && (
                  <button
                    onClick={async () => {
                      const api = require('@/lib/utils/api').default;
                      await api.put(`/doctors/${doctorId}/alerts/read-all`);
                      refresh();
                    }}
                    style={{ background: '#eff6ff', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
                    Mark All Read
                  </button>
                )}
              </div>
            </div>
            {alerts?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alerts.map((a: any) => <AlertItem key={a._id} alert={a} onRead={refresh} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>All clear!</h3>
                <p style={{ marginTop: 6 }}>No active alerts from your patients.</p>
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES ───────────────────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <MessagesTab doctorId={doctorId} socket={socket} />
        )}

        {/* ── DISEASE TOOLS ──────────────────────────────────────────────── */}
        {activeTab === 'tools' && (
          <DiseaseToolsPanel patients={patients ?? []} />
        )}

        {/* ── SERVICES ───────────────────────────────────────────────────── */}
        {activeTab === 'services' && (
          <ServiceManager doctorId={doctorId} />
        )}

        {/* ── PAYMENTS ───────────────────────────────────────────────────── */}
        {activeTab === 'payments' && (
          <PaymentsPanel earnings={earnings} />
        )}

        {/* ── SETTINGS ───────────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <DoctorSettings doctor={user} />
        )}
      </div>

      {/* ── FLOATING QUICK ACTIONS ──────────────────────────────────────── */}
      <QuickActions floating />
    </div>
  );
}