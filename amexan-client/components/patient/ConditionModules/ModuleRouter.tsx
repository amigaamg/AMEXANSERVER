import React from 'react';
import { DISEASE_MODULES } from '@/lib/config/diseases';
import HypertensionModule from './HypertensionModule';
import DiabetesModule from './DiabetesModule';
import AsthmaModule from './AsthmaModule';
import type { Patient, Measurement } from '@/types/patient';

interface ModuleRouterProps {
  patient: Patient;
  measurements: Measurement[];
  onLogBP?: () => void;
  onLogGlucose?: () => void;
  onLogPeakFlow?: () => void;
}

export default function ModuleRouter({ patient, measurements, onLogBP, onLogGlucose, onLogPeakFlow }: ModuleRouterProps) {
  const conditions = patient.conditions || [];
  const activeModules = conditions
    .map(c => {
      const config = DISEASE_MODULES[c.toLowerCase().replace(' ', '')];
      return config?.moduleName;
    })
    .filter(Boolean);

  if (activeModules.length === 0) return null;

  return (
    <div style={{ marginTop: 20 }}>
      {activeModules.includes('HypertensionModule') && (
        <HypertensionModule measurements={measurements} onLogBP={onLogBP!} />
      )}
      {activeModules.includes('DiabetesModule') && (
        <DiabetesModule measurements={measurements} onLogGlucose={onLogGlucose!} />
      )}
      {activeModules.includes('AsthmaModule') && (
        <AsthmaModule measurements={measurements} onLogPeakFlow={onLogPeakFlow!} />
      )}
    </div>
  );
}