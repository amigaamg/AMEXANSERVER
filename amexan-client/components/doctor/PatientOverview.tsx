import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import { formatDate, timeAgo } from '@/lib/utils/date';
import { bpCategory } from '@/lib/utils/bp';
import type { Patient, Measurement, Alert, Appointment } from '@/types/patient';

interface PatientOverviewProps {
  patient: Patient;
  measurements: Measurement[];
  alerts: Alert[];
  appointments: Appointment[];
  onWriteNote: () => void;
  onPrescribe: () => void;
  onOrderLab: () => void;
  onRefer: () => void;
  onTransfer: () => void;
}

export default function PatientOverview({
  patient,
  measurements,
  alerts,
  appointments,
  onWriteNote,
  onPrescribe,
  onOrderLab,
  onRefer,
  onTransfer,
}: PatientOverviewProps) {
  const latestBP = measurements.filter(m => m.type === 'bp').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
  const bpCat = latestBP ? bpCategory(latestBP.systolic!, latestBP.diastolic!) : null;

  const upcoming = appointments.filter(a => a.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      {/* Patient header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{patient.name}</h3>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {patient.universalId} · {patient.age} yrs · {patient.bloodType} · {patient.condition || '—'}
          </div>
        </div>
        <Pill
          color={patient.riskStatus === 'critical' ? '#ef4444' : patient.riskStatus === 'warning' ? '#f59e0b' : '#22c55e'}
          bg={patient.riskStatus === 'critical' ? '#fef2f2' : patient.riskStatus === 'warning' ? '#fffbeb' : '#f0fdf4'}
        >
          {patient.riskStatus === 'critical' ? '🔴 Critical' : patient.riskStatus === 'warning' ? '🟡 Needs Review' : '🟢 Stable'}
        </Pill>
      </div>

      {/* Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Blood Pressure</div>
          {latestBP ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 700, color: bpCat?.color || '#1e293b' }}>
                {latestBP.systolic}/{latestBP.diastolic} <span style={{ fontSize: 14, color: '#94a3b8' }}>mmHg</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{timeAgo(latestBP.recordedAt)}</div>
            </>
          ) : (
            <div style={{ color: '#94a3b8' }}>No recent reading</div>
          )}
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Pulse</div>
          {latestBP?.pulse ? (
            <>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{latestBP.pulse} <span style={{ fontSize: 14, color: '#94a3b8' }}>bpm</span></div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{timeAgo(latestBP.recordedAt)}</div>
            </>
          ) : (
            <div style={{ color: '#94a3b8' }}>Not recorded</div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Active Alerts</h4>
          {alerts.slice(0, 2).map(alert => (
            <div key={alert._id} style={{
              padding: 12,
              background: alert.severity === 'high' ? '#fef2f2' : alert.severity === 'medium' ? '#fffbeb' : '#f0fdf4',
              borderRadius: 8,
              marginBottom: 8,
              borderLeft: `3px solid ${alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#22c55e'}`,
            }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{alert.title}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{alert.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Next Appointment</h4>
          <div style={{ background: '#eff6ff', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{upcoming[0].clinicType}</div>
            <div style={{ fontSize: 13 }}>{formatDate(upcoming[0].date)} at {upcoming[0].time}</div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Actions</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Button variant="primary" onClick={onWriteNote}>📝 Write Note</Button>
        <Button variant="primary" onClick={onPrescribe}>💊 Prescribe</Button>
        <Button variant="primary" onClick={onOrderLab}>🧪 Order Lab</Button>
        <Button variant="primary" onClick={onRefer}>🔄 Refer</Button>
        <Button variant="outline" onClick={onTransfer} style={{ gridColumn: 'span 2' }}>↩️ Transfer Appointment</Button>
      </div>
    </Card>
  );
}