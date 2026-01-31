import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, Functions, connectFunctionsEmulator } from 'firebase/functions'
import { getAnalytics, Analytics } from 'firebase/analytics'
import { getPerformance, Performance } from 'firebase/performance'
import { getRemoteConfig, RemoteConfig } from 'firebase/remote-config'

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
let app: ReturnType<typeof initializeApp>
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let functions: Functions
let analytics: Analytics | null = null
let performance: Performance | null = null
let remoteConfig: RemoteConfig | null = null

const isClient = typeof window !== 'undefined'
const isDevelopment = process.env.NODE_ENV === 'development'

try {
  app = initializeApp(firebaseConfig)
  
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  functions = getFunctions(app)
  
  if (isClient) {
    // Analytics and Performance only on client
    analytics = getAnalytics(app)
    performance = getPerformance(app)
    remoteConfig = getRemoteConfig(app)
    
    // Set remote config settings
    if (remoteConfig) {
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000 // 1 hour
      remoteConfig.settings.fetchTimeoutMillis = 60000 // 60 seconds
    }
  }
  
  // Connect to emulators in development
  if (isDevelopment) {
    const EMULATOR_HOST = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || 'localhost'
    
    // Auth emulator
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`)
      connectFirestoreEmulator(db, EMULATOR_HOST, 8080)
      connectStorageEmulator(storage, EMULATOR_HOST, 9199)
      connectFunctionsEmulator(functions, EMULATOR_HOST, 5001)
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  
  // Fallback mock implementations for demo
  if (isClient) {
    auth = {} as Auth
    db = {} as Firestore
    storage = {} as FirebaseStorage
    functions = {} as Functions
  }
}

export { 
  app, 
  auth, 
  db, 
  storage, 
  functions, 
  analytics, 
  performance, 
  remoteConfig 
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  CHRONIC_DISEASES: 'chronic_diseases',
  HEALTH_READINGS: 'health_readings',
  MEDICATIONS: 'medications',
  MEDICATION_LOGS: 'medication_logs',
  PRESCRIPTIONS: 'prescriptions',
  LAB_RESULTS: 'lab_results',
  INSURANCE: 'insurance',
  CLAIMS: 'claims',
  BILLING: 'billing',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  SUPPLIES: 'supplies',
  ORDERS: 'orders',
  CHAT: 'chat',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  ALERTS: 'alerts',
  ANALYTICS: 'analytics',
  AUDIT_LOGS: 'audit_logs'
}