import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import type { LabResult, ImagingStudy } from '@/types/lab';

interface UseLabsReturn {
  labs: LabResult[];
  imaging: ImagingStudy[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useLabs(patientId: string): UseLabsReturn {
  const [labs, setLabs] = useState<LabResult[]>([]);
  const [imaging, setImaging] = useState<ImagingStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const [labsData, imagingData] = await Promise.all([
        api(API_ROUTES.PATIENTS.LABS(patientId)),
        api(API_ROUTES.PATIENTS.IMAGING(patientId)),
      ]);
      setLabs(labsData);
      setImaging(imagingData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { labs, imaging, loading, error, refresh: fetchData };
}