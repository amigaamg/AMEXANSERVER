import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface EmergencyModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
}

export default function EmergencyModal({ open, onClose, patientId }: EmergencyModalProps) {
  const alertCareTeam = async () => {
    try {
      await api('/api/alerts/emergency', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          type: 'emergency',
          message: 'Patient requested emergency help',
        }),
      });
      alert('✅ Your care team has been alerted. They will contact you shortly.');
      onClose();
    } catch {
      alert('Failed to send alert. Please call emergency directly.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Emergency Assistance" width={400}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚑</div>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Need urgent help?</h4>
        <p style={{ color: '#64748b', marginBottom: 20 }}>Choose an option below. All actions are logged and sent to your care team.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="tel:0800723253" style={{ textDecoration: 'none' }}>
            <Button variant="danger" style={{ width: '100%', padding: 14 }}>📞 Call Emergency: 0800 723 253</Button>
          </a>
          <Button variant="outline" onClick={alertCareTeam} style={{ width: '100%', padding: 14 }}>🚨 Alert My Care Team</Button>
          <Button variant="outline" onClick={() => { onClose(); window.location.href = '/booking'; }} style={{ width: '100%', padding: 14 }}>🏥 Book Urgent Appointment</Button>
          <Button variant="text" onClick={onClose} style={{ width: '100%' }}>I'm okay — Close</Button>
        </div>
      </div>
    </Modal>
  );
}