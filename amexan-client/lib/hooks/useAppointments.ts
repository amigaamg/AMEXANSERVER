import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import type { Appointment } from '@/types/appointment';

interface UseAppointmentsReturn {
  upcoming: Appointment[];
  past: Appointment[];
  loading: boolean;
  error: string | null;
  cancel: (id: string) => Promise<void>;
  reschedule: (id: string, newDate: Date) => Promise<void>;
  refresh: () => void;
}

export function useAppointments(patientId: string): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await api(API_ROUTES.APPOINTMENTS.PATIENT(patientId));
      setAppointments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancel = async (id: string) => {
    try {
      await api(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const reschedule = async (id: string, newDate: Date) => {
    try {
      await api(`/api/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ date: newDate }),
      });
      fetchAppointments();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const upcoming = appointments.filter(a => a.status === 'scheduled').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return { upcoming, past, loading, error, cancel, reschedule, refresh: fetchAppointments };
}