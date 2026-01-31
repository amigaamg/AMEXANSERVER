import { WithId, WithTimestamps } from './index';
import { InsurancePolicy, ClaimStatus } from './insurance.types';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  VOID = 'void',
  WRITTEN_OFF = 'written_off'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CHECK = 'check',
  INSURANCE = 'insurance',
  PAYPAL = 'paypal',
  OTHER = 'other'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual',
  ONE_TIME = 'one_time'
}

export interface BillingAccount extends WithId, WithTimestamps {
  patientId: string;
  accountNumber: string;
  
  // Account Status
  status: 'active' | 'inactive' | 'delinquent' | 'collections';
  balance: number;
  creditLimit?: number;
  paymentTerms: number; // days
  
  // Contact Information
  billingContact: BillingContact;
  primaryPaymentMethod?: PaymentMethodDetails;
  secondaryPaymentMethods: PaymentMethodDetails[];
  
  // Insurance
  primaryInsurance?: InsurancePolicy;
  secondaryInsurance?: InsurancePolicy;
  tertiaryInsurance?: InsurancePolicy;
  
  // Preferences
  preferences: BillingPreferences;
  
  // History
  paymentHistory: Payment[];
  invoiceHistory: Invoice[];
  adjustmentHistory: Adjustment[];
  
  // Collections
  collections: CollectionActivity[];
  
  // Credit
  creditScore?: number;
  creditNotes: CreditNote[];
  
  metadata?: Record<string, any>;
}

export interface BillingContact {
  name: string;
  email: string;
  phone: string;
  address: string;
  sameAsPatient: boolean;
  preferredContactMethod: 'email' | 'phone' | 'mail' | 'app';
}

export interface PaymentMethodDetails {
  method: PaymentMethod;
  details: PaymentDetails;
  isDefault: boolean;
  isVerified: boolean;
  addedDate: Date;
  lastUsed?: Date;
}

export type PaymentDetails = 
  | CreditCardDetails
  | BankAccountDetails
  | DigitalWalletDetails
  | InsuranceDetails;

export interface CreditCardDetails {
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  billingAddress?: string;
  token?: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountType: 'checking' | 'savings';
  lastFour: string;
  routingNumber: string;
  accountHolderName: string;
}

export interface DigitalWalletDetails {
  walletType: 'paypal' | 'apple_pay' | 'google_pay';
  email: string;
  token?: string;
}

export interface InsuranceDetails {
  insurancePolicyId: string;
  memberId: string;
  groupNumber?: string;
}

export interface BillingPreferences {
  paperlessBilling: boolean;
  autoPay: boolean;
  paymentReminders: boolean;
  paymentPlan: boolean;
  charityCare: boolean;
  financialAssistance: boolean;
  language: string;
}

export interface Invoice extends WithId, WithTimestamps {
  accountId: string;
  patientId: string;
  invoiceNumber: string;
  
  // Dates
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  
  // Status
  status: InvoiceStatus;
  previousStatus?: InvoiceStatus;
  
  // Line Items
  lineItems: InvoiceLineItem[];
  
  // Totals
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  balance: number;
  
  // Applied Payments
  payments: AppliedPayment[];
  
  // Insurance
  insuranceApplied: boolean;
  insuranceClaimId?: string;
  insuranceAmount: number;
  patientAmount: number;
  
  // Payment Plan
  paymentPlan?: PaymentPlan;
  
  // Communications
  sentDate?: Date;
  viewedDate?: Date;
  reminderDates: Date[];
  
  // Notes
  notes?: string;
  terms?: string;
  footer?: string;
  
  // Attachments
  attachments: InvoiceAttachment[];
  
  metadata?: Record<string, any>;
}

export interface InvoiceLineItem {
  id: string;
  date: Date;
  description: string;
  serviceCode?: string; // CPT/HCPCS
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  // Service Details
  appointmentId?: string;
  procedureId?: string;
  medicationId?: string;
  labTestId?: string;
  
  // Insurance
  insuranceAllowed: number;
  insurancePaid: number;
  patientResponsibility: number;
  writeOff?: number;
  
  // Provider
  providerId?: string;
  facilityId?: string;
  
  // Notes
  notes?: string;
}

export interface AppliedPayment {
  paymentId: string;
  amount: number;
  date: Date;
  method: PaymentMethod;
  reference?: string;
}

export interface PaymentPlan {
  id: string;
  totalAmount: number;
  downPayment: number;
  numberOfPayments: number;
  paymentAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  payments: PaymentPlanPayment[];
}

export interface PaymentPlanPayment {
  paymentNumber: number;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: Date;
  paidAmount?: number;
}

export interface InvoiceAttachment {
  type: 'statement' | 'eoob' | 'receipt' | 'explanation' | 'other';
  name: string;
  url: string;
  uploadedDate: Date;
}

export interface Payment extends WithId, WithTimestamps {
  accountId: string;
  patientId: string;
  
  // Payment Details
  paymentNumber: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  processor: string;
  processorReference?: string;
  
  // Allocation
  appliedTo: PaymentAllocation[];
  unallocatedAmount: number;
  
  // Refunds
  refunds: Refund[];
  
  // Reconciliation
  reconciled: boolean;
  reconciledDate?: Date;
  reconciledBy?: string;
  
  // Receipt
  receiptSent: boolean;
  receiptSentDate?: Date;
  
  metadata?: Record<string, any>;
}

export interface PaymentAllocation {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  date: Date;
}

export interface Refund {
  id: string;
  amount: number;
  date: Date;
  reason: string;
  method: PaymentMethod;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Adjustment extends WithId, WithTimestamps {
  accountId: string;
  patientId: string;
  
  // Adjustment Details
  adjustmentNumber: string;
  date: Date;
  amount: number;
  type: AdjustmentType;
  category: AdjustmentCategory;
  reason: string;
  
  // Reference
  referenceId?: string;
  referenceType?: 'invoice' | 'payment' | 'claim';
  
  // Approval
  approved: boolean;
  approvedBy?: string;
  approvedDate?: Date;
  
  // Reversal
  reversed: boolean;
  reversedDate?: Date;
  reversalReason?: string;
  
  // Notes
  notes?: string;
  
  metadata?: Record<string, any>;
}

export enum AdjustmentType {
  WRITE_OFF = 'write_off',
  DISCOUNT = 'discount',
  CHARITY = 'charity',
  BAD_DEBT = 'bad_debt',
  CONTRACTUAL = 'contractual',
  OTHER = 'other'
}

export enum AdjustmentCategory {
  INSURANCE = 'insurance',
  PATIENT = 'patient',
  PROVIDER = 'provider',
  SYSTEM = 'system'
}

export interface CollectionActivity extends WithId, WithTimestamps {
  accountId: string;
  patientId: string;
  
  // Activity Details
  type: 'letter' | 'call' | 'email' | 'payment_arrangement' | 'collections_agency';
  date: Date;
  amount: number;
  
  // Contact
  contactedBy: string;
  contactMethod: string;
  response?: string;
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  
  // Resolution
  resolved: boolean;
  resolutionDate?: Date;
  resolutionNotes?: string;
  
  // Notes
  notes?: string;
  
  metadata?: Record<string, any>;
}

export interface CreditNote extends WithId, WithTimestamps {
  accountId: string;
  patientId: string;
  
  // Credit Details
  creditNoteNumber: string;
  date: Date;
  amount: number;
  reason: string;
  expirationDate?: Date;
  
  // Status
  status: 'active' | 'used' | 'expired' | 'void';
  usedAmount: number;
  remainingAmount: number;
  
  // Usage
  usage: CreditUsage[];
  
  // Notes
  notes?: string;
  
  metadata?: Record<string, any>;
}

export interface CreditUsage {
  invoiceId: string;
  amount: number;
  date: Date;
}

// Billing Analytics
export interface BillingAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  
  // Revenue Metrics
  revenue: {
    total: number;
    byService: Record<string, number>;
    byProvider: Record<string, number>;
    byInsurance: Record<string, number>;
    trend: RevenueTrend[];
  };
  
  // Accounts Receivable
  accountsReceivable: {
    total: number;
    aging: AgingBuckets;
    byStatus: Record<InvoiceStatus, number>;
    collectionRate: number;
    daysSalesOutstanding: number;
  };
  
  // Insurance Metrics
  insurance: {
    claims: InsuranceClaimMetrics;
    reimbursement: ReimbursementMetrics;
    denials: DenialMetrics;
  };
  
  // Patient Payments
  patientPayments: {
    total: number;
    byMethod: Record<PaymentMethod, number>;
    collectionRate: number;
    averagePaymentTime: number;
  };
  
  // Cost Analysis
  costs: {
    total: number;
    byCategory: Record<string, number>;
    profitMargin: number;
    costPerService: Record<string, number>;
  };
  
  // Insights
  insights: BillingInsight[];
  recommendations: BillingRecommendation[];
}

export interface RevenueTrend {
  date: Date;
  amount: number;
  insuranceAmount: number;
  patientAmount: number;
}

export interface AgingBuckets {
  current: number; // 0-30 days
  days31_60: number;
  days61_90: number;
  days91_120: number;
  over120: number;
}

export interface InsuranceClaimMetrics {
  submitted: number;
  paid: number;
  denied: number;
  pending: number;
  averagePaymentTime: number;
  denialRate: number;
  appealSuccessRate: number;
}

export interface ReimbursementMetrics {
  averageReimbursementRate: number;
  byInsurance: Record<string, number>;
  byService: Record<string, number>;
  contractualAdjustments: number;
}

export interface DenialMetrics {
  totalDenials: number;
  topDenialReasons: DenialReason[];
  appealRate: number;
  appealSuccessRate: number;
}

export interface DenialReason {
  reason: string;
  count: number;
  percentage: number;
  averageAmount: number;
}

export interface BillingInsight {
  type: 'revenue' | 'collections' | 'insurance' | 'costs' | 'efficiency';
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
}

export interface BillingRecommendation {
  type: 'billing' | 'collections' | 'insurance' | 'pricing' | 'process';
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

// Financial Reports
export interface FinancialReport {
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'aging' | 'revenue';
  period: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  data: FinancialData;
  summary: FinancialSummary;
  charts: FinancialChart[];
}

export interface FinancialData {
  revenue: RevenueData[];
  expenses: ExpenseData[];
  assets: AssetData[];
  liabilities: LiabilityData[];
  equity: EquityData[];
}

export interface RevenueData {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
  budget: number;
  variance: number;
}

export interface AssetData {
  category: string;
  amount: number;
  current: number;
  nonCurrent: number;
}

export interface LiabilityData {
  category: string;
  amount: number;
  current: number;
  longTerm: number;
}

export interface EquityData {
  category: string;
  amount: number;
  change: number;
}

export interface FinancialSummary {
  netIncome: number;
  totalRevenue: number;
  totalExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  profitMargin: number;
  currentRatio: number;
  debtToEquity: number;
}

export interface FinancialChart {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  title: string;
  data: any[];
  options: any;
}