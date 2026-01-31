import { 
  User as FirebaseUser,
  UserCredential,
  UserMetadata,
  IdTokenResult
} from 'firebase/auth';

import {
  DocumentData,
  DocumentReference,
  CollectionReference,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  WriteBatch,
  Transaction,
  FieldValue,
  Timestamp,
  GeoPoint,
  WhereFilterOp,
  OrderByDirection
} from 'firebase/firestore';

import {
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
  UploadMetadata,
  ListResult,
  SettableMetadata
} from 'firebase/storage';

import {
  Functions,
  HttpsCallable,
  HttpsCallableResult
} from 'firebase/functions';

// Re-export Firebase types
export {
  FirebaseUser,
  UserCredential,
  UserMetadata,
  IdTokenResult,
  DocumentData,
  DocumentReference,
  CollectionReference,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  WriteBatch,
  Transaction,
  FieldValue,
  Timestamp,
  GeoPoint,
  WhereFilterOp,
  OrderByDirection,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
  UploadMetadata,
  ListResult,
  SettableMetadata,
  Functions,
  HttpsCallable,
  HttpsCallableResult
};

// Custom Firebase Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseAppError {
  code: string;
  message: string;
  name: string;
  stack?: string;
}

export interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: FirebaseAppError | null;
}

export interface FirestoreQueryOptions {
  where?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>;
  orderBy?: Array<{
    field: string;
    direction?: OrderByDirection;
  }>;
  limit?: number;
  startAt?: any;
  startAfter?: any;
  endAt?: any;
  endBefore?: any;
}

export interface FirestorePaginationOptions extends FirestoreQueryOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FirestoreConverter<T> {
  toFirestore(data: T): DocumentData;
  fromFirestore(snapshot: QueryDocumentSnapshot): T;
}

export interface StorageUploadOptions {
  metadata?: UploadMetadata;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (url: string) => void;
  onError?: (error: FirebaseAppError) => void;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: 'running' | 'paused' | 'success' | 'error';
}

export interface CloudFunctionCall<T = any, R = any> {
  name: string;
  data?: T;
  options?: {
    timeout?: number;
    region?: string;
  };
  onSuccess?: (result: HttpsCallableResult<R>) => void;
  onError?: (error: FirebaseAppError) => void;
}

// Firebase Realtime Database Types (if used)
export interface RealtimeDatabaseReference {
  path: string;
  key: string | null;
  parent: RealtimeDatabaseReference | null;
  root: RealtimeDatabaseReference;
}

export interface DatabaseSnapshot {
  val(): any;
  exists(): boolean;
  key: string | null;
  ref: RealtimeDatabaseReference;
  forEach(action: (child: DatabaseSnapshot) => boolean | void): boolean;
  hasChild(path: string): boolean;
  hasChildren(): boolean;
  numChildren(): number;
  toJSON(): object | null;
}

// Firebase Analytics Types
export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
}

export interface AnalyticsUserProperty {
  name: string;
  value: any;
}

export interface AnalyticsConfig {
  enabled: boolean;
  consent?: {
    ad_storage?: 'granted' | 'denied';
    analytics_storage?: 'granted' | 'denied';
    functionality_storage?: 'granted' | 'denied';
    personalization_storage?: 'granted' | 'denied';
    security_storage?: 'granted' | 'denied';
  };
}

// Firebase Performance Monitoring Types
export interface PerformanceTrace {
  name: string;
  start(): void;
  stop(): void;
  incrementMetric(metricName: string, incrementBy: number): void;
  putMetric(metricName: string, value: number): void;
  getMetric(metricName: string): number | null;
  remove(): void;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
}

// Firebase Remote Config Types
export interface RemoteConfigValue {
  asString(): string;
  asBoolean(): boolean;
  asNumber(): number;
  getSource(): 'static' | 'default' | 'remote';
}

export interface RemoteConfigSettings {
  fetchTimeoutMillis: number;
  minimumFetchIntervalMillis: number;
}

// Firebase App Check Types
export interface AppCheckToken {
  token: string;
  expireTimeMillis: number;
}

export interface AppCheckProvider {
  getToken(): Promise<AppCheckToken>;
}

// Firebase Security Rules Types
export interface SecurityRules {
  source: string;
  rules: string;
}

export interface Ruleset {
  name: string;
  createTime: Timestamp;
}

// Firebase Extensions Types
export interface FirebaseExtension {
  id: string;
  name: string;
  version: string;
  config: ExtensionConfig;
  status: 'INSTALLED' | 'UNINSTALLED' | 'ERROR';
}

export interface ExtensionConfig {
  params: Record<string, ExtensionParam>;
  allowedAPIs?: string[];
  roles?: ExtensionRole[];
}

export interface ExtensionParam {
  label: string;
  type: 'STRING' | 'SELECT' | 'MULTISELECT' | 'SECRET';
  defaultValue?: any;
  options?: string[];
  required?: boolean;
  description?: string;
}

export interface ExtensionRole {
  role: string;
  reason: string;
}

// Firebase Emulator Types
export interface EmulatorConfig {
  auth?: {
    host: string;
    port: number;
  };
  firestore?: {
    host: string;
    port: number;
  };
  storage?: {
    host: string;
    port: number;
  };
  functions?: {
    host: string;
    port: number;
  };
  database?: {
    host: string;
    port: number;
  };
}

export interface EmulatorStatus {
  connected: boolean;
  version?: string;
}

// Firebase Error Handling
export interface FirebaseError extends Error {
  code: string;
  message: string;
  name: string;
  stack?: string;
  customData?: Record<string, any>;
}

export interface ErrorHandler {
  handleError(error: FirebaseError): void;
  logError(error: FirebaseError): void;
  reportError(error: FirebaseError): void;
}

// Firebase Utility Types
export interface FirebaseUtils {
  generateId(): string;
  serverTimestamp(): FieldValue;
  deleteField(): FieldValue;
  arrayUnion(...elements: any[]): FieldValue;
  arrayRemove(...elements: any[]): FieldValue;
  increment(n: number): FieldValue;
}

// Firebase Admin Types (Server-side)
export interface FirebaseAdmin {
  auth(): AdminAuth;
  firestore(): AdminFirestore;
  storage(): AdminStorage;
  functions(): AdminFunctions;
  database(): AdminDatabase;
}

export interface AdminAuth {
  createUser(properties: AdminUserProperties): Promise<AdminUserRecord>;
  getUser(uid: string): Promise<AdminUserRecord>;
  updateUser(uid: string, properties: Partial<AdminUserProperties>): Promise<AdminUserRecord>;
  deleteUser(uid: string): Promise<void>;
  setCustomUserClaims(uid: string, claims: Record<string, any>): Promise<void>;
  verifyIdToken(idToken: string): Promise<AdminDecodedIdToken>;
  createCustomToken(uid: string, claims?: Record<string, any>): Promise<string>;
}

export interface AdminUserProperties {
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  disabled?: boolean;
}

export interface AdminUserRecord {
  uid: string;
  email?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  passwordHash?: string;
  passwordSalt?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  metadata: AdminUserMetadata;
  providerData: AdminUserInfo[];
  customClaims?: Record<string, any>;
  tokensValidAfterTime?: string;
}

export interface AdminUserMetadata {
  creationTime: string;
  lastSignInTime?: string;
}

export interface AdminUserInfo {
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  providerId: string;
}

export interface AdminDecodedIdToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  name?: string;
  picture?: string;
  firebase: {
    identities: Record<string, any>;
    sign_in_provider: string;
  };
  [key: string]: any;
}

export interface AdminFirestore {
  collection(collectionPath: string): AdminCollectionReference;
  doc(documentPath: string): AdminDocumentReference;
  runTransaction<T>(
    updateFunction: (transaction: AdminTransaction) => Promise<T>
  ): Promise<T>;
  batch(): AdminWriteBatch;
}

export interface AdminCollectionReference {
  doc(documentPath?: string): AdminDocumentReference;
  add(data: DocumentData): Promise<AdminDocumentReference>;
  get(): Promise<AdminQuerySnapshot>;
  where(fieldPath: string, opStr: WhereFilterOp, value: any): AdminQuery;
  orderBy(fieldPath: string, directionStr?: OrderByDirection): AdminQuery;
  limit(limit: number): AdminQuery;
  offset(offset: number): AdminQuery;
  startAt(...fieldValues: any[]): AdminQuery;
  startAfter(...fieldValues: any[]): AdminQuery;
  endAt(...fieldValues: any[]): AdminQuery;
  endBefore(...fieldValues: any[]): AdminQuery;
}

export interface AdminDocumentReference {
  id: string;
  parent: AdminCollectionReference;
  path: string;
  get(): Promise<AdminDocumentSnapshot>;
  set(data: DocumentData, options?: SetOptions): Promise<void>;
  update(data: DocumentData): Promise<void>;
  delete(): Promise<void>;
  collection(collectionPath: string): AdminCollectionReference;
  onSnapshot(
    onNext: (snapshot: AdminDocumentSnapshot) => void,
    onError?: (error: Error) => void
  ): () => void;
}

export interface AdminQuery {
  get(): Promise<AdminQuerySnapshot>;
  where(fieldPath: string, opStr: WhereFilterOp, value: any): AdminQuery;
  orderBy(fieldPath: string, directionStr?: OrderByDirection): AdminQuery;
  limit(limit: number): AdminQuery;
  offset(offset: number): AdminQuery;
  startAt(...fieldValues: any[]): AdminQuery;
  startAfter(...fieldValues: any[]): AdminQuery;
  endAt(...fieldValues: any[]): AdminQuery;
  endBefore(...fieldValues: any[]): AdminQuery;
  onSnapshot(
    onNext: (snapshot: AdminQuerySnapshot) => void,
    onError?: (error: Error) => void
  ): () => void;
}

export interface AdminQuerySnapshot {
  docs: AdminQueryDocumentSnapshot[];
  empty: boolean;
  size: number;
  forEach(callback: (result: AdminQueryDocumentSnapshot) => void): void;
  docChanges(options?: SnapshotListenOptions): AdminDocumentChange[];
}

export interface AdminDocumentSnapshot {
  id: string;
  ref: AdminDocumentReference;
  exists: boolean;
  data(): DocumentData | undefined;
  get(fieldPath: string): any;
}

export interface AdminQueryDocumentSnapshot extends AdminDocumentSnapshot {
  data(): DocumentData;
}

export interface AdminDocumentChange {
  type: 'added' | 'modified' | 'removed';
  doc: AdminQueryDocumentSnapshot;
  oldIndex: number;
  newIndex: number;
}

export interface AdminTransaction {
  get(documentRef: AdminDocumentReference): Promise<AdminDocumentSnapshot>;
  set(
    documentRef: AdminDocumentReference,
    data: DocumentData,
    options?: SetOptions
  ): AdminTransaction;
  update(documentRef: AdminDocumentReference, data: DocumentData): AdminTransaction;
  delete(documentRef: AdminDocumentReference): AdminTransaction;
}

export interface AdminWriteBatch {
  set(
    documentRef: AdminDocumentReference,
    data: DocumentData,
    options?: SetOptions
  ): AdminWriteBatch;
  update(documentRef: AdminDocumentReference, data: DocumentData): AdminWriteBatch;
  delete(documentRef: AdminDocumentReference): AdminWriteBatch;
  commit(): Promise<void>;
}

// Helper Types
export type SetOptions = {
  merge?: boolean;
  mergeFields?: Array<string | FieldPath>;
};

export type SnapshotListenOptions = {
  includeMetadataChanges?: boolean;
};

export type FieldPath = string | FirebaseFieldPath;

export interface FirebaseFieldPath {
  isEqual(other: FieldPath): boolean;
}