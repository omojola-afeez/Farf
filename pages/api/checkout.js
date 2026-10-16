import { randomBytes } from 'crypto';
import { getStripe } from '@/lib/stripe';
import { initializeTransaction, paystackConfigured } from '@/lib/paystack';
import { prepareCart } from '@/lib/cart';
import { siteConfig } from '@/lib/siteConfig';
import { cleanNigerianPhone, nigerianStates } from '@/lib/nigeria';
import { isEmail } from '@/lib/format';

function originOf(req) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`
  );
}

async function payWithPaystack(req, res, prepared) {
  if (!paystackConfigured()) {
    return res.status(503).json({ error: 'Online payment is not set up yet.' });
  }

  const c = req.body?.customer || {};
  const name = String(c.name || '').trim().slice(0, 120);
  const email = String(c.email || '').trim().toLowerCase();
  const phone = cleanNigerianPhone(c.phone);
  const address = String(c.address || '').trim().slice(0, 240);
  const city = String(c.city || '').trim().slice(0, 80);
  const state = String(c.state || '').trim();

  if (!name) return res.status(400).json({ error: 'Enter your full name.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (!phone) return res.status(400).json({ error: 'Enter a valid Nigerian phone number.' });
  if (!address) return res.status(400).json({ error: 'Enter your delivery address.' });
  if (!city) return res.status(400).json({ error: 'Enter your city or town.' });
  if (!nigerianStates.includes(state)) return res.status(400).json({ error: 'Choose your state.' });

  const reference = `farf_${randomBytes(10).toString('hex')}`;
  const origin = originOf(req);

  const data = await initializeTransaction({
    email,
    amount: prepared.total,
    currency: siteConfig.currency.toUpperCase(),
    reference,
    callback_url: `${origin}/checkout/success?reference=${reference}`,
    metadata: {
      source: 'farf',
      cancel_action: `${origin}/cart`,
      customer: { name, phone },
      shipping: { address, city, state, country: 'NG' },
      subtotal: prepared.subtotal,
      shippingCost: prepared.shipping,
      items: prepared.lines.map((l) => ({
        productId: l.product._id,
        name: l.label ? `${l.product.name} (${l.label})` : l.product.name,
        variants: l.label,
        quantity: l.quantity,
        unitAmount: l.unitAmount,
      })),
    },
  });

  return res.status(200).json({ url: data.authorization_url });
}

async function payWithStripe(req, res, prepared) {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ error: 'Online payment is not set up yet.' });

  const currency = siteConfig.currency;
  const countries = (process.env.SHIPPING_COUNTRIES || 'NG')
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
  const origin = originOf(req);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: prepared.lines.map((l) => {
      const image = l.product.images?.[0]?.url;
      return {
        quantity: l.quantity,
        price_data: {
          currency,
          unit_amount: l.unitAmount,
          product_data: {
            name: l.label ? `${l.product.name} (${l.label})` : l.product.name,
            ...(image ? { images: [`${image}?w=600&auto=format`] } : {}),
            metadata: { productId: l.product._id, variants: JSON.stringify(l.selected) },
          },
        },
      };
    }),
    shipping_address_collection: { allowed_countries: countries },
    phone_number_collection: { enabled: true },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: prepared.shipping, currency },
          display_name: 'Delivery fee agreed on WhatsApp',
        },
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: { source: 'farf' },
  });

  return res.status(200).json({ url: session.url });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const prepared = await prepareCart(req.body?.items);
    if (prepared.error) return res.status(400).json({ error: prepared.error });

    if (siteConfig.paymentProvider === 'stripe') return await payWithStripe(req, res, prepared);
    return await payWithPaystack(req, res, prepared);
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Checkout could not start. Please try again.' });
  }
}
