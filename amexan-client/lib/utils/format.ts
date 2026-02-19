export function formatCurrency(amount: number, currency = 'KES'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatPhone(phone: string): string {
  // Simple formatting: 07XXXXXXXX -> +254 7XX XXX XXX
  if (phone.startsWith('0')) {
    phone = '254' + phone.slice(1);
  }
  if (phone.startsWith('254')) {
    return `+${phone.slice(0,3)} ${phone.slice(3,6)} ${phone.slice(6,9)} ${phone.slice(9)}`;
  }
  return phone;
}

export function formatDistanceToNow(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}