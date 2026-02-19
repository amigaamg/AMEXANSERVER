import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import type { Measurement } from '@/types/patient';

interface UseVitalsReturn {
  measurements: Measurement[];
  latestBP?: Measurement;
  latestGlucose?: Measurement;
  latestWeight?: Measurement;
  loading: boolean;
  error: string | null;
  logReading: (type: string, data: any) => Promise<void>;
  refresh: () => void;
}

export function useVitals(patientId: string): UseVitalsReturn {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeasurements = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await api(API_ROUTES.PATIENTS.MEASUREMENTS(patientId));
      setMeasurements(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);

  const logReading = useCallback(
    async (type: string, data: any) => {
      try {
        await api(API_ROUTES.PATIENTS.MEASUREMENTS(patientId), {
          method: 'POST',
          body: JSON.stringify({ type, ...data }),
        });
        fetchMeasurements(); // refresh
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    [patientId, fetchMeasurements]
  );

  const latestBP = measurements.filter((m) => m.type === 'bp').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
  const latestGlucose = measurements.filter((m) => m.type === 'glucose').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
  const latestWeight = measurements.filter((m) => m.type === 'weight').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];

  return {
    measurements,
    latestBP,
    latestGlucose,
    latestWeight,
    loading,
    error,
    logReading,
    refresh: fetchMeasurements,
  };
}