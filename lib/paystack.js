import { createHmac, timingSafeEqual } from 'crypto';

const BASE = 'https://api.paystack.co';

export function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status === false) {
    throw new Error(json.message || `Paystack request failed (${res.status})`);
  }
  return json.data;
}

export function initializeTransaction(body) {
  return request('/transaction/initialize', { method: 'POST', body: JSON.stringify(body) });
}

export function verifyTransaction(reference) {
  return request(`/transaction/verify/${encodeURIComponent(reference)}`);
}

// Paystack signs the raw body with HMAC SHA512 using your secret key.
export function isValidSignature(rawBody, signature) {
  if (!process.env.PAYSTACK_SECRET_KEY || !signature) return false;
  const expected = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && timingSafeEqual(a, b);
}
