import { getStripe } from '@/lib/stripe';
import { buildStripeOrderDoc, saveOrder } from '@/lib/orders';
import { sendOrderEmails } from '@/lib/email';

// Stripe webhook. Only used when NEXT_PUBLIC_PAYMENT_PROVIDER=stripe.
// Stripe signs the raw request body, so Next.js body parsing must be off.
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handlePaidSession(stripe, sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product'],
  });
  if (session.payment_status !== 'paid') return;

  const doc = buildStripeOrderDoc(session);
  const { created } = await saveOrder(doc);
  if (!created) {
    console.log(`Order ${doc.orderNumber} already recorded. No emails sent.`);
    return;
  }
  await sendOrderEmails(doc);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return res.status(503).end('Stripe is not configured.');

  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], secret);
  } catch (err) {
    console.error('Webhook signature check failed:', err.message);
    return res.status(400).end('Invalid signature');
  }

  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      await handlePaidSession(stripe, event.data.object.id);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handling failed:', err);
    return res.status(500).end('Webhook handler failed');
  }
}
