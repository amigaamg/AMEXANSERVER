import { WithId, WithTimestamps } from './index';
import { Range } from './index';

export enum MedicationType {
  PRESCRIPTION = 'prescription',
  OVER_THE_COUNTER = 'over_the_counter',
  SUPPLEMENT = 'supplement',
  HERBAL = 'herbal',
  VACCINE = 'vaccine'
}

export enum AdministrationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  INHALATION = 'inhalation',
  INJECTION = 'injection',
  SUBLINGUAL = 'sublingual',
  BUCCAL = 'buccal',
  RECTAL = 'rectal',
  VAGINAL = 'vaginal',
  OCULAR = 'ocular',
  OTIC = 'otic',
  NASAL = 'nasal',
  TRANSDERMAL = 'transdermal'
}

export enum MedicationForm {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  LIQUID = 'liquid',
  CREAM = 'cream',
  OINTMENT = 'ointment',
  GEL = 'gel',
  PATCH = 'patch',
  INHALER = 'inhaler',
  NEBULIZER = 'nebulizer',
  INJECTION = 'injection',
  SUPPOSITORY = 'suppository',
  DROPS = 'drops',
  SPRAY = 'spray',
  POWDER = 'powder'
}

export enum FrequencyUnit {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  AS_NEEDED = 'as_needed'
}

export interface Medication extends WithId, WithTimestamps {
  patientId: string;
  prescriptionId?: string;
  
  // Medication Information
  name: string;
  genericName?: string;
  brandName?: string;
  ndc?: string; // National Drug Code
  rxcui?: string; // RxNorm Concept Unique Identifier
  type: MedicationType;
  
  // Dosage & Administration
  dosage: string;
  strength: string; // e.g., "500mg"
  form: MedicationForm;
  route: AdministrationRoute;
  frequency: Frequency;
  timing: Timing;
  duration?: string;
  startDate: Date;
  endDate?: Date;
  
  // Prescription Details
  prescribedBy: string;
  prescribedDate: Date;
  pharmacy?: PharmacyInfo;
  refills: RefillInfo;
  instructions: string;
  indication?: string;
  
  // Safety & Interactions
  contraindications: Contraindication[];
  warnings: Warning[];
  sideEffects: SideEffect[];
  interactions: DrugInteraction[];
  storageInstructions: string;
  disposalInstructions: string;
  
  // Adherence & Monitoring
  adherence: AdherenceMetrics;
  reminders: ReminderSettings;
  monitoringParameters: MonitoringParameter[];
  
  // Cost & Insurance
  cost: MedicationCost;
  insuranceCoverage: InsuranceCoverage;
  
  // Status
  status: MedicationStatus;
  lastTaken?: Date;
  nextDose?: Date;
  stock: StockInfo;
  
  // Metadata
  notes?: string;
  attachments?: MedicationAttachment[];
  metadata?: Record<string, any>;
}

export interface Frequency {
  value: number;
  unit: FrequencyUnit;
  timesPerDay?: number;
  specificTimes?: string[]; // "08:00", "12:00", "20:00"
  asNeededFor?: string; // e.g., "pain", "anxiety"
}

export interface Timing {
  withFood: 'before' | 'with' | 'after' | 'empty_stomach';
  specificInstructions?: string;
  timeWindow?: Range<number>; // minutes before/after scheduled time
}

export interface PharmacyInfo {
  pharmacyId?: string;
  name: string;
  address: string;
  phoneNumber: string;
  pharmacist?: string;
  hours?: PharmacyHours;
}

export interface PharmacyHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface RefillInfo {
  authorized: number;
  remaining: number;
  lastRefill?: Date;
  nextRefillEligible?: Date;
  autoRefill: boolean;
  refillReminderDays: number;
}

export interface Contraindication {
  condition: string;
  severity: 'absolute' | 'relative';
  reason?: string;
}

export interface Warning {
  type: 'black_box' | 'contraindication' | 'precaution' | 'other';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SideEffect {
  effect: string;
  frequency: 'very_common' | 'common' | 'uncommon' | 'rare' | 'very_rare';
  severity: 'mild' | 'moderate' | 'severe';
  onset: 'immediate' | 'early' | 'delayed';
  management?: string;
  reported: boolean;
  reportedDate?: Date;
}

export interface DrugInteraction {
  interactingMedication: string;
  severity: 'major' | 'moderate' | 'minor';
  mechanism?: string;
  effect?: string;
  recommendation?: string;
  management?: string;
}

export interface AdherenceMetrics {
  overall: number; // 0-100%
  byPeriod: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
  missedDoses: MissedDose[];
  takenOnTime: number; // percentage
  refillAdherence: number; // percentage
  barriers: AdherenceBarrier[];
}

export interface MissedDose {
  date: Date;
  scheduledTime: string;
  reason?: string;
  madeUp: boolean;
  madeUpTime?: Date;
}

export interface AdherenceBarrier {
  barrier: string;
  frequency: 'rarely' | 'sometimes' | 'often' | 'always';
  impact: 'low' | 'medium' | 'high';
  interventions: string[];
}

export interface ReminderSettings {
  enabled: boolean;
  methods: ReminderMethod[];
  advanceNotice: number; // minutes
  snoozeDuration: number; // minutes
  maxSnoozes: number;
  quietHours?: {
    start: string;
    end: string;
  };
}

export interface ReminderMethod {
  type: 'push' | 'sms' | 'email' | 'call' | 'smart_device';
  enabled: boolean;
  template?: string;
}

export interface MonitoringParameter {
  parameter: string;
  frequency: string;
  targetRange?: Range<number>;
  unit?: string;
  instructions?: string;
}

export interface MedicationCost {
  pricePerUnit: number;
  unit: string;
  totalCost: number;
  copay?: number;
  deductibleApplied?: number;
  outOfPocket?: number;
  assistancePrograms: AssistanceProgram[];
}

export interface AssistanceProgram {
  name: string;
  status: 'applied' | 'approved' | 'denied' | 'pending';
  savings?: number;
}

export interface InsuranceCoverage {
  covered: boolean;
  tier?: 'generic' | 'preferred' | 'non_preferred' | 'specialty';
  priorAuthRequired: boolean;
  priorAuthStatus?: 'pending' | 'approved' | 'denied';
  quantityLimit?: number;
  daysSupplyLimit?: number;
  stepTherapyRequired: boolean;
}

export enum MedicationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  ON_HOLD = 'on_hold',
  EXPIRED = 'expired'
}

export interface StockInfo {
  currentStock: number;
  unit: string;
  daysRemaining: number;
  lowStockThreshold: number;
  refillNeeded: boolean;
  lastInventoryCheck?: Date;
}

export interface MedicationAttachment {
  type: 'prescription' | 'insurance' | 'instructions' | 'receipt' | 'image';
  name: string;
  url: string;
  uploadedDate: Date;
}

// Prescription Types
export interface Prescription extends WithId, WithTimestamps {
  patientId: string;
  doctorId: string;
  
  // Prescription Details
  medication: MedicationDetails;
  sig: string; // Directions in Latin
  quantity: number;
  daysSupply: number;
  refills: number;
  substitutionAllowed: boolean;
  daw: boolean; // Dispense As Written
  
  // Clinical Information
  diagnosis?: string;
  icd10Code?: string;
  notes?: string;
  
  // Status & Workflow
  status: PrescriptionStatus;
  workflow: PrescriptionWorkflow;
  
  // Electronic Prescribing
  escribeId?: string;
  deaRequired: boolean;
  controlledSchedule?: 'II' | 'III' | 'IV' | 'V';
  
  // Pharmacy
  pharmacy: PharmacySelection;
  transmissionStatus: TransmissionStatus;
  
  // Billing
  billing: PrescriptionBilling;
  
  // Legal
  signature: PrescriptionSignature;
  
  metadata?: Record<string, any>;
}

export interface MedicationDetails {
  name: string;
  genericName?: string;
  ndc: string;
  strength: string;
  form: MedicationForm;
  route: AdministrationRoute;
}

export enum PrescriptionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  FILLED = 'filled',
  PARTIALLY_FILLED = 'partially_filled',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  DISPENSED = 'dispensed',
  COMPLETED = 'completed'
}

export interface PrescriptionWorkflow {
  steps: WorkflowStep[];
  currentStep: number;
  lastUpdated: Date;
  history: WorkflowHistory[];
}

export interface WorkflowStep {
  step: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
  actor?: string;
  dueDate?: Date;
}

export interface WorkflowHistory {
  step: number;
  action: string;
  actor: string;
  timestamp: Date;
  notes?: string;
}

export interface PharmacySelection {
  preferred: boolean;
  pharmacyId?: string;
  name: string;
  address: string;
  phoneNumber: string;
  faxNumber?: string;
}

export interface TransmissionStatus {
  method: 'fax' | 'electronic' | 'paper';
  status: 'pending' | 'sent' | 'received' | 'failed';
  sentAt?: Date;
  receivedAt?: Date;
  confirmationId?: string;
  error?: string;
}

export interface PrescriptionBilling {
  billingCode?: string;
  priorAuthRequired: boolean;
  priorAuthStatus?: 'pending' | 'approved' | 'denied';
  insuranceCoverage?: InsuranceCoverage;
  patientCost?: number;
}

export interface PrescriptionSignature {
  doctorName: string;
  licenseNumber: string;
  deaNumber?: string;
  signatureImage?: string;
  signedAt: Date;
  electronicSignature: boolean;
}

// Medication Log Types
export interface MedicationLog extends WithId, WithTimestamps {
  patientId: string;
  medicationId: string;
  
  // Log Details
  scheduledTime: Date;
  takenTime?: Date;
  status: LogStatus;
  
  // Dosage Information
  dosageTaken: string;
  actualDosage?: string; // if different from prescribed
  
  // Context
  context: LogContext;
  
  // Adherence Metrics
  adherence: {
    onTime: boolean;
    lateBy?: number; // minutes
    missed: boolean;
    taken: boolean;
  };
  
  // Notes & Issues
  notes?: string;
  sideEffects?: SideEffect[];
  issues?: LogIssue[];
  
  // Verification
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationMethod?: 'self' | 'caregiver' | 'device' | 'nurse';
  
  metadata?: Record<string, any>;
}

export enum LogStatus {
  SCHEDULED = 'scheduled',
  TAKEN = 'taken',
  MISSED = 'missed',
  SKIPPED = 'skipped',
  LATE = 'late',
  RESCHEDULED = 'rescheduled'
}

export interface LogContext {
  withFood?: boolean;
  symptomsBefore?: string[];
  symptomsAfter?: string[];
  activityLevel?: string;
  stressLevel?: number;
  location?: string;
  takenBy?: 'self' | 'caregiver' | 'nurse';
}

export interface LogIssue {
  type: 'side_effect' | 'forgot' | 'refused' | 'unavailable' | 'dose_error' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolution?: string;
}

// Medication Inventory
export interface MedicationInventory extends WithId, WithTimestamps {
  patientId: string;
  medicationId: string;
  
  // Stock Information
  currentStock: number;
  unit: string;
  lotNumber?: string;
  expirationDate?: Date;
  
  // Location
  storageLocation: string;
  storageConditions: string;
  
  // Refill Management
  lastRefill: InventoryRefill;
  nextRefillDate?: Date;
  autoRefill: boolean;
  
  // Monitoring
  usageRate: number; // units per day
  daysRemaining: number;
  lowStockAlert: boolean;
  stockoutRisk: 'low' | 'medium' | 'high';
  
  // Cost
  unitCost: number;
  totalValue: number;
  
  // Safety
  safetyChecks: SafetyCheck[];
  
  metadata?: Record<string, any>;
}

export interface InventoryRefill {
  date: Date;
  quantity: number;
  source: 'pharmacy' | 'mail_order' | 'hospital' | 'other';
  prescriptionId?: string;
  cost?: number;
}

export interface SafetyCheck {
  check: string;
  status: 'passed' | 'failed' | 'pending';
  checkedAt?: Date;
  checkedBy?: string;
  notes?: string;
}

// Drug Interaction Checker
export interface DrugInteractionCheck {
  medications: string[];
  interactions: InteractionResult[];
  severity: 'none' | 'minor' | 'moderate' | 'major';
  recommendations: string[];
  lastChecked: Date;
}

export interface InteractionResult {
  medications: string[];
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  mechanism?: string;
  management?: string;
  references?: string[];
}

// Medication Analytics
export interface MedicationAnalytics {
  patientId: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Adherence Metrics
  adherence: {
    overall: number;
    byMedication: MedicationAdherence[];
    trend: AdherenceTrend[];
    patterns: AdherencePattern[];
  };
  
  // Cost Analysis
  cost: {
    total: number;
    byMedication: MedicationCostBreakdown[];
    insuranceCoverage: number;
    outOfPocket: number;
    trend: CostTrend[];
  };
  
  // Safety Metrics
  safety: {
    sideEffectRate: number;
    interactionAlerts: number;
    adherenceToMonitoring: number;
    safetyIncidents: SafetyIncident[];
  };
  
  // Effectiveness
  effectiveness: {
    conditionControl: Record<string, number>; // condition -> control percentage
    symptomImprovement: Record<string, number>;
    labImprovement: Record<string, number>;
  };
  
  // Insights
  insights: MedicationInsight[];
  recommendations: MedicationRecommendation[];
}

export interface MedicationAdherence {
  medicationId: string;
  name: string;
  adherence: number;
  missedDoses: number;
  takenOnTime: number;
  barriers: string[];
}

export interface AdherenceTrend {
  date: Date;
  adherence: number;
}

export interface AdherencePattern {
  pattern: string; // e.g., "misses evening doses", "better adherence on weekdays"
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}

export interface MedicationCostBreakdown {
  medicationId: string;
  name: string;
  totalCost: number;
  patientCost: number;
  insuranceCoverage: number;
}

export interface CostTrend {
  period: string;
  totalCost: number;
  patientCost: number;
}

export interface SafetyIncident {
  type: 'side_effect' | 'interaction' | 'overdose' | 'underdose' | 'allergy';
  severity: 'low' | 'medium' | 'high';
  date: Date;
  resolved: boolean;
  impact: string;
}

export interface MedicationInsight {
  type: 'adherence' | 'cost' | 'safety' | 'effectiveness' | 'interaction';
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
}

export interface MedicationRecommendation {
  type: 'dosage' | 'timing' | 'substitution' | 'discontinuation' | 'monitoring';
  recommendation: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
  evidence?: string[];
}