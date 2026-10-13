import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from '@/lib/siteConfig';
import { formatPrice } from '@/lib/format';

const providerName = siteConfig.paymentProvider === 'stripe' ? 'Stripe' : 'Paystack';

const TABS = [
  {
    id: 'delivery',
    label: 'Delivery',
    q: 'How long does delivery take?',
    a: `Orders usually arrive in ${siteConfig.deliveryWindow}. Delivery is free over ${formatPrice(siteConfig.freeShippingThreshold)}. Below that, the fee is shown in your cart before you pay.`,
  },
  {
    id: 'returns',
    label: 'Returns',
    q: 'Can I return an item?',
    a: `Yes. Unused items in their original packaging can be returned within ${siteConfig.returnWindowDays} days. The terms page has the full details.`,
  },
  {
    id: 'payment',
    label: 'Payment',
    q: 'How do I pay?',
    a: `Payment is taken securely through ${providerName}. Your card details never reach our servers.`,
  },
];

export default function FaqTabs() {
  const [tab, setTab] = useState('delivery');
  const current = TABS.find((t) => t.id === tab);

  return (
    <section className="container-page py-12">
      <div className="glass-strong rounded-[2.5rem] p-6 sm:p-12">
        <h2 className="text-3xl font-semibold sm:text-4xl">Quick answers</h2>
        <div role="tablist" aria-label="Frequently asked questions" className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`min-h-[44px] rounded-full px-5 text-base font-semibold transition-colors ${
                tab === t.id ? 'bg-brand-teal text-white' : 'bg-white/60 text-slate-800 hover:bg-white/90'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} className="mt-8">
          <h3 className="text-xl font-semibold">{current.q}</h3>
          <p className="mt-3 max-w-2xl text-lg text-slate-700">{current.a}</p>
        </div>
        <Link href="/faq" className="mt-8 inline-block font-semibold text-brand-teal-dark underline">
          More questions
        </Link>
      </div>
    </section>
  );
}
