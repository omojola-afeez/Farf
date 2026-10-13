import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not subscribe.');
      setEmail('');
      setStatus({ state: 'done', message: 'You are subscribed.' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  }

  return (
    <section>
      <div className="container-page py-10">
        <div className="glass-strong mx-auto max-w-xl rounded-[2rem] p-8 text-center">
          <h2 className="text-2xl">Get updates on new stock</h2>
          <p className="mt-2 text-slate-700">Join the email list for restocks and back-to-school offers.</p>
          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              autoComplete="email"
            />
            <button type="submit" className="btn-primary" disabled={status.state === 'loading'}>
              {status.state === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
          {status.message && (
            <p
              role="status"
              className={`mt-3 text-sm font-semibold ${status.state === 'error' ? 'text-red-700' : 'text-brand-teal-dark'}`}
            >
              {status.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
