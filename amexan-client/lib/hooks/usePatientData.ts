// lib/hooks/usePatientData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fetches ALL patient dashboard data in one parallel burst.
// • Uses Promise.allSettled — one failing endpoint never crashes the dashboard.
// • 404s are silently swallowed (backend routes may not all exist yet).
// • Returns empty arrays / null as safe fallbacks.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/utils/api';
import type { Patient } from '@/types/patient';
import type { DoctorService } from '@/types/services';

export interface PatientDashboardData {
  patient:      Patient | null;
  measurements: any[];
  medications:  any[];
  appointments: any[];
  alerts:       any[];
  messages:     any[];
  labs:         any[];
  imaging:      any[];
  visits:       any[];
  payments:     any[];
  education:    any[];
  services:     DoctorService[];
  loading:      boolean;
  error:        string | null;
  refresh:      () => void;
}

// ── Normalise a settled result into the expected type ─────────────────────────
// Handles all API response shapes:
//   • Direct value:          res.value = [...]  or  res.value = {...}
//   • Wrapped in .data:      res.value = { data: [...] }
//   • Wrapped in .results:   res.value = { results: [...] }
//   • 404 / any rejection:   return fallback silently
function safe<T>(res: PromiseSettledResult<any>, fallback: T): T {
  if (res.status === 'rejected') {
    // Log only non-404 errors — 404 just means the route isn't built yet
    const msg: string = res.reason?.message ?? '';
    if (!msg.includes('404') && !msg.includes('HTTP 404')) {
      console.warn('usePatientData fetch failed:', msg);
    }
    return fallback;
  }

  const val = res.value;

  if (val === null || val === undefined) return fallback;

  // Unwrap common envelope shapes
  if (Array.isArray(val))            return val as T;
  if (Array.isArray(val?.data))      return val.data as T;
  if (Array.isArray(val?.results))   return val.results as T;
  if (Array.isArray(val?.items))     return val.items as T;

  // Single object (e.g. patient profile)
  if (typeof val === 'object')       return val as T;

  return fallback;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function usePatientData(patientId: string): PatientDashboardData {
  const [data, setData] = useState<Omit<PatientDashboardData, 'refresh'>>({
    patient:      null,
    measurements: [],
    medications:  [],
    appointments: [],
    alerts:       [],
    messages:     [],
    labs:         [],
    imaging:      [],
    visits:       [],
    payments:     [],
    education:    [],
    services:     [],
    loading:      true,
    error:        null,
  });

  const fetchAll = useCallback(async () => {
    if (!patientId) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    // All 12 requests fire in parallel — a single 404 won't block the rest
    const [
      patientRes,
      measurementsRes,
      medicationsRes,
      appointmentsRes,
      alertsRes,
      messagesRes,
      labsRes,
      imagingRes,
      visitsRes,
      paymentsRes,
      educationRes,
      servicesRes,
    ] = await Promise.allSettled([
      api.get(`/patients/${patientId}`),
      api.get(`/patients/${patientId}/measurements`),
      api.get(`/patients/${patientId}/medications`),
      api.get(`/patients/${patientId}/appointments`),
      api.get(`/patients/${patientId}/alerts`),
      api.get(`/patients/${patientId}/messages`),
      api.get(`/patients/${patientId}/labs`),
      api.get(`/patients/${patientId}/imaging`),
      api.get(`/patients/${patientId}/visits`),
      api.get(`/patients/${patientId}/payments`),
      api.get(`/education`),
      api.get(`/services`),
    ]);

    setData({
      patient:      safe<Patient | null>(patientRes,      null),
      measurements: safe<any[]>(measurementsRes,          []),
      medications:  safe<any[]>(medicationsRes,           []),
      appointments: safe<any[]>(appointmentsRes,          []),
      alerts:       safe<any[]>(alertsRes,                []),
      messages:     safe<any[]>(messagesRes,              []),
      labs:         safe<any[]>(labsRes,                  []),
      imaging:      safe<any[]>(imagingRes,               []),
      visits:       safe<any[]>(visitsRes,                []),
      payments:     safe<any[]>(paymentsRes,              []),
      education:    safe<any[]>(educationRes,             []),
      services:     safe<DoctorService[]>(servicesRes,    []),
      loading:      false,
      error:        null,
    });
  }, [patientId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { ...data, refresh: fetchAll };
}