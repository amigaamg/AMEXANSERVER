import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { formatDate, formatTime } from '@/lib/utils/date';
import type { Appointment } from '@/types/appointment';

interface AppointmentListProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const statusColors = {
    scheduled: 'info',
    confirmed: 'success',
    completed: 'success',
    cancelled: 'danger',
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Appointments</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#94a3b8', padding: 20, textAlign: 'center' }}>No appointments found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(apt => (
            <div key={apt._id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{apt.patientName || apt.patientId?.name}</div>
                  <div style={{ fontSize: 13, color: '#2563eb' }}>{apt.clinicName}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    {formatDate(apt.date)} at {formatTime(apt.date)}
                  </div>
                  {apt.reason && <div style={{ fontSize: 12, color: '#1e293b', marginTop: 4 }}>Reason: {apt.reason}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge variant={statusColors[apt.status] as any}>{apt.status}</Badge>
                  <Badge variant={apt.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {apt.paymentStatus}
                  </Badge>
                </div>
              </div>
              {apt.status === 'scheduled' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button variant="primary" size="sm">Start Consultation</Button>
                  <Button variant="outline" size="sm">Reschedule</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}