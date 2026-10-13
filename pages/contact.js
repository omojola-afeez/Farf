import { useState } from 'react';
import PageHead from '@/components/PageHead';
import { siteConfig } from '@/lib/siteConfig';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Message could not be sent.');
      setForm({ name: '', email: '', message: '', website: '' });
      setStatus({ state: 'done', message: 'Thanks. We received your message and will reply by email.' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  }

  return (
    <>
      <PageHead title="Contact us" />
      <div className="mx-auto my-10 w-[calc(100%-2rem)] glass-strong rounded-[2rem] p-6 sm:p-10 max-w-2xl">
        <h1 className="text-3xl">Contact us</h1>
        <p className="mt-2 text-lg text-slate-700">
          Email <a className="font-semibold underline" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> or
          send a message below.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="c-name" className="label">Name</label>
            <input id="c-name" required className="input" value={form.name} onChange={update('name')} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="c-email" className="label">Email</label>
            <input id="c-email" type="email" required className="input" value={form.email} onChange={update('email')} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="c-message" className="label">Message</label>
            <textarea id="c-message" required rows={6} className="input" value={form.message} onChange={update('message')} />
          </div>
          {/* Honeypot field. People never see it, so a filled value means a bot. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="c-website">Website</label>
            <input id="c-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
          </div>
          <button type="submit" className="btn-primary" disabled={status.state === 'loading'}>
            {status.state === 'loading' ? 'Sending...' : 'Send message'}
          </button>
          {status.message && (
            <p
              role="status"
              className={`text-base font-semibold ${status.state === 'error' ? 'text-red-700' : 'text-brand-teal-dark'}`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
