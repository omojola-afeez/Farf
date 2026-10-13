import { siteConfig } from './siteConfig';

// Naira shows as ₦12,500 (no decimals unless needed).
export function formatPrice(amount, currency = siteConfig.currency) {
  const value = Number(amount) || 0;
  const code = String(currency).toUpperCase();
  try {
    return new Intl.NumberFormat(code === 'NGN' ? 'en-NG' : 'en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    return `${code} ${value.toLocaleString('en-US')}`;
  }
}

// Works for a Stripe session id or a Paystack reference. Same input always gives the same number.
export function orderNumberFromSession(id) {
  return `FARF-${String(id).slice(-8).toUpperCase()}`;
}

export function variantLabel(variants) {
  return Object.entries(variants || {})
    .map(([name, value]) => `${name}: ${value}`)
    .join(', ');
}

export function cartLineKey(productId, variants) {
  const parts = Object.entries(variants || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}:${value}`)
    .join(',');
  return `${productId}|${parts}`;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
