import { createHash } from 'crypto';
import { client, sanityCanWrite } from '@/lib/sanity';
import { isEmail } from '@/lib/format';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (!sanityCanWrite) return res.status(503).json({ error: 'Sign-up is not available right now.' });

  try {
    const id = `subscriber-${createHash('sha1').update(email).digest('hex')}`;
    await client.createIfNotExists({
      _id: id,
      _type: 'subscriber',
      email,
      subscribedAt: new Date().toISOString(),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Newsletter error:', err);
    return res.status(500).json({ error: 'Could not subscribe. Please try again.' });
  }
}
