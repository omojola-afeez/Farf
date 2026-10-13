import { isValidSignature, verifyTransaction, paystackConfigured } from '@/lib/paystack';
import { buildPaystackOrderDoc, saveOrder } from '@/lib/orders';
import { sendOrderEmails } from '@/lib/email';

// Paystack signs the raw request body, so Next.js body parsing must be off.
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }
  if (!paystackConfigured()) return res.status(503).end('Paystack is not configured.');

  let raw;
  try {
    raw = await readRawBody(req);
  } catch (err) {
    return res.status(400).end('Could not read body');
  }
  if (!isValidSignature(raw, req.headers['x-paystack-signature'])) {
    console.error('Paystack webhook signature check failed.');
    return res.status(401).end('Invalid signature');
  }

  let event;
  try {
    event = JSON.parse(raw.toString('utf8'));
  } catch (err) {
    return res.status(400).end('Invalid JSON');
  }

  try {
    if (event.event === 'charge.success' && event.data?.reference) {
      // Confirm with Paystack directly instead of trusting the payload alone.
      const data = await verifyTransaction(event.data.reference);
      if (data.status !== 'success' || data.metadata?.source !== 'farf') {
        return res.status(200).json({ received: true, ignored: true });
      }
      const doc = buildPaystackOrderDoc(data);
      // Idempotent: the order id comes from the reference, so retries find the order already saved.
      const { created } = await saveOrder(doc);
      if (created) await sendOrderEmails(doc);
      else console.log(`Order ${doc.orderNumber} already recorded. No emails sent.`);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    // A non-2xx response makes Paystack retry. The order write is idempotent, so retries are safe.
    console.error('Paystack webhook handling failed:', err);
    return res.status(500).end('Webhook handler failed');
  }
}
