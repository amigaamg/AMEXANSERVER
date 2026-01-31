import { WithId, WithTimestamps } from './index';

export enum SupplyCategory {
  DIABETES = 'diabetes',
  HYPERTENSION = 'hypertension',
  RESPIRATORY = 'respiratory',
  CARDIAC = 'cardiac',
  WOUND_CARE = 'wound_care',
  INCONTINENCE = 'incontinence',
  MOBILITY = 'mobility',
  DAILY_LIVING = 'daily_living',
  TESTING = 'testing',
  MEDICATION = 'medication',
  SAFETY = 'safety',
  OTHER = 'other'
}

export enum SupplyStatus {
  ACTIVE = 'active',
  DISCONTINUED = 'discontinued',
  OUT_OF_STOCK = 'out_of_stock',
  LOW_STOCK = 'low_stock',
  PRE_ORDER = 'pre_order',
  BACKORDERED = 'backordered'
}

export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded'
}

export enum ShippingMethod {
  STANDARD = 'standard',
  EXPEDITED = 'expedited',
  NEXT_DAY = 'next_day',
  SAME_DAY = 'same_day',
  PICKUP = 'pickup'
}

export interface MedicalSupply extends WithId, WithTimestamps {
  // Basic Information
  sku: string;
  name: string;
  brand?: string;
  manufacturer?: string;
  category: SupplyCategory;
  subcategory?: string;
  
  // Description
  description: string;
  shortDescription?: string;
  features: string[];
  specifications: SupplySpecification[];
  
  // Images
  images: SupplyImage[];
  videos?: SupplyVideo[];
  
  // Pricing
  price: number;
  cost: number;
  compareAtPrice?: number;
  discount?: number;
  taxCategory?: string;
  
  // Inventory
  inventory: InventoryInfo;
  status: SupplyStatus;
  
  // Medical Information
  medicalInfo: MedicalSupplyInfo;
  prescriptionRequired: boolean;
  fdaApproved: boolean;
  ceMarked?: boolean;
  
  // Shipping
  shipping: ShippingInfo;
  
  // SEO & Marketing
  seo: SupplySEO;
  
  // Related Products
  relatedProducts: string[];
  frequentlyBoughtTogether: string[];
  
  // Reviews
  reviews: SupplyReview[];
  averageRating: number;
  reviewCount: number;
  
  // Metadata
  tags: string[];
  metadata?: Record<string, any>;
}

export interface SupplySpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface SupplyImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface SupplyVideo {
  url: string;
  type: 'youtube' | 'vimeo' | 'uploaded';
  thumbnail?: string;
}

export interface InventoryInfo {
  quantity: number;
  lowStockThreshold: number;
  outOfStockThreshold: number;
  backorderable: boolean;
  backorderQuantity?: number;
  warehouseLocation?: string;
  binLocation?: string;
  lastInventoryCheck?: Date;
  lastRestock?: Date;
  nextRestock?: Date;
}

export interface MedicalSupplyInfo {
  intendedUse: string;
  contraindications?: string[];
  warnings?: string[];
  precautions?: string[];
  sideEffects?: string[];
  storageInstructions: string;
  shelfLife?: string;
  sterility: 'sterile' | 'non_sterile' | 'single_use';
  biocompatibility?: string;
  regulatoryApprovals: string[];
  instructionsForUse?: string;
  disposalInstructions?: string;
}

export interface ShippingInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
  shippingClass: string;
  requiresSignature: boolean;
  temperatureSensitive: boolean;
  hazardous: boolean;
  restrictions: ShippingRestriction[];
}

export interface ShippingRestriction {
  type: 'country' | 'state' | 'region';
  value: string;
  reason?: string;
}

export interface SupplySEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  metaTags?: Record<string, string>;
}

export interface SupplyReview {
  id: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: Date;
  updatedAt?: Date;
  response?: ReviewResponse;
}

export interface ReviewResponse {
  userId: string;
  comment: string;
  createdAt: Date;
}

// Shopping Cart
export interface ShoppingCart extends WithId, WithTimestamps {
  userId: string;
  patientId?: string;
  
  // Items
  items: CartItem[];
  
  // Pricing
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  
  // Coupons
  coupons: AppliedCoupon[];
  
  // Shipping
  shippingAddress?: Address;
  shippingMethod?: ShippingMethod;
  shippingEstimate?: ShippingEstimate;
  
  // Billing
  billingAddress?: Address;
  paymentMethod?: PaymentMethod;
  
  // Metadata
  notes?: string;
  metadata?: Record<string, any>;
}

export interface CartItem {
  supplyId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  
  // Options
  options: CartItemOption[];
  
  // Medical
  prescriptionRequired: boolean;
  prescriptionId?: string;
  
  // Inventory
  inStock: boolean;
  backorderable: boolean;
  
  // Pricing
  lineTotal: number;
}

export interface CartItemOption {
  name: string;
  value: string;
  priceAdjustment?: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number;
  description?: string;
  minimumPurchase?: number;
  maximumDiscount?: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface ShippingEstimate {
  method: ShippingMethod;
  cost: number;
  minDays: number;
  maxDays: number;
  carrier: string;
  service: string;
}

// Orders
export interface Order extends WithId, WithTimestamps {
  orderNumber: string;
  userId: string;
  patientId?: string;
  
  // Status
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  
  // Items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paidAmount: number;
  refundedAmount: number;
  
  // Payment
  payment: OrderPayment;
  
  // Shipping
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  shippingInfo: OrderShippingInfo;
  
  // Billing
  billingAddress: Address;
  billingInfo: OrderBillingInfo;
  
  // Insurance
  insuranceInfo?: OrderInsuranceInfo;
  
  // Fulfillment
  fulfillment: OrderFulfillment;
  
  // Customer Service
  customerService: OrderCustomerService;
  
  // Notes
  notes?: string;
  internalNotes?: string;
  
  // Attachments
  attachments: OrderAttachment[];
  
  metadata?: Record<string, any>;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  changedBy: string;
  notes?: string;
}

export interface OrderItem {
  supplyId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  image?: string;
  
  // Options
  options: OrderItemOption[];
  
  // Medical
  prescriptionRequired: boolean;
  prescriptionId?: string;
  prescriptionVerified: boolean;
  
  // Fulfillment
  fulfilledQuantity: number;
  backorderedQuantity: number;
  cancelledQuantity: number;
  
  // Pricing
  lineTotal: number;
  discount: number;
  tax: number;
}

export interface OrderItemOption {
  name: string;
  value: string;
  priceAdjustment?: number;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';
  amount: number;
  currency: string;
  transactionId?: string;
  authorizationCode?: string;
  capturedAt?: Date;
  refunds: PaymentRefund[];
}

export interface PaymentRefund {
  id: string;
  amount: number;
  reason: string;
  processedAt: Date;
  processorReference?: string;
}

export interface OrderShippingInfo {
  carrier: string;
  service: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  deliveryProof?: DeliveryProof;
}

export interface DeliveryProof {
  type: 'signature' | 'photo' | 'none';
  signature?: string;
  photoUrl?: string;
  receivedBy?: string;
}

export interface OrderBillingInfo {
  invoiceNumber?: string;
  invoiceDate?: Date;
  dueDate?: Date;
  paidDate?: Date;
  taxId?: string;
  poNumber?: string;
}

export interface OrderInsuranceInfo {
  insurancePolicyId?: string;
  memberId?: string;
  groupNumber?: string;
  coveredAmount?: number;
  patientResponsibility?: number;
  claimSubmitted: boolean;
  claimId?: string;
}

export interface OrderFulfillment {
  warehouse: string;
  packedBy?: string;
  packedAt?: Date;
  shippedBy?: string;
  shippedAt?: Date;
  packages: Package[];
  returns: Return[];
}

export interface Package {
  packageId: string;
  items: PackageItem[];
  weight: number;
  dimensions: PackageDimensions;
  carrier: string;
  trackingNumber: string;
  shippedAt: Date;
  deliveredAt?: Date;
}

export interface PackageItem {
  orderItemId: string;
  quantity: number;
}

export interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
}

export interface Return {
  returnId: string;
  reason: string;
  status: 'requested' | 'approved' | 'received' | 'inspected' | 'refunded' | 'rejected';
  items: ReturnItem[];
  requestedAt: Date;
  approvedAt?: Date;
  receivedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  notes?: string;
}

export interface ReturnItem {
  orderItemId: string;
  quantity: number;
  reason: string;
  condition: 'unopened' | 'opened' | 'damaged' | 'defective';
}

export interface OrderCustomerService {
  customerNotes?: string;
  serviceRequests: ServiceRequest[];
  satisfactionRating?: number;
  feedback?: string;
}

export interface ServiceRequest {
  id: string;
  type: 'question' | 'issue' | 'complaint' | 'compliment';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface OrderAttachment {
  type: 'invoice' | 'packing_slip' | 'prescription' | 'insurance' | 'other';
  name: string;
  url: string;
  uploadedDate: Date;
}

// Prescription Orders
export interface PrescriptionOrder extends Order {
  type: 'prescription';
  prescriptionId: string;
  pharmacyId: string;
  pharmacistId?: string;
  
  // Medical Details
  medicationDetails: PrescriptionMedicationDetails;
  instructions: string;
  refills: number;
  remainingRefills: number;
  
  // Pharmacy Processing
  pharmacyStatus: PharmacyOrderStatus;
  pharmacyNotes?: string;
  
  // Delivery Options
  deliveryOptions: PrescriptionDeliveryOptions;
  
  // Safety
  safetyChecks: SafetyCheck[];
  
  // Compliance
  compliance: PrescriptionCompliance;
}

export enum PharmacyOrderStatus {
  RECEIVED = 'received',
  VERIFIED = 'verified',
  PROCESSING = 'processing',
  READY = 'ready',
  DISPENSED = 'dispensed',
  CANCELLED = 'cancelled'
}

export interface PrescriptionMedicationDetails {
  medication: string;
  strength: string;
  form: string;
  quantity: number;
  dosage: string;
  sig: string;
  warnings: string[];
  interactions: string[];
}

export interface PrescriptionDeliveryOptions {
  pickup: boolean;
  delivery: boolean;
  mailOrder: boolean;
  selectedOption: 'pickup' | 'delivery' | 'mail';
  pickupLocation?: string;
  pickupTime?: Date;
  deliveryWindow?: Date;
}

export interface SafetyCheck {
  check: string;
  status: 'passed' | 'failed' | 'pending';
  checkedAt?: Date;
  checkedBy?: string;
  notes?: string;
}

export interface PrescriptionCompliance {
  hipaaCompliant: boolean;
  deaCompliant: boolean;
  stateLicensed: boolean;
  verifiedBy: string;
  verifiedAt: Date;
}

// Inventory Management
export interface Inventory extends WithId, WithTimestamps {
  supplyId: string;
  sku: string;
  
  // Stock Levels
  currentStock: number;
  committedStock: number;
  availableStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  
  // Location
  warehouse: string;
  binLocation: string;
  aisle: string;
  shelf: string;
  
  // Movement
  movements: InventoryMovement[];
  adjustments: InventoryAdjustment[];
  
  // Costs
  averageCost: number;
  lastCost: number;
  totalValue: number;
  
  // Metrics
  turnoverRate: number;
  daysOfSupply: number;
  stockoutRisk: 'low' | 'medium' | 'high';
  
  // Alerts
  alerts: InventoryAlert[];
  
  metadata?: Record<string, any>;
}

export interface InventoryMovement {
  type: 'receipt' | 'sale' | 'return' | 'adjustment' | 'transfer';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  referenceId?: string;
  referenceType?: 'order' | 'purchase_order' | 'return' | 'adjustment';
  date: Date;
  performedBy: string;
  notes?: string;
}

export interface InventoryAdjustment {
  adjustmentNumber: string;
  type: 'add' | 'remove' | 'correct';
  quantity: number;
  reason: string;
  cost?: number;
  date: Date;
  approvedBy: string;
  notes?: string;
}

export interface InventoryAlert {
  type: 'low_stock' | 'out_of_stock' | 'expiring' | 'excess' | 'slow_moving';
  severity: 'low' | 'medium' | 'high';
  message: string;
  triggeredAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

// Supply Analytics
export interface SupplyAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  
  // Sales Metrics
  sales: {
    totalRevenue: number;
    totalUnits: number;
    averageOrderValue: number;
    conversionRate: number;
    byCategory: Record<string, number>;
    byProduct: Record<string, number>;
    trend: SalesTrend[];
  };
  
  // Inventory Metrics
  inventory: {
    totalValue: number;
    turnoverRate: number;
    daysOfSupply: number;
    stockoutRate: number;
    excessInventory: number;
    byCategory: Record<string, number>;
  };
  
  // Customer Metrics
  customers: {
    totalCustomers: number;
    repeatCustomers: number;
    averageCustomerValue: number;
    retentionRate: number;
    acquisitionCost: number;
  };
  
  // Operational Metrics
  operations: {
    fulfillmentRate: number;
    averageShippingTime: number;
    returnRate: number;
    customerSatisfaction: number;
    costPerOrder: number;
  };
  
  // Prescription Metrics
  prescriptions: {
    totalOrders: number;
    fulfillmentRate: number;
    averageProcessingTime: number;
    complianceRate: number;
  };
  
  // Insights
  insights: SupplyInsight[];
  recommendations: SupplyRecommendation[];
}

export interface SalesTrend {
  date: Date;
  revenue: number;
  units: number;
  orders: number;
}

export interface SupplyInsight {
  type: 'sales' | 'inventory' | 'customer' | 'operations' | 'prescriptions';
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
}

export interface SupplyRecommendation {
  type: 'pricing' | 'inventory' | 'marketing' | 'operations' | 'product';
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}