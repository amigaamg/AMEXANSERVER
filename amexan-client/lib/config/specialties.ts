export interface DiseaseModuleConfig {
  conditionName: string;
  icd10Codes: string[];
  moduleName: string; // component name in ConditionModules/
  defaultTargets: {
    systolic?: number;
    diastolic?: number;
    glucose?: number;
    hba1c?: number;
  };
  educationTags: string[];
  alertRules: {
    type: string;
    threshold: any;
    severity: 'low' | 'medium' | 'high';
    message: string;
  }[];
}

export const DISEASE_MODULES: Record<string, DiseaseModuleConfig> = {
  hypertension: {
    conditionName: 'Hypertension',
    icd10Codes: ['I10', 'I11', 'I12'],
    moduleName: 'HypertensionModule',
    defaultTargets: { systolic: 130, diastolic: 80 },
    educationTags: ['hypertension', 'blood-pressure'],
    alertRules: [
      {
        type: 'bp_high',
        threshold: { systolic: 160 },
        severity: 'high',
        message: 'Your BP is critically high. Contact your doctor immediately.',
      },
      {
        type: 'bp_elevated',
        threshold: { systolic: 140 },
        severity: 'medium',
        message: 'Your BP is above target. Review your medications.',
      },
    ],
  },
  diabetes: {
    conditionName: 'Diabetes Mellitus',
    icd10Codes: ['E10', 'E11', 'E12'],
    moduleName: 'DiabetesModule',
    defaultTargets: { glucose: 7.0, hba1c: 7.0 },
    educationTags: ['diabetes', 'glucose'],
    alertRules: [
      {
        type: 'glucose_high',
        threshold: { glucose: 10.0 },
        severity: 'high',
        message: 'Your blood glucose is very high. Check ketones.',
      },
    ],
  },
  asthma: {
    conditionName: 'Asthma',
    icd10Codes: ['J45'],
    moduleName: 'AsthmaModule',
    defaultTargets: {},
    educationTags: ['asthma', 'peak-flow'],
    alertRules: [
      {
        type: 'peakflow_low',
        threshold: { peakflow: 200 },
        severity: 'high',
        message: 'Your peak flow is low. Use rescue inhaler.',
      },
    ],
  },
};