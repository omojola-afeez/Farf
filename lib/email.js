import { Resend } from 'resend';
import { escapeHtml, formatPrice } from './format';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || 'FARF <onboarding@resend.dev>';

async function send(payload) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email skipped:', payload.subject);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, ...payload });
  if (error) console.error('Resend error:', payload.subject, error);
}

function itemRows(order) {
  return order.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px 4px 0">${escapeHtml(i.name)} x ${i.quantity}</td><td style="padding:4px 0;text-align:right">${escapeHtml(
          formatPrice(i.unitAmount * i.quantity, order.currency)
        )}</td></tr>`
    )
    .join('');
}

function addressBlock(order) {
  const a = order.shippingAddress || {};
  return [order.shippingName, a.line1, a.line2, [a.city, a.state, a.postalCode].filter(Boolean).join(', '), a.country]
    .filter(Boolean)
    .map(escapeHtml)
    .join('<br>');
}

function summaryHtml(order) {
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${itemRows(order)}
      <tr><td style="padding:8px 8px 4px 0;border-top:1px solid #ddd">Subtotal</td><td style="padding:8px 0 4px;border-top:1px solid #ddd;text-align:right">${escapeHtml(formatPrice(order.subtotal, order.currency))}</td></tr>
      <tr><td style="padding:4px 8px 4px 0">Delivery</td><td style="padding:4px 0;text-align:right">${escapeHtml(formatPrice(order.shippingCost, order.currency))}</td></tr>
      <tr><td style="padding:4px 8px 4px 0"><strong>Total</strong></td><td style="padding:4px 0;text-align:right"><strong>${escapeHtml(formatPrice(order.total, order.currency))}</strong></td></tr>
    </table>
    <p style="font-size:14px"><strong>Delivery address</strong><br>${addressBlock(order)}</p>`;
}

export async function sendOrderEmails(order) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const trackUrl = `${siteUrl}/track?id=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.email)}`;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111">
      <h2 style="color:#0F766E">Thank you for your order</h2>
      <p>Order number: <strong>${escapeHtml(order.orderNumber)}</strong></p>
      ${summaryHtml(order)}
      <p><a href="${escapeHtml(trackUrl)}">Track your order</a></p>
    </div>`;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111">
      <h2>New paid order ${escapeHtml(order.orderNumber)}</h2>
      <p>Customer: ${escapeHtml(order.customerName)} (${escapeHtml(order.email)})<br>Phone: ${escapeHtml(order.phone || 'not given')}</p>
      ${summaryHtml(order)}
    </div>`;

  const jobs = [];
  if (order.email) {
    jobs.push(send({ to: order.email, subject: `FARF order ${order.orderNumber} confirmed`, html: customerHtml }));
  }
  if (process.env.ADMIN_EMAIL) {
    jobs.push(send({ to: process.env.ADMIN_EMAIL, subject: `New order ${order.orderNumber}`, html: adminHtml }));
  } else {
    console.warn('ADMIN_EMAIL is not set. Admin notification skipped.');
  }
  await Promise.allSettled(jobs);
}

export async function sendContactEmail({ name, email, message }) {
  if (!process.env.ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL is not set. Contact notification skipped.');
    return;
  }
  await send({
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `FARF contact form: ${name}`,
    html: `<div style="font-family:Arial,sans-serif"><p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p></div>`,
  });
}
