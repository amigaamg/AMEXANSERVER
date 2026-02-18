import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import PatientDetailModal from './PatientDetailModal';
import { formatTime } from '@/lib/utils/date';

interface Patient {
  _id: string;
  name: string;
}

interface Appointment {
  _id: string;
  patientId?: Patient;
  clinicType: string;
  date: string;
  isFirstVisit?: boolean;
}

interface TodayAppointmentsProps {
  appointments: Appointment[];
  expanded?: boolean;
}

export default function TodayAppointments({ appointments, expanded }: TodayAppointmentsProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  if (!appointments.length) {
    return (
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Today's Appointments</h3>
        <p style={{ color: '#94a3b8' }}>No appointments today.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Today's Appointments</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {appointments.map(apt => (
          <div key={apt._id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {apt.patientId?.name}
                  {apt.isFirstVisit && (
                    <Pill color="#2563eb" bg="#eff6ff" style={{ marginLeft: 8, fontSize: 10 }}>🆕 First Visit</Pill>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#2563eb' }}>{apt.clinicType}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Time: {formatTime(apt.date)}</div>
              </div>
              <Button
                variant="primary"
                style={{ padding: '4px 12px', fontSize: 12 }}
                onClick={() => apt.patientId && setSelectedPatient(apt.patientId)}
              >
                Start
              </Button>
            </div>
          </div>
        ))}
      </div>
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          appointmentId={appointments.find(a => a.patientId?._id === selectedPatient._id)?._id}
        />
      )}
    </Card>
  );
}