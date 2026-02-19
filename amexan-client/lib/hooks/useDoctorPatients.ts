import { useState, useEffect } from 'react';
import { api } from '@/lib/utils/api';

export function useDoctorPatients(doctorId: string) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    api(`/api/doctors/${doctorId}/patients`)
      .then(setPatients)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [doctorId]);

  return { patients, loading, error };
}