import { WithId, WithTimestamps } from './index';

export enum InsuranceType {
  PRIVATE = 'private',
  GOVERNMENT = 'government',
  EMPLOYER = 'employer',
  MEDICARE = 'medicare',
  MEDICAID = 'medicaid',
  TRICARE = 'tricare',
  VA = 'va',
  WORKERS_COMP = 'workers_comp',
  AUTO = 'auto',
  OTHER = 'other'
}

export enum InsuranceStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  TERMINATED = 'terminated',
  COBRA = 'cobra',
  GRACE_PERIOD = 'grace_period',
  SUSPENDED = 'suspended'
}

export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  RECEIVED = 'received',
  ADJUDICATED = 'adjudicated',
  PAID = 'paid',
  DENIED = 'denied',
  APPEALED = 'appealed',
  REJECTED = 'rejected',
  PENDING = 'pending',
  PROCESSING = 'processing',
  CLOSED = 'closed'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  OVERDUE = 'overdue',
  WRITTEN_OFF = 'written_off',
  REFUNDED = 'refunded'
}

export interface InsurancePolicy extends WithId, WithTimestamps {
  patientId: string;
  
  // Policy Information
  insuranceType: InsuranceType;
  providerId: string;
  providerName: string;
  policyNumber: string;
  groupNumber?: string;
  memberId: string;
  relationship: 'self' | 'spouse' | 'child' | 'other';
  
  // Coverage Period
  effectiveDate: Date;
  terminationDate?: Date;
  status: InsuranceStatus;
  cobra: boolean;
  
  // Plan Details
  planName: string;
  planType: 'hmo' | 'ppo' | 'epo' | 'pos' | 'hdhp' | 'medicare_advantage';
  metalTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'catastrophic';
  
  // Cost Sharing
  costSharing: CostSharing;
  outOfPocket: OutOfPocketLimits;
  
  // Network
  network: NetworkInfo;
  
  // Benefits
  benefits: PolicyBenefits;
  
  // Prior Authorization
  priorAuthRequirements: PriorAuthRequirement[];
  
  // Claims
  claimsProcessing: ClaimsProcessingInfo;
  
  // Contact Information
  contactInfo: InsuranceContact;
  
  // Documents
  documents: InsuranceDocument[];
  
  // Verification
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
  
  metadata?: Record<string, any>;
}

export interface CostSharing {
  deductible: {
    individual: number;
    family: number;
    metIndividual: number;
    metFamily: number;
  };
  copayments: Copayment[];
  coinsurance: Coinsurance[];
  outOfNetwork: OutOfNetworkCosts;
  prescription: PrescriptionCostSharing;
}

export interface Copayment {
  service: string;
  amount: number;
  inNetwork: boolean;
  notes?: string;
}

export interface Coinsurance {
  service: string;
  percentage: number; // 0-100
  inNetwork: boolean;
  notes?: string;
}

export interface OutOfNetworkCosts {
  deductible: number;
  coinsurance: number;
  outOfPocketMax: number;
}

export interface PrescriptionCostSharing {
  tiers: PrescriptionTier[];
  mailOrder: MailOrderDiscount;
  specialty: SpecialtyMedicationCoverage;
}

export interface PrescriptionTier {
  tier: 'generic' | 'preferred' | 'non_preferred' | 'specialty';
  copayment: number;
  coinsurance?: number;
  priorAuthRequired: boolean;
  quantityLimit?: number;
}

export interface MailOrderDiscount {
  available: boolean;
  discount: number;
  daySupply: number;
}

export interface SpecialtyMedicationCoverage {
  covered: boolean;
  priorAuthRequired: boolean;
  quantityLimit: boolean;
  specialtyPharmacy: boolean;
}

export interface OutOfPocketLimits {
  individual: number;
  family: number;
  metIndividual: number;
  metFamily: number;
  includesDeductible: boolean;
  includesCopays: boolean;
  includesCoinsurance: boolean;
}

export interface NetworkInfo {
  type: 'hmo' | 'ppo' | 'epo';
  primaryCareRequired: boolean;
  referralsRequired: boolean;
  inNetworkProviders: string[];
  hospitals: string[];
  pharmacies: string[];
  labs: string[];
  imagingCenters: string[];
}

export interface PolicyBenefits {
  preventive: {
    covered: boolean;
    frequency: string;
    costShare: 'full' | 'partial' | 'none';
  };
  emergency: {
    covered: boolean;
    priorAuthRequired: boolean;
    costShare: number;
  };
  hospitalization: HospitalizationBenefits;
  mentalHealth: MentalHealthBenefits;
  maternity: MaternityBenefits;
  rehabilitation: RehabilitationBenefits;
  durableMedicalEquipment: DMEBenefits;
  homeHealth: HomeHealthBenefits;
  hospice: HospiceBenefits;
}

export interface HospitalizationBenefits {
  roomAndBoard: {
    covered: boolean;
    limit?: number;
    costShare: number;
  };
  surgery: {
    covered: boolean;
    costShare: number;
  };
  intensiveCare: {
    covered: boolean;
    costShare: number;
  };
}

export interface MentalHealthBenefits {
  outpatient: {
    visits: number;
    costShare: number;
  };
  inpatient: {
    days: number;
    costShare: number;
  };
  substanceAbuse: {
    covered: boolean;
    costShare: number;
  };
}

export interface MaternityBenefits {
  prenatal: {
    visits: number;
    costShare: number;
  };
  delivery: {
    covered: boolean;
    costShare: number;
  };
  postpartum: {
    visits: number;
    costShare: number;
  };
}

export interface RehabilitationBenefits {
  physicalTherapy: {
    visits: number;
    costShare: number;
  };
  occupationalTherapy: {
    visits: number;
    costShare: number;
  };
  speechTherapy: {
    visits: number;
    costShare: number;
  };
}

export interface DMEBenefits {
  covered: boolean;
  rental: boolean;
  purchase: boolean;
  priorAuthRequired: boolean;
  costShare: number;
}

export interface HomeHealthBenefits {
  covered: boolean;
  visits: number;
  priorAuthRequired: boolean;
  costShare: number;
}

export interface HospiceBenefits {
  covered: boolean;
  days: number;
  costShare: number;
}

export interface PriorAuthRequirement {
  service: string;
  required: boolean;
  criteria: string;
  turnaroundTime: number; // days
}

export interface ClaimsProcessingInfo {
  submissionMethod: 'electronic' | 'paper';
  submissionTimeline: number; // days
  appealTimeline: number; // days
  paymentTimeline: number; // days
  denialReasons: string[];
}

export interface InsuranceContact {
  phone: string;
  fax?: string;
  website?: string;
  email?: string;
  address: string;
  customerServiceHours: string;
  claimsDepartment: string;
  priorAuthDepartment: string;
}

export interface InsuranceDocument {
  type: 'id_card' | 'policy' | 'sbc' | 'eob' | 'other';
  name: string;
  url: string;
  uploadedDate: Date;
  effectiveDate: Date;
}

// Claims Management
export interface InsuranceClaim extends WithId, WithTimestamps {
  patientId: string;
  providerId: string;
  insurancePolicyId: string;
  
  // Claim Information
  claimNumber: string;
  type: 'medical' | 'dental' | 'vision' | 'pharmacy' | 'hospital';
  submissionDate: Date;
  serviceDate: Date;
  
  // Patient Information
  patientInfo: ClaimPatientInfo;
  subscriberInfo: SubscriberInfo;
  
  // Provider Information
  providerInfo: ClaimProviderInfo;
  facilityInfo?: FacilityInfo;
  
  // Service Details
  services: ClaimService[];
  diagnosis: ClaimDiagnosis[];
  procedures: ClaimProcedure[];
  
  // Billing
  billing: ClaimBilling;
  
  // Status & Processing
  status: ClaimStatus;
  processing: ClaimProcessing;
  
  // Payment
  payment: ClaimPayment;
  
  // Appeals
  appeals: ClaimAppeal[];
  
  // Documents
  documents: ClaimDocument[];
  
  // Notes
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ClaimPatientInfo {
  name: string;
  dateOfBirth: Date;
  gender: string;
  relationship: string;
}

export interface SubscriberInfo {
  name: string;
  dateOfBirth: Date;
  gender: string;
  employer?: string;
  groupNumber?: string;
}

export interface ClaimProviderInfo {
  npi: string;
  name: string;
  address: string;
  phone: string;
  taxId?: string;
}

export interface FacilityInfo {
  name: string;
  type: 'hospital' | 'clinic' | 'lab' | 'imaging' | 'surgery_center';
  address: string;
  npi?: string;
}

export interface ClaimService {
  lineNumber: number;
  serviceDate: Date;
  cptCode: string;
  description: string;
  quantity: number;
  unit: string;
  charge: number;
  allowed: number;
  paid: number;
  patientResponsibility: number;
  adjustment: number;
  denialReason?: string;
  notes?: string;
}

export interface ClaimDiagnosis {
  code: string; // ICD-10
  description: string;
  primary: boolean;
  presentOnAdmission?: boolean;
}

export interface ClaimProcedure {
  code: string; // CPT/HCPCS
  description: string;
  date: Date;
  provider?: string;
}

export interface ClaimBilling {
  totalCharges: number;
  totalAllowed: number;
  totalPaid: number;
  totalPatientResponsibility: number;
  totalAdjustments: number;
  billingCodes: BillingCode[];
  taxId?: string;
}

export interface BillingCode {
  type: 'cpt' | 'hcpcs' | 'icd10' | 'revenue';
  code: string;
  description: string;
  modifier?: string;
}

export interface ClaimProcessing {
  receivedDate?: Date;
  processedDate?: Date;
  processor: string;
  adjudicationDate?: Date;
  denialDate?: Date;
  denialReason?: string;
  appealDeadline?: Date;
}

export interface ClaimPayment {
  status: PaymentStatus;
  paidAmount: number;
  paidDate?: Date;
  paymentMethod?: string;
  checkNumber?: string;
  eftInfo?: EFTInfo;
  patientBalance: number;
  insuranceBalance: number;
}

export interface EFTInfo {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  transactionId: string;
}

export interface ClaimAppeal {
  appealNumber: string;
  appealDate: Date;
  reason: string;
  supportingDocuments: string[];
  status: 'submitted' | 'under_review' | 'approved' | 'denied';
  decisionDate?: Date;
  decisionReason?: string;
  amountApproved?: number;
}

export interface ClaimDocument {
  type: 'claim_form' | 'medical_record' | 'eob' | 'prescription' | 'invoice' | 'other';
  name: string;
  url: string;
  uploadedDate: Date;
  size: number;
}

// Insurance Analytics
export interface InsuranceAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  
  // Coverage Metrics
  coverage: {
    totalPolicies: number;
    byType: Record<InsuranceType, number>;
    activePolicies: number;
    averagePremium: number;
    renewalRate: number;
  };
  
  // Claims Metrics
  claims: {
    totalClaims: number;
    totalAmount: number;
    averageClaimAmount: number;
    byStatus: Record<ClaimStatus, number>;
    denialRate: number;
    averageProcessingTime: number;
    topDiagnosis: DiagnosisFrequency[];
    topProcedures: ProcedureFrequency[];
  };
  
  // Financial Metrics
  financial: {
    totalPayments: number;
    totalPatientResponsibility: number;
    totalAdjustments: number;
    collectionRate: number;
    costPerClaim: number;
    byServiceType: Record<string, number>;
  };
  
  // Quality Metrics
  quality: {
    appealSuccessRate: number;
    patientSatisfaction: number;
    providerSatisfaction: number;
    accuracyRate: number;
    timelinessScore: number;
  };
  
  // Network Metrics
  network: {
    providerUtilization: number;
    averageProviderRating: number;
    networkAdequacy: number;
    referralPatterns: ReferralPattern[];
  };
  
  insights: InsuranceInsight[];
  recommendations: InsuranceRecommendation[];
}

export interface DiagnosisFrequency {
  diagnosis: string;
  icd10Code: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
}

export interface ProcedureFrequency {
  procedure: string;
  cptCode: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
}

export interface ReferralPattern {
  fromSpecialty: string;
  toSpecialty: string;
  count: number;
  averageDelay: number;
  successRate: number;
}

export interface InsuranceInsight {
  type: 'coverage' | 'claims' | 'financial' | 'quality' | 'network';
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
}

export interface InsuranceRecommendation {
  type: 'policy' | 'process' | 'network' | 'financial' | 'compliance';
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

// Insurance Provider Types
export interface InsuranceProvider extends WithId, WithTimestamps {
  name: string;
  type: InsuranceType;
  taxId?: string;
  naicNumber?: string; // National Association of Insurance Commissioners
  stateLicenses: string[];
  
  // Contact Information
  headquarters: Address;
  mailingAddress?: Address;
  contact: ProviderContact;
  
  // Network
  networkSize: number;
  providerCount: number;
  hospitalCount: number;
  pharmacyCount: number;
  
  // Financial
  financialRating?: string; // A.M. Best rating
  marketShare: number;
  premiumVolume: number;
  
  // Performance
  performance: ProviderPerformance;
  
  // Accreditation
  accreditations: Accreditation[];
  
  // Products
  products: InsuranceProduct[];
  
  // Compliance
  compliance: ComplianceInfo;
  
  metadata?: Record<string, any>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProviderContact {
  customerService: {
    phone: string;
    email?: string;
    hours: string;
  };
  claims: {
    phone: string;
    fax?: string;
    email?: string;
    address?: Address;
  };
  priorAuth: {
    phone: string;
    fax?: string;
    email?: string;
  };
  providerServices: {
    phone: string;
    email?: string;
  };
}

export interface ProviderPerformance {
  memberSatisfaction: number;
  providerSatisfaction: number;
  complaintRate: number;
  appealRate: number;
  denialRate: number;
  paymentTimeliness: number;
  accuracyRate: number;
}

export interface Accreditation {
  organization: string; // NCQA, URAC, etc.
  type: string;
  level: string;
  effectiveDate: Date;
  expiryDate: Date;
  status: 'accredited' | 'pending' | 'suspended';
}

export interface InsuranceProduct {
  name: string;
  type: 'individual' | 'family' | 'group' | 'medicare' | 'medicaid';
  metalTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  states: string[];
  effectiveDate: Date;
  status: 'active' | 'inactive' | 'discontinued';
  features: string[];
  limitations: string[];
}

export interface ComplianceInfo {
  hipaaCompliant: boolean;
  hipaaAuditDate?: Date;
  stateRegulations: StateCompliance[];
  federalRegulations: FederalCompliance[];
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

export interface StateCompliance {
  state: string;
  licenseNumber: string;
  licenseStatus: 'active' | 'expired' | 'suspended';
  licenseExpiry: Date;
}

export interface FederalCompliance {
  regulation: string; // ACA, ERISA, etc.
  compliant: boolean;
  auditDate?: Date;
  findings?: string[];
}

// Prior Authorization Types
export interface PriorAuthorization extends WithId, WithTimestamps {
  patientId: string;
  providerId: string;
  insurancePolicyId: string;
  
  // Request Information
  requestNumber: string;
  type: 'service' | 'medication' | 'equipment' | 'procedure';
  serviceRequested: string;
  cptCode?: string;
  ndcCode?: string;
  hcpcsCode?: string;
  
  // Clinical Information
  diagnosis: PriorAuthDiagnosis[];
  clinicalNotes: string;
  supportingDocuments: PriorAuthDocument[];
  
  // Patient History
  treatmentHistory: TreatmentHistory[];
  previousAuthorizations: PreviousAuthorization[];
  
  // Request Details
  urgency: 'routine' | 'urgent' | 'emergency';
  requestedQuantity?: number;
  requestedDuration?: string;
  frequency?: string;
  
  // Status & Timeline
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'appealed' | 'expired';
  submittedDate?: Date;
  reviewStartDate?: Date;
  decisionDate?: Date;
  effectiveDate?: Date;
  expiryDate?: Date;
  
  // Decision
  decision: PriorAuthDecision;
  appeal?: PriorAuthAppeal;
  
  // Provider Information
  requestingProvider: ProviderInfo;
  servicingProvider?: ProviderInfo;
  facility?: FacilityInfo;
  
  // Communication
  communications: PriorAuthCommunication[];
  
  metadata?: Record<string, any>;
}

export interface PriorAuthDiagnosis {
  code: string;
  description: string;
  supportingClinicals: string;
}

export interface PriorAuthDocument {
  type: 'medical_record' | 'imaging' | 'lab_result' | 'prescription' | 'clinical_note' | 'other';
  name: string;
  url: string;
  uploadedDate: Date;
  description?: string;
}

export interface TreatmentHistory {
  treatment: string;
  startDate: Date;
  endDate?: Date;
  response: string;
  adverseEvents?: string;
}

export interface PreviousAuthorization {
  authorizationNumber: string;
  service: string;
  approvalDate: Date;
  expiryDate: Date;
  status: 'used' | 'expired' | 'cancelled';
}

export interface PriorAuthDecision {
  approved: boolean;
  approvedQuantity?: number;
  approvedDuration?: string;
  approvedFrequency?: string;
  approvedModifications?: string[];
  denialReason?: string;
  denialCode?: string;
  reviewer: string;
  reviewerNotes?: string;
  criteriaUsed: string[];
}

export interface PriorAuthAppeal {
  appealNumber: string;
  reason: string;
  submittedDate: Date;
  status: 'pending' | 'under_review' | 'approved' | 'denied';
  decisionDate?: Date;
  decisionReason?: string;
  documents: PriorAuthDocument[];
}

export interface ProviderInfo {
  npi: string;
  name: string;
  specialty?: string;
  phone?: string;
  fax?: string;
}

export interface PriorAuthCommunication {
  type: 'email' | 'fax' | 'phone' | 'portal' | 'mail';
  direction: 'incoming' | 'outgoing';
  date: Date;
  from: string;
  to: string;
  subject?: string;
  content: string;
  attachments?: string[];
}

// Explanation of Benefits (EOB)
export interface ExplanationOfBenefits extends WithId, WithTimestamps {
  patientId: string;
  insurancePolicyId: string;
  claimId: string;
  
  // EOB Information
  eobNumber: string;
  issueDate: Date;
  servicePeriod: {
    start: Date;
    end: Date;
  };
  
  // Provider Information
  provider: ProviderInfo;
  facility?: FacilityInfo;
  
  // Patient Information
  patient: {
    name: string;
    memberId: string;
    dateOfBirth: Date;
  };
  
  // Subscriber Information
  subscriber: {
    name: string;
    memberId: string;
    groupNumber?: string;
  };
  
  // Service Summary
  services: EOBService[];
  
  // Financial Summary
  financial: EOBFinancial;
  
  // Payment Information
  payment: EOBBayment;
  
  // Messages
  messages: EOBMessage[];
  
  // Appeals Information
  appeals: EOBAppealInfo;
  
  // Next Steps
  nextSteps: string[];
  
  // Documents
  documents: EOBDocument[];
  
  metadata?: Record<string, any>;
}

export interface EOBService {
  lineNumber: number;
  serviceDate: Date;
  procedureCode: string;
  procedureDescription: string;
  serviceProvider?: string;
  billedAmount: number;
  allowedAmount: number;
  deductibleApplied: number;
  coinsuranceApplied: number;
  copaymentApplied: number;
  notCoveredAmount: number;
  patientResponsibility: number;
  insurancePaid: number;
  notes?: string;
}

export interface EOBFinancial {
  totalBilled: number;
  totalAllowed: number;
  totalInsurancePaid: number;
  totalPatientResponsibility: number;
  totalDeductible: number;
  totalCoinsurance: number;
  totalCopayment: number;
  totalNotCovered: number;
  
  // Deductible Status
  deductible: {
    individual: {
      met: number;
      remaining: number;
      total: number;
    };
    family: {
      met: number;
      remaining: number;
      total: number;
    };
  };
  
  // Out-of-Pocket Status
  outOfPocket: {
    individual: {
      met: number;
      remaining: number;
      total: number;
    };
    family: {
      met: number;
      remaining: number;
      total: number;
    };
  };
}

export interface EOBBayment {
  paymentDate?: Date;
  paymentMethod: 'check' | 'eft' | 'credit' | 'adjustment';
  checkNumber?: string;
  eftReference?: string;
  paymentAmount: number;
  payee: string;
  payeeAddress?: string;
}

export interface EOBMessage {
  type: 'information' | 'warning' | 'denial' | 'coverage';
  code?: string;
  message: string;
  actionRequired: boolean;
  action?: string;
}

export interface EOBAppealInfo {
  deadline?: Date;
  instructions?: string;
  contactInfo?: string;
  formsRequired?: string[];
}

export interface EOBDocument {
  type: 'eob' | 'claim' | 'medical_record' | 'appeal_form';
  name: string;
  url: string;
  description?: string;
}

// Insurance Integration Types
export interface InsuranceIntegration {
  providerId: string;
  integrationType: 'api' | 'edi' | 'portal' | 'custom';
  
  // API Configuration
  apiConfig?: APIConfiguration;
  
  // EDI Configuration
  ediConfig?: EDIConfiguration;
  
  // Portal Configuration
  portalConfig?: PortalConfiguration;
  
  // Authentication
  authentication: IntegrationAuth;
  
  // Capabilities
  capabilities: IntegrationCapabilities;
  
  // Status
  status: IntegrationStatus;
  
  // Monitoring
  monitoring: IntegrationMonitoring;
  
  metadata?: Record<string, any>;
}

export interface APIConfiguration {
  baseUrl: string;
  version: string;
  endpoints: APIEndpoint[];
  rateLimit: RateLimit;
  timeout: number;
  retryPolicy: RetryPolicy;
}

export interface APIEndpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  parameters?: APIEndpointParameter[];
}

export interface APIEndpointParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
  required: boolean;
  description?: string;
}

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  burstLimit: number;
}

export interface RetryPolicy {
  maxRetries: number;
  backoff: 'exponential' | 'linear' | 'constant';
  initialDelay: number;
  maxDelay: number;
}

export interface EDIConfiguration {
  version: string;
  transactionTypes: EDITransactionType[];
  ftpConfig?: FTPConfig;
  sftpConfig?: SFTPConfig;
  as2Config?: AS2Config;
}

export interface EDITransactionType {
  type: '270' | '271' | '276' | '277' | '834' | '835' | '837';
  description: string;
  frequency: 'real-time' | 'batch' | 'scheduled';
  schedule?: string;
}

export interface FTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  directory: string;
  passive: boolean;
}

export interface SFTPConfig {
  host: string;
  port: number;
  username: string;
  privateKey?: string;
  directory: string;
}

export interface AS2Config {
  partnerId: string;
  partnerUrl: string;
  certificate: string;
  privateKey: string;
}

export interface PortalConfiguration {
  url: string;
  loginType: 'credentials' | 'sso' | 'oauth';
  navigation: PortalNavigation[];
  automation: PortalAutomation;
}

export interface PortalNavigation {
  section: string;
  path: string;
  description: string;
  available: boolean;
}

export interface PortalAutomation {
  browserType: 'chrome' | 'firefox' | 'edge';
  headless: boolean;
  waitTime: number;
  screenshots: boolean;
}

export interface IntegrationAuth {
  method: 'api_key' | 'oauth2' | 'jwt' | 'basic' | 'saml';
  credentials: AuthCredentials;
  refreshToken?: string;
  tokenExpiry?: Date;
  autoRefresh: boolean;
}

export type AuthCredentials = 
  | APIKeyAuth
  | OAuth2Auth
  | JWTAuth
  | BasicAuth
  | SAMLAuth;

export interface APIKeyAuth {
  apiKey: string;
  secret?: string;
}

export interface OAuth2Auth {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  scope: string[];
}

export interface JWTAuth {
  privateKey: string;
  publicKey?: string;
  algorithm: string;
  issuer: string;
}

export interface BasicAuth {
  username: string;
  password: string;
}

export interface SAMLAuth {
  entityId: string;
  certificate: string;
  privateKey: string;
  idpUrl: string;
}

export interface IntegrationCapabilities {
  eligibility: boolean;
  claims: boolean;
  priorAuth: boolean;
  remittance: boolean;
  providerDirectory: boolean;
  benefits: boolean;
  referrals: boolean;
  attachments: boolean;
  realTime: boolean;
  batch: boolean;
}

export interface IntegrationStatus {
  connected: boolean;
  lastConnected: Date;
  lastSync: Date;
  syncStatus: 'success' | 'failed' | 'in_progress';
  errorCount: number;
  lastError?: string;
  maintenanceWindow?: {
    start: Date;
    end: Date;
  };
}

export interface IntegrationMonitoring {
  uptime: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  alerts: IntegrationAlert[];
  logs: IntegrationLog[];
}

export interface IntegrationAlert {
  type: 'connection' | 'performance' | 'error' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface IntegrationLog {
  timestamp: Date;
  operation: string;
  status: 'success' | 'failure';
  duration: number;
  request?: any;
  response?: any;
  error?: string;
}