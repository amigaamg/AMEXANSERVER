// lib/utils/api.ts

// ── Base URL ──────────────────────────────────────────────────────────────────
// NEXT_PUBLIC_API_URL should be set in .env.local:
//   NEXT_PUBLIC_API_URL=http://localhost:5000/api   (development)
//   NEXT_PUBLIC_API_URL=https://api.amexan.com/api  (production)
//
// The /api suffix lives HERE — never repeat it in individual api.get() calls.
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '') + '/api';

// ── Core request ─────────────────────────────────────────────────────────────
async function request(url: string, options: RequestInit = {}): Promise<any> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('amexan_token') : null;

  // Ensure url always starts with /
  const path = url.startsWith('/') ? url : `/${url}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
  } catch (networkErr: any) {
    // Network failure (server down, no internet, CORS preflight failure)
    throw new Error('Network error — please check your connection.');
  }

  // ── 401 Unauthorised → clear stale credentials ────────────────────────────
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('amexan_token');
      localStorage.removeItem('amexan_user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    throw new Error('Session expired. Please log in again.');
  }

  // ── Other error statuses ──────────────────────────────────────────────────
  if (!res.ok) {
    // Log exact failing URL so we can identify broken endpoints immediately
    console.error(`🔴 API FAIL: ${options.method ?? 'GET'} ${API_BASE}${path} → ${res.status}`);

    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error || body?.message || body?.msg || message;
    } catch {
      // Body wasn't JSON — keep the HTTP status message
    }
    throw new Error(message);
  }

  // ── Empty responses (204 No Content, 201 with no body) ────────────────────
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json') || res.status === 204) {
    return null;
  }

  return res.json();
}

// ── Method helpers ────────────────────────────────────────────────────────────
//
// Usage:
//   api.get('/patients/123')
//   api.post('/appointments', { patientId, date })
//   api.put('/medications/456', { active: false })
//   api.patch('/services/789', { isAvailableNow: true })
//   api.delete('/alerts/abc')
//
// ⚠️  NEVER include /api in the url argument — it's already in API_BASE.
//
export const api = {
  get: (url: string, options?: RequestInit) =>
    request(url, { ...options, method: 'GET' }),

  post: (url: string, body?: unknown, options?: RequestInit) =>
    request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: (url: string, body?: unknown, options?: RequestInit) =>
    request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  patch: (url: string, body?: unknown, options?: RequestInit) =>
    request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

  delete: (url: string, options?: RequestInit) =>
    request(url, { ...options, method: 'DELETE' }),
};

// Default export — supports both import styles:
//   import api from '@/lib/utils/api'       ← default  (api.get, api.post …)
//   import { api } from '@/lib/utils/api'   ← named    (same object)
export default api;