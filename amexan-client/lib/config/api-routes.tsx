// ─── AMEXAN API ROUTES ────────────────────────────────────────────────────────
// Single source of truth for all API endpoints

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API = {
  BASE,

  // Auth
  AUTH: {
    LOGIN:    `${BASE}/api/auth/login`,
    REGISTER: `${BASE}/api/auth/register`,
    ME:       `${BASE}/api/auth/me`,
    REFRESH:  `${BASE}/api/auth/refresh`,
    LOGOUT:   `${BASE}/api/auth/logout`,
  },

  // Patient
  PATIENTS: {
    BASE:         (id: string) => `${BASE}/api/patients/${id}`,
    MEASUREMENTS: (id: string) => `${BASE}/api/patients/${id}/measurements`,
    ALERTS:       (id: string) => `${BASE}/api/patients/${id}/alerts`,
    MEDICATIONS:  (id: string) => `${BASE}/api/patients/${id}/medications`,
    VISITS:       (id: string) => `${BASE}/api/patients/${id}/visits`,
    LABS:         (id: string) => `${BASE}/api/patients/${id}/labs`,
    IMAGING:      (id: string) => `${BASE}/api/patients/${id}/imaging`,
    MESSAGES:     (id: string) => `${BASE}/api/patients/${id}/messages`,
    PAYMENTS:     (id: string) => `${BASE}/api/patients/${id}/payments`,
    EDUCATION:    (id: string) => `${BASE}/api/patients/${id}/education`,
    REFERRALS:    (id: string) => `${BASE}/api/patients/${id}/referrals`,
    HISTORY:      (id: string) => `${BASE}/api/patients/${id}/history`,
    ADHERENCE:    (id: string) => `${BASE}/api/patients/${id}/adherence`,
    UPDATE:       (id: string) => `${BASE}/api/patients/${id}`,
    UPLOAD:       (id: string) => `${BASE}/api/patients/${id}/upload`,
  },

  // Doctors & Services
  DOCTORS: {
    LIST:          `${BASE}/api/doctors`,
    DETAIL:        (id: string) => `${BASE}/api/doctors/${id}`,
    SERVICES:      (id: string) => `${BASE}/api/doctors/${id}/services`,
    AVAILABILITY:  (id: string) => `${BASE}/api/doctors/${id}/availability`,
    SLOTS:         (id: string) => `${BASE}/api/doctors/${id}/slots`,
    REVIEWS:       (id: string) => `${BASE}/api/doctors/${id}/reviews`,
  },

  // Appointments / Bookings
  APPOINTMENTS: {
    CREATE:   `${BASE}/api/appointments`,
    LIST:     `${BASE}/api/appointments`,
    DETAIL:   (id: string) => `${BASE}/api/appointments/${id}`,
    CANCEL:   (id: string) => `${BASE}/api/appointments/${id}/cancel`,
    TRANSFER: (id: string) => `${BASE}/api/appointments/${id}/transfer`,
    JOIN:     (id: string) => `${BASE}/api/appointments/${id}/join`,
  },

  // Measurements / Vitals
  MEASUREMENTS: {
    CREATE: `${BASE}/api/measurements`,
    LIST:   `${BASE}/api/measurements`,
    DELETE: (id: string) => `${BASE}/api/measurements/${id}`,
  },

  // Medications
  MEDICATIONS: {
    LIST:    `${BASE}/api/medications`,
    TAKE:    (id: string) => `${BASE}/api/medications/${id}/take`,
    REFILL:  (id: string) => `${BASE}/api/medications/${id}/refill`,
    SKIP:    (id: string) => `${BASE}/api/medications/${id}/skip`,
  },

  // Labs
  LABS: {
    LIST:   `${BASE}/api/labs`,
    DETAIL: (id: string) => `${BASE}/api/labs/${id}`,
  },

  // Payments
  PAYMENTS: {
    CREATE:       `${BASE}/api/payments`,
    MPESA_STK:    `${BASE}/api/payments/mpesa/stk`,
    MPESA_STATUS: (ref: string) => `${BASE}/api/payments/mpesa/status/${ref}`,
    HISTORY:      (id: string) => `${BASE}/api/payments/patient/${id}`,
    RECEIPT:      (id: string) => `${BASE}/api/payments/${id}/receipt`,
  },

  // Messages
  MESSAGES: {
    SEND:   `${BASE}/api/messages`,
    LIST:   `${BASE}/api/messages`,
    READ:   (id: string) => `${BASE}/api/messages/${id}/read`,
    THREAD: (threadId: string) => `${BASE}/api/messages/thread/${threadId}`,
  },

  // Education
  EDUCATION: {
    LIST: `${BASE}/api/education`,
  },

  // Alerts
  ALERTS: {
    READ:     (id: string) => `${BASE}/api/alerts/${id}/read`,
    READ_ALL: `${BASE}/api/alerts/read-all`,
  },

  // Triage
  TRIAGE: {
    EVALUATE: `${BASE}/api/triage/evaluate`,
  },

  // Services (for booking discovery)
  SERVICES: {
    LIST: `${BASE}/api/services`,
  },

  // Upload
  UPLOAD: `${BASE}/api/upload`,
} as const;