import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Appointment } from '@/types/patient';
import { formatDate, formatTime } from '@/lib/utils/date';

interface AppointmentsListProps {
  appointments: Appointment[];
  onBook: () => void;
}

export default function AppointmentsList({ appointments, onBook }: AppointmentsListProps) {
  const upcoming = appointments.filter(a => a.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Appointments</h3>
        <Button variant="outline" onClick={onBook} size="sm">+ Book</Button>
      </div>
      {upcoming.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
          <p>No upcoming appointments</p>
          <Button variant="primary" onClick={onBook} style={{ marginTop: 12 }}>Book Now</Button>
        </div>
      ) : (
        upcoming.slice(0, 3).map(apt => (
          <div key={apt._id} style={{ borderBottom: '1px solid #f1f5f9', padding: '12px 0' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 48, textAlign: 'center', background: '#f1f5f9', borderRadius: 8, padding: '4px 0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  {new Date(apt.date).toLocaleDateString('en', { month: 'short' })}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                  {new Date(apt.date).getDate()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.clinicType}</div>
                <div style={{ fontSize: 13, color: '#2563eb' }}>{apt.doctorName || 'Doctor'}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{formatTime(apt.date)}</div>
              </div>
              {apt.paymentStatus === 'paid' && (
                <Pill color="#22c55e" bg="#f0fdf4">Paid</Pill>
              )}
            </div>
          </div>
        ))
      )}
    </Card>
  );
}