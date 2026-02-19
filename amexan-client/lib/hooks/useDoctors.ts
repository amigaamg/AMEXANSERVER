import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import type { Doctor } from '@/types/doctor';

interface UseDoctorsReturn {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  refresh: () => void;
}

export function useDoctors(): UseDoctorsReturn {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({});

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api(API_ROUTES.DOCTORS.LIST);
      setDoctors(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, loading, error, filters, setFilters, refresh: fetchDoctors };
}