const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function api(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('amexan_token') : null;

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('amexan_token');
      localStorage.removeItem('amexan_user');
    }
    // Try to get error message from response body
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error || body?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}