import { client, sanityCanWrite } from '@/lib/sanity';
import { sendContactEmail } from '@/lib/email';
import { isEmail } from '@/lib/format';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const body = req.body || {};
  // Honeypot: real visitors leave this empty. Pretend success so bots move on.
  if (body.website) return res.status(200).json({ ok: true });

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().toLowerCase();
  const message = String(body.message || '').trim().slice(0, 4000);

  if (!name || !message) return res.status(400).json({ error: 'Name and message are required.' });
  if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (!sanityCanWrite && !process.env.ADMIN_EMAIL) {
    return res.status(503).json({ error: 'Messages cannot be sent right now. Please email us instead.' });
  }

  try {
    if (sanityCanWrite) {
      await client.create({
        _type: 'inquiry',
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
        handled: false,
      });
    }
    await sendContactEmail({ name, email, message });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: 'Message could not be sent. Please try again.' });
  }
}
