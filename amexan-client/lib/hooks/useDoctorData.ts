import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';

export function useDoctorData(doctorId: string) {
  const [appointments, setAppointments] = useState<{ today: any[]; all: any[] }>({ today: [], all: [] });
  const [patients, setPatients] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!doctorId) return;
    try {
      setLoading(true);
      const [today, all, patientsData, alertsData, earningsData] = await Promise.all([
        api(`/api/doctors/${doctorId}/appointments/today`).catch(() => []),
        api(`/api/appointments/doctor/${doctorId}`).catch(() => []),
        api(`/api/doctors/${doctorId}/patients`).catch(() => []),
        api(`/api/doctors/${doctorId}/alerts`).catch(() => []),
        api(`/api/doctors/${doctorId}/earnings`).catch(() => null),
      ]);
      setAppointments({ today, all });
      setPatients(patientsData);
      setAlerts(alertsData);
      setEarnings(earningsData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { appointments, patients, alerts, earnings, loading, error, refresh: fetchData };
}