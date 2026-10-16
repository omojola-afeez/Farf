import Link from 'next/link';
import { useState } from 'react';
import PageHead from '@/components/PageHead';
import ProductImage from '@/components/ProductImage';
import { useCart } from '@/context/CartContext';
import { formatPrice, variantLabel } from '@/lib/format';
import { nigerianStates } from '@/lib/nigeria';
import { siteConfig } from '@/lib/siteConfig';

const emptyCustomer = { name: '', email: '', phone: '', address: '', city: '', state: '' };

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, removeItem } = useCart();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const needsDetails = siteConfig.paymentProvider !== 'stripe';
  const total = subtotal;

  const update = (field) => (e) => setCustomer((c) => ({ ...c, [field]: e.target.value }));

  async function checkout(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variants: i.variants })),
          customer: needsDetails ? customer : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout could not start.');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function whatsappLink() {
    const lines = items.map(
      (i) =>
        `- ${i.name}${Object.keys(i.variants || {}).length ? ` (${variantLabel(i.variants)})` : ''} x ${i.quantity}: ${formatPrice(i.price * i.quantity)}`
    );
    const parts = [
      `Hello ${siteConfig.name}, I would like to order:`,
      ...lines,
      '',
      `Items total: ${formatPrice(total)}`,
      'Delivery: to be agreed with you',
    ];
    const details = [
      customer.name && `Name: ${customer.name}`,
      customer.phone && `Phone: ${customer.phone}`,
      [customer.address, customer.city, customer.state].filter(Boolean).join(', ') &&
        `Address: ${[customer.address, customer.city, customer.state].filter(Boolean).join(', ')}`,
    ].filter(Boolean);
    if (details.length) parts.push('', ...details);
    parts.push('', 'Please confirm availability and how to pay.');
    return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(parts.join('\n'))}`;
  }

  return (
    <>
      <PageHead title="Your cart" />
      <div className="container-page py-8">
        <h1 className="text-3xl">Your cart</h1>

        {!ready ? (
          <p className="mt-6 text-lg">Loading your cart...</p>
        ) : items.length === 0 ? (
          <div className="glass-strong mt-6 rounded-[2rem] p-8 text-center">
            <p className="text-lg font-semibold">Your cart is empty.</p>
            <Link href="/shop" className="btn-primary mt-4">Start shopping</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
            <ul className="glass h-fit divide-y divide-white/60 rounded-[2rem]">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 p-4">
                  <div className="w-20 shrink-0 overflow-hidden rounded-2xl border border-white/70 sm:w-24">
                    <ProductImage
                      image={item.imageUrl ? { url: item.imageUrl } : null}
                      name={item.name}
                      category={item.category}
                      width={200}
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.slug}`} className="text-base font-semibold hover:underline">
                      {item.name}
                    </Link>
                    {Object.keys(item.variants || {}).length > 0 && (
                      <p className="text-sm text-slate-600">{variantLabel(item.variants)}</p>
                    )}
                    <p className="mt-1 text-base font-bold">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-slate-400/70 bg-white/60">
                        <button
                          type="button"
                          className="h-11 w-11 text-xl font-bold"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                        >
                          &minus;
                        </button>
                        <span className="w-8 text-center text-base font-semibold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="h-11 w-11 text-xl font-bold disabled:opacity-40"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.quantity >= (item.maxQuantity || 99)}
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="min-h-[44px] text-base font-semibold text-red-700 underline"
                        onClick={() => removeItem(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-bold">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <form onSubmit={checkout} className="glass-strong h-fit rounded-[2rem] p-5 sm:p-6">
              <h2 className="text-xl">Order summary</h2>
              <dl className="mt-4 space-y-2 text-base">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd className="text-right font-semibold">Agreed on WhatsApp</dd>
                </div>
                <div className="flex justify-between border-t border-slate-300/70 pt-2 text-lg">
                  <dt className="font-bold">Items total</dt>
                  <dd className="font-extrabold">{formatPrice(total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm text-slate-700">
                The delivery fee is paid by the buyer and is not included. Agree it with us on WhatsApp.
              </p>

              {needsDetails && (
                <fieldset className="mt-5 space-y-3">
                  <legend className="mb-1 text-base font-bold">Delivery details</legend>
                  <div>
                    <label htmlFor="d-name" className="label">Full name</label>
                    <input id="d-name" required className="input" value={customer.name} onChange={update('name')} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="d-email" className="label">Email</label>
                    <input id="d-email" type="email" required className="input" value={customer.email} onChange={update('email')} autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="d-phone" className="label">Phone number</label>
                    <input id="d-phone" type="tel" required inputMode="tel" placeholder="0803 123 4567" className="input" value={customer.phone} onChange={update('phone')} autoComplete="tel" />
                  </div>
                  <div>
                    <label htmlFor="d-address" className="label">Delivery address</label>
                    <input id="d-address" required className="input" value={customer.address} onChange={update('address')} autoComplete="street-address" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="d-city" className="label">City or town</label>
                      <input id="d-city" required className="input" value={customer.city} onChange={update('city')} autoComplete="address-level2" />
                    </div>
                    <div>
                      <label htmlFor="d-state" className="label">State</label>
                      <select id="d-state" required className="input" value={customer.state} onChange={update('state')}>
                        <option value="">Choose</option>
                        {nigerianStates.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </fieldset>
              )}

              <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
                {loading ? 'Starting payment...' : `Pay ${formatPrice(total)}`}
              </button>
              <p className="mt-2 text-center text-xs text-slate-600">
                {siteConfig.paymentProvider === 'stripe' ? 'Secure payment by Stripe.' : 'Secure payment by Paystack: card, bank transfer or USSD.'}
              </p>
              {siteConfig.whatsapp && (
                <>
                  <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <span className="h-px flex-1 bg-slate-300" />
                    or
                    <span className="h-px flex-1 bg-slate-300" />
                  </div>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full bg-[#128C7E] text-white hover:bg-[#0B6B60]"
                  >
                    Order on WhatsApp
                  </a>
                  <p className="mt-2 text-center text-xs text-slate-600">
                    Send your cart to us on WhatsApp and agree payment there, for example bank transfer.
                  </p>
                </>
              )}
              {error && (
                <p role="alert" className="mt-3 text-base font-semibold text-red-700">
                  {error}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
}
