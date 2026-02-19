import { useMemo } from 'react';
import { DISEASE_MODULES } from '@/lib/config/diseases';
import type { Patient } from '@/types/patient';

export function useConditionModules(patient: Patient | null) {
  const activeModules = useMemo(() => {
    if (!patient || !patient.conditions) return [];
    return patient.conditions
      .map(c => {
        const key = c.toLowerCase().replace(/\s+/g, '');
        return DISEASE_MODULES[key]?.moduleName;
      })
      .filter(Boolean);
  }, [patient]);

  return activeModules;
}