import { useState, useEffect } from 'react';
import { api } from '@/lib/utils/api';

export function useDoctorAppointments(doctorId: string) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    api(`/api/appointments/doctor/${doctorId}`)
      .then(setAppointments)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [doctorId]);

  return { appointments, loading, error };
}