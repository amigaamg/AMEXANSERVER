import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { formatDate, formatTime } from '@/lib/utils/format';

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  appointment: any;
  onCancel: () => void;
  onReschedule: () => void;
}

export default function AppointmentDetailModal({
  open,
  onClose,
  appointment,
  onCancel,
  onReschedule,
}: AppointmentDetailModalProps) {
  const canJoin = new Date(appointment.date) <= new Date() && appointment.status === 'scheduled';

  return (
    <Modal open={open} onClose={onClose} title="Appointment Details" width={500}>
      <div style={{ marginBottom: 16 }}>
        <Badge variant={appointment.paymentStatus === 'paid' ? 'success' : 'warning'}>
          {appointment.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
        </Badge>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <div><strong>Doctor:</strong> Dr. {appointment.doctorName}</div>
        <div><strong>Clinic:</strong> {appointment.clinicName}</div>
        <div><strong>Date:</strong> {formatDate(appointment.date)} at {formatTime(appointment.date)}</div>
        <div><strong>Reason:</strong> {appointment.reason}</div>
        {appointment.notes && <div><strong>Notes:</strong> {appointment.notes}</div>}
      </div>
      {appointment.status === 'scheduled' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {canJoin && (
            <Button variant="success" onClick={() => window.location.href = `/consultation/${appointment._id}`}>
              Join Consultation
            </Button>
          )}
          <Button variant="outline" onClick={onReschedule}>Reschedule</Button>
          <Button variant="danger" onClick={onCancel}>Cancel</Button>
        </div>
      )}
    </Modal>
  );
}