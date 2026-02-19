import { useState, useEffect } from 'react';
import { api } from '@/lib/utils/api';

export function useDoctorEarnings(doctorId: string) {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    api(`/api/doctors/${doctorId}/earnings`)
      .then(setEarnings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [doctorId]);

  return { earnings, loading, error };
}