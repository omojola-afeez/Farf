import { client, sanityCanWrite } from './sanity';
import { orderNumberFromSession, variantLabel } from './format';

function randomKey() {
  return Math.random().toString(36).slice(2, 12);
}

// Order from a paid Stripe Checkout session (expanded with line_items.data.price.product).
export function buildStripeOrderDoc(session) {
  const shipping = session.collected_information?.shipping_details || session.shipping_details || {};
  const address = shipping.address || {};
  const lineItems = session.line_items?.data || [];

  const items = lineItems.map((li) => {
    const product = li.price?.product;
    const meta = product && typeof product === 'object' ? product.metadata || {} : {};
    let variants = {};
    try {
      variants = JSON.parse(meta.variants || '{}');
    } catch (e) {
      variants = {};
    }
    const qty = li.quantity || 1;
    return {
      _key: randomKey(),
      productId: meta.productId || '',
      name: li.description || 'Item',
      variants: variantLabel(variants),
      quantity: qty,
      unitAmount: Math.round((li.amount_total || 0) / qty) / 100,
    };
  });

  return {
    _id: `order-${session.id}`,
    _type: 'order',
    orderNumber: orderNumberFromSession(session.id),
    paymentProvider: 'stripe',
    paymentReference: session.id,
    status: 'paid',
    email: String(session.customer_details?.email || '').trim().toLowerCase(),
    customerName: session.customer_details?.name || '',
    phone: session.customer_details?.phone || '',
    shippingName: shipping.name || '',
    shippingAddress: {
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postal_code || '',
      country: address.country || '',
    },
    items,
    subtotal: (session.amount_subtotal || 0) / 100,
    shippingCost: (session.total_details?.amount_shipping || 0) / 100,
    total: (session.amount_total || 0) / 100,
    currency: session.currency || 'ngn',
    paidAt: new Date().toISOString(),
  };
}

// Order from a verified Paystack transaction. The metadata was written by /api/checkout,
// and Paystack only returns it after the payment is confirmed.
export function buildPaystackOrderDoc(data) {
  const meta = data.metadata || {};
  const customer = meta.customer || {};
  const ship = meta.shipping || {};

  const items = (Array.isArray(meta.items) ? meta.items : []).map((i) => ({
    _key: randomKey(),
    productId: String(i.productId || ''),
    name: String(i.name || 'Item'),
    variants: String(i.variants || ''),
    quantity: Number(i.quantity) || 1,
    unitAmount: (Number(i.unitAmount) || 0) / 100,
  }));

  return {
    _id: `order-${data.reference}`,
    _type: 'order',
    orderNumber: orderNumberFromSession(data.reference),
    paymentProvider: 'paystack',
    paymentReference: data.reference,
    status: 'paid',
    email: String(data.customer?.email || '').trim().toLowerCase(),
    customerName: customer.name || '',
    phone: customer.phone || '',
    shippingName: customer.name || '',
    shippingAddress: {
      line1: ship.address || '',
      line2: '',
      city: ship.city || '',
      state: ship.state || '',
      postalCode: '',
      country: ship.country || 'NG',
    },
    items,
    subtotal: (Number(meta.subtotal) || 0) / 100,
    shippingCost: (Number(meta.shippingCost) || 0) / 100,
    total: (Number(data.amount) || 0) / 100,
    currency: String(data.currency || 'NGN').toLowerCase(),
    paidAt: new Date().toISOString(),
  };
}

// Returns { created: true } for a new order and { created: false } when the order already exists.
// The document id comes from the payment reference, so a retried webhook cannot create a second order.
export async function saveOrder(doc) {
  if (!sanityCanWrite) {
    throw new Error('Sanity is not configured for writes. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.');
  }
  try {
    await client.create(doc);
    return { created: true };
  } catch (err) {
    const duplicate =
      err?.statusCode === 409 || /already exists/i.test(String(err?.message || ''));
    if (duplicate) return { created: false };
    throw err;
  }
}

export async function findOrder(identifier, email) {
  if (!sanityCanWrite) return { unavailable: true, order: null };
  const id = String(identifier || '').trim();
  const mail = String(email || '').trim().toLowerCase();
  if (!id || !mail) return { order: null };
  const order = await client.fetch(
    `*[_type == "order" && (orderNumber == $number || paymentReference == $reference) && email == $email][0]{
      orderNumber, status, paidAt, trackingNote, items, shippingName, shippingAddress,
      subtotal, shippingCost, total, currency
    }`,
    { number: id.toUpperCase(), reference: id, email: mail }
  );
  return { order: order ? JSON.parse(JSON.stringify(order)) : null };
}
