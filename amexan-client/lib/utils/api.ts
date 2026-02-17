const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function api(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('amexan_token');
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
      // Clear invalid token
      localStorage.removeItem('amexan_token');
      localStorage.removeItem('amexan_user');
    }
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}