// lib/utils/date.ts

export function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelative(iso: string): string {
  if (!iso) return '—';
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const past = diff < 0;

  if (abs < 60_000)     return past ? 'just now' : 'in a moment';
  if (abs < 3_600_000)  { const m = Math.round(abs / 60_000);     return past ? `${m}m ago`  : `in ${m}m`; }
  if (abs < 86_400_000) { const h = Math.round(abs / 3_600_000);  return past ? `${h}h ago`  : `in ${h}h`; }
  const d = Math.round(abs / 86_400_000);
  return past ? `${d}d ago` : `in ${d}d`;
}

export function countdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return '🔴 Starting now!';
  const days  = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins  = Math.floor((diff % 3_600_000) / 60_000);

  if (days > 0)  return `${days}d ${hours}h away`;
  if (hours > 0) return `${hours}h ${mins}m away`;
  return `${mins}m away`;
}

// ── Aliases (different components use different names) ────────────────────────
export const timeAgo = formatRelative;