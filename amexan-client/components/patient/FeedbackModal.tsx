import { useState } from 'react';
import Modal from '@/components/common/Modal';
import RatingStars from '@/components/common/RatingStars';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  doctorId: string;
  patientId: string;
  appointmentId: string;
}

export default function FeedbackModal({ open, onClose, doctorId, patientId, appointmentId }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      await api('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          patientId,
          appointmentId,
          rating,
          comment,
        }),
      });
      onClose();
    } catch (err) {
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Rate Your Experience" width={400}>
      <p style={{ marginBottom: 16 }}>How was your consultation?</p>
      <div style={{ marginBottom: 16 }}>
        <RatingStars rating={rating} max={5} interactive onChange={setRating} size={32} />
      </div>
      <Input label="Comment (optional)" value={comment} onChange={e => setComment(e.target.value)} multiline rows={3} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="primary" onClick={submitFeedback} loading={loading}>Submit</Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}