import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import type { Medication } from '@/types/condition';

interface UseMedicationsReturn {
  medications: Medication[];
  loading: boolean;
  error: string | null;
  toggleTaken: (id: string, taken: boolean) => Promise<void>;
  requestRefill: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useMedications(patientId: string): UseMedicationsReturn {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeds = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await api(API_ROUTES.PATIENTS.MEDICATIONS(patientId));
      setMedications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchMeds();
  }, [fetchMeds]);

  const toggleTaken = async (id: string, taken: boolean) => {
    try {
      await api(`/api/patients/${patientId}/medications/${id}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ taken }),
      });
      fetchMeds();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const requestRefill = async (id: string) => {
    try {
      await api(`/api/patients/${patientId}/medications/${id}/refill`, {
        method: 'POST',
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { medications, loading, error, toggleTaken, requestRefill, refresh: fetchMeds };
}