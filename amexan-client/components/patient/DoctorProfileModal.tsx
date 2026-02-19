import Modal from '@/components/common/Modal';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import RatingStars from '@/components/common/RatingStars';
import Button from '@/components/common/Button';
import type { Doctor } from '@/types/doctor';

interface DoctorProfileModalProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor;
}

export default function DoctorProfileModal({ open, onClose, doctor }: DoctorProfileModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Doctor Profile" width={600}>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <Avatar name={doctor.name} size={80} />
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Dr. {doctor.name}</h2>
          <p style={{ color: '#2563eb', marginBottom: 4 }}>{doctor.specialty}</p>
          <p style={{ fontSize: 13, color: '#64748b' }}>{doctor.qualifications?.join(', ')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <RatingStars rating={doctor.rating} size={16} />
            <span style={{ fontSize: 12, color: '#64748b' }}>({doctor.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>About</h4>
        <p style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.6 }}>
          Dr. {doctor.name} has {doctor.experienceYears} years of experience and speaks {doctor.languages?.join(', ')}.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Clinics & Services</h4>
        {doctor.clinics?.map(clinic => (
          <div key={clinic._id} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{clinic.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{clinic.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>KES {clinic.price}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{clinic.duration} min</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" style={{ flex: 1 }} onClick={() => window.location.href = `/dashboard/patient/book/${doctor._id}`}>Book Appointment</Button>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}