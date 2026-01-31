import { WithId, WithTimestamps } from './index';

// ==================== ENUMS ====================
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  NURSE = 'nurse',
  PHARMACIST = 'pharmacist',
  LAB_TECHNICIAN = 'lab_technician',
  RECEPTIONIST = 'receptionist',
  INSURANCE_AGENT = 'insurance_agent'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  ARCHIVED = 'archived'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated'
}

// ==================== INTERFACES ====================
export interface UserBase extends WithId, WithTimestamps {
  email: string;
  phoneNumber: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: Gender;
  profileImage?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  metadata?: Record<string, any>;
  settings: UserSettings;
}

export interface PatientUser extends UserBase {
  role: UserRole.PATIENT;
  patientId: string;
  medicalRecordNumber: string;
  emergencyContacts: EmergencyContact[];
  allergies: Allergy[];
  bloodType?: BloodType;
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number;
  occupation?: string;
  employer?: string;
  primaryCarePhysicianId?: string;
  insuranceProviderId?: string;
  preferredPharmacyId?: string;
  medicalHistory: MedicalHistoryEntry[];
  familyHistory: FamilyHistoryEntry[];
  lifestyleFactors: LifestyleFactors;
  consents: Consent[];
  devices: ConnectedDevice[];
}

export interface DoctorUser extends UserBase {
  role: UserRole.DOCTOR;
  doctorId: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: Date;
  npiNumber?: string;
  deaNumber?: string;
  specializations: MedicalSpecialization[];
  qualifications: Qualification[];
  experienceYears: number;
  biography?: string;
  languages: string[];
  hospitalAffiliations: HospitalAffiliation[];
  consultationFee: number;
  availability: DoctorAvailability;
  ratings: DoctorRating[];
  patientLimit: number;
  currentPatientCount: number;
  averageRating: number;
  totalReviews: number;
  awards: Award[];
  publications: Publication[];
  certifications: Certification[];
}

export interface AdminUser extends UserBase {
  role: UserRole.ADMIN;
  adminLevel: 'super' | 'regional' | 'hospital';
  permissions: AdminPermission[];
  assignedHospitals?: string[];
  auditLogAccess: boolean;
}

export interface NurseUser extends UserBase {
  role: UserRole.NURSE;
  licenseNumber: string;
  specializations: NursingSpecialization[];
  assignedDoctorIds: string[];
  assignedWard?: string;
  shiftSchedule: NurseShift[];
  certifications: Certification[];
}

// ==================== SUB-TYPES ====================
export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: Coordinates;
  type: 'home' | 'work' | 'billing' | 'shipping';
  isPrimary: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: Address;
  priority: number; // 1 = primary, 2 = secondary, etc.
  canMakeMedicalDecisions: boolean;
}

export interface Allergy {
  id: string;
  allergen: string;
  type: 'food' | 'drug' | 'environmental' | 'insect' | 'latex' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  reaction: string;
  onsetDate: Date;
  lastOccurrence?: Date;
  notes?: string;
  verifiedByDoctor: boolean;
  medicationToAvoid?: string[];
}

export interface MedicalHistoryEntry {
  id: string;
  condition: string;
  diagnosisDate: Date;
  resolvedDate?: Date;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
  treatingDoctor?: string;
  hospitalizations?: Hospitalization[];
  surgeries?: Surgery[];
}

export interface FamilyHistoryEntry {
  id: string;
  relation: 'parent' | 'sibling' | 'grandparent' | 'child' | 'aunt_uncle' | 'cousin';
  condition: string;
  ageAtDiagnosis?: number;
  deceased?: boolean;
  causeOfDeath?: string;
  notes?: string;
}

export interface LifestyleFactors {
  smoking: {
    status: 'never' | 'former' | 'current';
    years?: number;
    packsPerDay?: number;
    quitDate?: Date;
  };
  alcohol: {
    status: 'never' | 'occasional' | 'regular' | 'former';
    drinksPerWeek?: number;
    quitDate?: Date;
  };
  exercise: {
    frequency: 'none' | '1-2' | '3-4' | '5+';
    type?: string[];
    minutesPerSession?: number;
  };
  diet: {
    type: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'other';
    restrictions?: string[];
    supplements?: string[];
  };
  sleep: {
    averageHours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    disorders?: string[];
  };
}

export interface Consent {
  id: string;
  type: 'treatment' | 'privacy' | 'research' | 'telemedicine' | 'data_sharing';
  description: string;
  granted: boolean;
  grantedAt: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  version: string;
  documentUrl?: string;
}

export interface ConnectedDevice {
  id: string;
  type: 'glucometer' | 'bp_monitor' | 'fitness_tracker' | 'smart_scale' | 'ecg' | 'other';
  brand: string;
  model: string;
  serialNumber?: string;
  connectedAt: Date;
  lastSyncAt?: Date;
  settings: Record<string, any>;
}

export enum MedicalSpecialization {
  // Primary Care
  FAMILY_MEDICINE = 'family_medicine',
  INTERNAL_MEDICINE = 'internal_medicine',
  PEDIATRICS = 'pediatrics',
  GERIATRICS = 'geriatrics',
  
  // Specialties
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  ENDOCRINOLOGY = 'endocrinology',
  GASTROENTEROLOGY = 'gastroenterology',
  HEMATOLOGY = 'hematology',
  INFECTIOUS_DISEASE = 'infectious_disease',
  NEPHROLOGY = 'nephrology',
  NEUROLOGY = 'neurology',
  ONCOLOGY = 'oncology',
  OPHTHALMOLOGY = 'ophthalmology',
  ORTHOPEDICS = 'orthopedics',
  OTOLARYNGOLOGY = 'otolaryngology',
  PSYCHIATRY = 'psychiatry',
  PULMONOLOGY = 'pulmonology',
  RHEUMATOLOGY = 'rheumatology',
  UROLOGY = 'urology',
  
  // Surgical Specialties
  GENERAL_SURGERY = 'general_surgery',
  CARDIAC_SURGERY = 'cardiac_surgery',
  NEUROSURGERY = 'neurosurgery',
  ORTHOPEDIC_SURGERY = 'orthopedic_surgery',
  PLASTIC_SURGERY = 'plastic_surgery',
  
  // Diagnostic
  RADIOLOGY = 'radiology',
  PATHOLOGY = 'pathology',
  ANESTHESIOLOGY = 'anesthesiology'
}

export enum NursingSpecialization {
  CRITICAL_CARE = 'critical_care',
  EMERGENCY = 'emergency',
  PEDIATRICS = 'pediatrics',
  ONCOLOGY = 'oncology',
  CARDIAC = 'cardiac',
  NEURO = 'neuro',
  ORTHOPEDIC = 'orthopedic',
  PSYCHIATRIC = 'psychiatric',
  GERIATRIC = 'geriatric',
  HOME_HEALTH = 'home_health'
}

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
  country: string;
  certificateUrl?: string;
  verified: boolean;
}

export interface HospitalAffiliation {
  hospitalId: string;
  hospitalName: string;
  department: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  privileges: string[];
}

export interface DoctorAvailability {
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  workingHours: {
    start: string; // "09:00" in 24-hour format
    end: string;   // "17:00"
  };
  breakTime?: {
    start: string;
    end: string;
    duration: number; // minutes
  };
  timeZone: string;
  appointmentDuration: number; // minutes
  bufferTime: number; // minutes between appointments
  unavailableDates: Date[];
  recurringUnavailable: RecurringUnavailable[];
}

export interface RecurringUnavailable {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface DoctorRating {
  id: string;
  patientId: string;
  rating: number; // 1-5
  waitTimeRating?: number;
  bedsideMannerRating?: number;
  expertiseRating?: number;
  comment?: string;
  date: Date;
  wouldRecommend: boolean;
  anonymous: boolean;
  verified: boolean;
}

export interface Award {
  name: string;
  organization: string;
  year: number;
  description?: string;
  url?: string;
}

export interface Publication {
  title: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  authors: string[];
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  url?: string;
}

export interface Hospitalization {
  id: string;
  hospital: string;
  reason: string;
  admissionDate: Date;
  dischargeDate?: Date;
  diagnosis?: string;
  procedures?: string[];
  notes?: string;
}

export interface Surgery {
  id: string;
  procedure: string;
  date: Date;
  hospital: string;
  surgeon: string;
  notes?: string;
  complications?: string[];
}

export interface NurseShift {
  dayOfWeek: number;
  shift: 'morning' | 'afternoon' | 'night' | 'flexible';
  startTime: string;
  endTime: string;
  ward?: string;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  language: LanguageSettings;
}

export interface NotificationSettings {
  email: NotificationChannelSettings;
  sms: NotificationChannelSettings;
  push: NotificationChannelSettings;
  inApp: NotificationChannelSettings;
}

export interface NotificationChannelSettings {
  enabled: boolean;
  appointmentReminders: boolean;
  medicationReminders: boolean;
  labResults: boolean;
  billing: boolean;
  healthAlerts: boolean;
  promotional: boolean;
}

export interface PrivacySettings {
  shareHealthDataWithDoctors: boolean;
  shareHealthDataForResearch: boolean;
  visibleInDirectory: boolean;
  allowMessagesFrom: 'anyone' | 'contacts' | 'doctors_only' | 'none';
  showOnlineStatus: boolean;
  dataRetentionPeriod: '3_months' | '6_months' | '1_year' | '3_years' | 'indefinite';
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
  highContrast: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  colorBlindMode: boolean;
}

export interface LanguageSettings {
  primary: string;
  fallback?: string;
  medicalTermsInNativeLanguage: boolean;
}

export interface AdminPermission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
  scope: 'global' | 'regional' | 'hospital';
}