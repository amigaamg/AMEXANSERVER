import { useState, useEffect } from 'react';
import { api } from '@/lib/utils/api';

export function useDoctorAlerts(doctorId: string) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    api(`/api/doctors/${doctorId}/alerts`)
      .then(setAlerts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [doctorId]);

  return { alerts, loading, error };
}