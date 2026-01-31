import { WithId, WithTimestamps } from './index';
import { Range } from './index';

export enum DiseaseType {
  DIABETES = 'diabetes',
  HYPERTENSION = 'hypertension',
  ASTHMA = 'asthma',
  HEART_DISEASE = 'heart_disease',
  COPD = 'copd',
  ARTHRITIS = 'arthritis',
  CKD = 'chronic_kidney_disease',
  DEPRESSION = 'depression',
  ANXIETY = 'anxiety',
  EPILEPSY = 'epilepsy',
  PARKINSON = 'parkinson',
  MS = 'multiple_sclerosis',
  IBD = 'inflammatory_bowel_disease'
}

export enum DiabetesType {
  TYPE_1 = 'type_1',
  TYPE_2 = 'type_2',
  GESTATIONAL = 'gestational',
  PREDIABETES = 'prediabetes',
  LADA = 'lada',
  MODY = 'mody'
}

export enum HypertensionStage {
  NORMAL = 'normal',
  ELEVATED = 'elevated',
  STAGE_1 = 'stage_1',
  STAGE_2 = 'stage_2',
  HYPERTENSIVE_CRISIS = 'hypertensive_crisis'
}

export enum AsthmaSeverity {
  INTERMITTENT = 'intermittent',
  MILD_PERSISTENT = 'mild_persistent',
  MODERATE_PERSISTENT = 'moderate_persistent',
  SEVERE_PERSISTENT = 'severe_persistent'
}

export enum CKDStage {
  STAGE_1 = 'stage_1', // GFR ≥90
  STAGE_2 = 'stage_2', // GFR 60-89
  STAGE_3A = 'stage_3a', // GFR 45-59
  STAGE_3B = 'stage_3b', // GFR 30-44
  STAGE_4 = 'stage_4',  // GFR 15-29
  STAGE_5 = 'stage_5'   // GFR <15
}

export interface ChronicDisease extends WithId, WithTimestamps {
  patientId: string;
  diseaseType: DiseaseType;
  diagnosisDate: Date;
  diagnosedBy: string;
  diagnosisFacility?: string;
  
  // Disease-specific data
  diseaseData: DiseaseSpecificData;
  
  // Severity & Progression
  currentStage: string;
  severity: 'mild' | 'moderate' | 'severe';
  progressionRate: 'slow' | 'moderate' | 'rapid';
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  
  // Symptoms
  currentSymptoms: Symptom[];
  symptomFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  symptomSeverity: number; // 0-10
  
  // Complications
  complications: DiseaseComplication[];
  complicationRisk: 'low' | 'medium' | 'high';
  
  // Treatment
  treatmentPlan: TreatmentPlan;
  medications: DiseaseMedication[];
  lastMedicationReview?: Date;
  
  // Monitoring
  monitoringFrequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
  monitoringParameters: MonitoringParameter[];
  lastReadingDate?: Date;
  
  // Goals
  treatmentGoals: TreatmentGoal[];
  goalAchievement: number; // 0-100%
  
  // Lifestyle Management
  lifestyleRecommendations: LifestyleRecommendation[];
  adherenceScore: number; // 0-100%
  
  // Support
  supportTeam: SupportTeamMember[];
  patientEducation: EducationMaterial[];
  
  // Quality of Life
  qualityOfLife: QualityOfLifeMetrics;
  functionalStatus: FunctionalStatus;
  
  // Emergency Information
  emergencyPlan?: EmergencyPlan;
  crisisSigns: string[];
  
  // Metadata
  notes?: string;
  attachments?: DiseaseAttachment[];
  metadata?: Record<string, any>;
}

export type DiseaseSpecificData = 
  | DiabetesData
  | HypertensionData
  | AsthmaData
  | HeartDiseaseData
  | COPDData
  | ArthritisData
  | CKDData
  | GenericDiseaseData;

export interface DiabetesData {
  type: DiabetesType;
  hba1c: {
    current: number;
    target: Range<number>;
    lastTestDate?: Date;
    trend: 'improving' | 'stable' | 'worsening';
  };
  glucose: {
    fasting: Range<number>;
    postprandial: Range<number>;
    bedtime: Range<number>;
  };
  insulin: {
    regimen?: InsulinRegimen;
    totalDailyDose?: number;
    carbRatio?: number;
    correctionFactor?: number;
  };
  complications: DiabetesComplication[];
  devices: DiabetesDevice[];
  dietPlan: DiabetesDietPlan;
}

export interface InsulinRegimen {
  type: 'basal_bolus' | 'pump' | 'mixed' | 'other';
  basalInsulin?: InsulinDose;
  bolusInsulin?: InsulinDose[];
  schedule: InsulinSchedule[];
}

export interface InsulinDose {
  type: string;
  brand?: string;
  dosage: number;
  unit: 'units';
  timing?: string;
}

export interface InsulinSchedule {
  time: string;
  type: 'basal' | 'bolus' | 'correction';
  insulin: string;
  dosage: number;
  condition?: 'pre_meal' | 'post_meal' | 'bedtime';
}

export interface DiabetesComplication {
  type: 'neuropathy' | 'retinopathy' | 'nephropathy' | 'cardiovascular' | 'foot_ulcers';
  stage: 'early' | 'moderate' | 'advanced';
  diagnosisDate?: Date;
  treatment?: string;
  notes?: string;
}

export interface DiabetesDevice {
  type: 'cgm' | 'insulin_pump' | 'glucometer' | 'smart_pen';
  brand: string;
  model: string;
  serialNumber?: string;
  lastCalibration?: Date;
  sensorExpiry?: Date;
  settings: DeviceSettings;
}

export interface DiabetesDietPlan {
  carbCounting: boolean;
  carbTargets: {
    perMeal: Range<number>;
    perDay: Range<number>;
  };
  mealTiming: string[];
  foodRestrictions: string[];
  recommendedFoods: string[];
}

export interface HypertensionData {
  stage: HypertensionStage;
  bloodPressure: {
    current: {
      systolic: number;
      diastolic: number;
    };
    target: {
      systolic: Range<number>;
      diastolic: Range<number>;
    };
    measurementFrequency: string;
  };
  riskFactors: HypertensionRiskFactor[];
  targetOrganDamage: OrganDamage[];
  saltRestriction: boolean;
  saltLimit?: number; // mg per day
}

export interface HypertensionRiskFactor {
  factor: 'smoking' | 'obesity' | 'sedentary' | 'high_salt' | 'stress' | 'family_history' | 'age' | 'ethnicity';
  severity: 'low' | 'medium' | 'high';
  modifiable: boolean;
}

export interface OrganDamage {
  organ: 'heart' | 'kidneys' | 'eyes' | 'brain' | 'arteries';
  damage: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface AsthmaData {
  severity: AsthmaSeverity;
  controlLevel: 'well_controlled' | 'not_well_controlled' | 'very_poorly_controlled';
  peakFlow: {
    personalBest: number;
    zones: {
      green: Range<number>; // 80-100%
      yellow: Range<number>; // 50-79%
      red: Range<number>;   // <50%
    };
  };
  triggers: AsthmaTrigger[];
  actionPlan: AsthmaActionPlan;
  inhalerTechnique: 'good' | 'needs_improvement' | 'poor';
  spacerUsed: boolean;
}

export interface AsthmaTrigger {
  trigger: string;
  severity: 'mild' | 'moderate' | 'severe';
  avoidanceMeasures: string[];
}

export interface AsthmaActionPlan {
  greenZone: ActionZone;
  yellowZone: ActionZone;
  redZone: ActionZone;
  emergencyContact: string;
  emergencyInstructions: string;
}

export interface ActionZone {
  symptoms: string[];
  peakFlowRange: Range<number>;
  medications: EmergencyMedication[];
  actions: string[];
  whenToCallDoctor: string;
}

export interface EmergencyMedication {
  name: string;
  dosage: string;
  frequency: string;
  maxDosesPerDay: number;
}

export interface HeartDiseaseData {
  condition: 'cad' | 'arrhythmia' | 'heart_failure' | 'valvular' | 'congenital';
  ejectionFraction?: number; // percentage
  nyhaClass?: 'I' | 'II' | 'III' | 'IV';
  procedures: CardiacProcedure[];
  devices: CardiacDevice[];
  riskFactors: CardiacRiskFactor[];
  activityLimitations: string[];
}

export interface CardiacProcedure {
  type: 'cath' | 'stent' | 'bypass' | 'valve_replacement' | 'pacemaker' | 'defibrillator';
  date: Date;
  facility: string;
  outcomes?: string;
}

export interface CardiacDevice {
  type: 'pacemaker' | 'icd' | 'crv' | 'lvad';
  brand: string;
  model: string;
  implantDate: Date;
  lastCheck?: Date;
  settings: DeviceSettings;
}

export interface CardiacRiskFactor {
  factor: string;
  controlled: boolean;
  controlMethod?: string;
}

export interface CKDData {
  stage: CKDStage;
  gfr: {
    current: number;
    trend: 'improving' | 'stable' | 'declining';
    lastTestDate: Date;
  };
  proteinuria: {
    level: 'normal' | 'mild' | 'moderate' | 'severe';
    measurement?: string;
  };
  dialysis?: DialysisInfo;
  transplantStatus?: TransplantInfo;
  dietRestrictions: DietRestriction[];
  fluidRestriction?: number; // ml per day
}

export interface DialysisInfo {
  type: 'hemodialysis' | 'peritoneal';
  frequency: string;
  accessType: string;
  facility?: string;
  startDate: Date;
}

export interface TransplantInfo {
  status: 'evaluating' | 'waitlisted' | 'transplanted' | 'rejected';
  waitlistDate?: Date;
  transplantDate?: Date;
  organType?: string;
  immunosuppressants: string[];
}

export interface GenericDiseaseData {
  subtype?: string;
  severityScore?: number;
  progressionMarkers: DiseaseMarker[];
  treatmentResponse: TreatmentResponse;
}

export interface DiseaseMarker {
  name: string;
  value: number;
  unit: string;
  normalRange: Range<number>;
  trend: 'improving' | 'stable' | 'worsening';
}

// Common Interfaces
export interface Symptom {
  name: string;
  severity: number; // 0-10
  frequency: string;
  triggers?: string[];
  alleviatingFactors?: string[];
  impactOnLife: 'none' | 'mild' | 'moderate' | 'severe';
}

export interface DiseaseComplication {
  name: string;
  dateDiagnosed?: Date;
  severity: 'mild' | 'moderate' | 'severe';
  treatment?: string;
  status: 'active' | 'resolved' | 'chronic';
}

export interface TreatmentPlan {
  goals: string[];
  interventions: TreatmentIntervention[];
  timeline: TreatmentTimeline[];
  successCriteria: string[];
}

export interface TreatmentIntervention {
  type: 'medication' | 'therapy' | 'surgery' | 'lifestyle' | 'device';
  description: string;
  startDate: Date;
  endDate?: Date;
  provider?: string;
  outcomes?: string;
}

export interface TreatmentTimeline {
  phase: string;
  duration: string;
  objectives: string[];
  milestones: string[];
}

export interface DiseaseMedication {
  medicationId: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  startDate: Date;
  endDate?: Date;
  sideEffects: SideEffect[];
  adherence: number; // 0-100%
  notes?: string;
}

export interface SideEffect {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  onsetDate: Date;
  management?: string;
  reportedToDoctor: boolean;
}

export interface MonitoringParameter {
  parameter: string;
  target: Range<number>;
  frequency: string;
  unit: string;
  method: 'self' | 'device' | 'clinic';
  lastReading?: number;
  lastReadingDate?: Date;
}

export interface TreatmentGoal {
  goal: string;
  target: string;
  current: string;
  deadline?: Date;
  progress: number; // 0-100%
  barriers?: string[];
}

export interface LifestyleRecommendation {
  category: 'diet' | 'exercise' | 'stress' | 'sleep' | 'other';
  recommendation: string;
  importance: 'high' | 'medium' | 'low';
  adherence: number; // 0-100%
  barriers?: string[];
}

export interface SupportTeamMember {
  role: string;
  name: string;
  contact: string;
  frequency: string;
  notes?: string;
}

export interface EducationMaterial {
  title: string;
  type: 'article' | 'video' | 'pdf' | 'website';
  url: string;
  dateProvided: Date;
  understood: boolean;
  questions?: string[];
}

export interface QualityOfLifeMetrics {
  physical: number; // 0-100
  emotional: number;
  social: number;
  functional: number;
  overall: number;
  lastAssessment: Date;
}

export interface FunctionalStatus {
  mobility: 'independent' | 'assisted' | 'dependent';
  adls: { // Activities of Daily Living
    bathing: 'independent' | 'assisted' | 'dependent';
    dressing: 'independent' | 'assisted' | 'dependent';
    toileting: 'independent' | 'assisted' | 'dependent';
    transferring: 'independent' | 'assisted' | 'dependent';
    feeding: 'independent' | 'assisted' | 'dependent';
  };
  iadls: { // Instrumental ADLs
    cooking: 'independent' | 'assisted' | 'dependent';
    cleaning: 'independent' | 'assisted' | 'dependent';
    shopping: 'independent' | 'assisted' | 'dependent';
    finances: 'independent' | 'assisted' | 'dependent';
    medications: 'independent' | 'assisted' | 'dependent';
  };
}

export interface EmergencyPlan {
  emergencyContacts: string[];
  hospitalPreference?: string;
  medicationsToBring: string[];
  importantDocuments: string[];
  specialInstructions: string;
}

export interface DiseaseAttachment {
  type: 'lab_result' | 'image' | 'document' | 'prescription' | 'letter';
  name: string;
  url: string;
  date: Date;
  notes?: string;
}

// Health Reading Interface
export interface HealthReading extends WithId, WithTimestamps {
  patientId: string;
  diseaseType: DiseaseType;
  readingType: ReadingType;
  value: number;
  unit: string;
  measuredAt: Date;
  deviceId?: string;
  deviceType: 'manual' | 'glucometer' | 'bp_monitor' | 'peak_flow_meter' | 'scale' | 'fitness_tracker' | 'ecg' | 'other';
  context: ReadingContext;
  tags: string[];
  notes?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export enum ReadingType {
  GLUCOSE = 'glucose',
  HBA1C = 'hba1c',
  BLOOD_PRESSURE = 'blood_pressure',
  PEAK_FLOW = 'peak_flow',
  HEART_RATE = 'heart_rate',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  TEMPERATURE = 'temperature',
  SPO2 = 'oxygen_saturation',
  CHOLESTEROL = 'cholesterol',
  TRIGLYCERIDES = 'triglycerides',
  CREATININE = 'creatinine',
  GFR = 'gfr',
  URINE_ALBUMIN = 'urine_albumin',
  INSULIN = 'insulin',
  ACTIVITY = 'activity',
  SLEEP = 'sleep'
}

export interface ReadingContext {
  fasting?: boolean;
  timeSinceMeal?: number; // minutes
  medicationTaken?: boolean;
  activityLevel?: 'resting' | 'light' | 'moderate' | 'vigorous';
  stressLevel?: 'low' | 'medium' | 'high';
  symptoms?: string[];
  bodyPosition?: 'sitting' | 'standing' | 'lying';
  armUsed?: 'left' | 'right';
}

// Alert System
export interface HealthAlert extends WithId, WithTimestamps {
  patientId: string;
  diseaseType: DiseaseType;
  alertType: AlertType;
  severity: AlertSeverity;
  readingId?: string;
  readingValue?: number;
  threshold?: Range<number>;
  message: string;
  actions: AlertAction[];
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  escalationLevel: number;
  metadata?: Record<string, any>;
}

export enum AlertType {
  THRESHOLD = 'threshold',
  TREND = 'trend',
  MISSING_READING = 'missing_reading',
  MEDICATION_ADHERENCE = 'medication_adherence',
  APPOINTMENT = 'appointment',
  SYSTEM = 'system'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency'
}

export interface AlertAction {
  type: 'notify' | 'schedule_appointment' | 'adjust_medication' | 'contact_emergency' | 'escalate';
  parameters: Record<string, any>;
  completed: boolean;
  completedAt?: Date;
}

// Trend Analysis
export interface TrendAnalysis {
  patientId: string;
  diseaseType: DiseaseType;
  parameter: string;
  period: '24h' | '7d' | '30d' | '90d' | '1y';
  dataPoints: TrendDataPoint[];
  summary: TrendSummary;
  insights: string[];
  recommendations: string[];
}

export interface TrendDataPoint {
  timestamp: Date;
  value: number;
  context?: ReadingContext;
}

export interface TrendSummary {
  average: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  trend: 'improving' | 'stable' | 'worsening' | 'volatile';
  confidence: number; // 0-100%
  variability: 'low' | 'medium' | 'high';
}