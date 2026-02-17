import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Pill from '@/components/common/Pill';
import { formatDate, formatTime } from '@/lib/utils/date';

interface AppointmentsListProps {
  appointments: any[];
  onBook: () => void;
  expanded?: boolean;
}

export default function AppointmentsList({ appointments, onBook, expanded }: AppointmentsListProps) {
  const upcoming = appointments.filter(a => a.status === 'scheduled').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

  // Compute first‑visit flag
  const firstVisitMap = new Map();
  upcoming.forEach(apt => {
    const earlier = appointments.some(a => a.doctorId === apt.doctorId && new Date(a.date) < new Date(apt.date));
    firstVisitMap.set(apt._id, !earlier);
  });

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Appointments</h3>
        <Button variant="outline" onClick={onBook} style={{ padding: '6px 12px', fontSize: 12 }}>+ Book</Button>
      </div>
      {upcoming.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
          <p>No upcoming appointments</p>
          <Button onClick={onBook} variant="primary" style={{ marginTop: 12 }}>Book Now</Button>
        </div>
      ) : (
        upcoming.slice(0, expanded ? undefined : 3).map(apt => (
          <div key={apt._id} style={{ borderBottom: '1px solid #f1f5f9', padding: '12px 0' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  {new Date(apt.date).toLocaleDateString('en', { month: 'short' })}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                  {new Date(apt.date).getDate()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.type || 'Consultation'}</div>
                    <div style={{ fontSize: 13, color: '#2563eb' }}>{apt.doctorName || apt.doctor}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{apt.clinicName} · {apt.time}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {firstVisitMap.get(apt._id) && (
                      <Pill color="#2563eb" bg="#eff6ff" style={{ fontSize: 10 }}>🆕 First Visit</Pill>
                    )}
                    <Pill color={apt.paymentStatus === 'paid' ? '#22c55e' : '#f59e0b'} bg={apt.paymentStatus === 'paid' ? '#f0fdf4' : '#fffbeb'}>
                      {apt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </Pill>
                  </div>
                </div>
                {apt.status === 'scheduled' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <Button variant="primary" style={{ padding: '6px 12px', fontSize: 12 }}>Join</Button>
                    <Button variant="outline" style={{ padding: '6px 12px', fontSize: 12 }}>Reschedule</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      {!expanded && upcoming.length > 3 && (
        <button style={{ marginTop: 12, color: '#2563eb', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
          View all {upcoming.length} appointments →
        </button>
      )}
    </Card>
  );
}