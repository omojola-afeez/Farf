import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { formatPrice } from '@/lib/format';
import { siteConfig } from '@/lib/siteConfig';

export default function Faq() {
  const items = [
    {
      q: 'How long does delivery take?',
      a: `Orders arrive in ${siteConfig.deliveryWindow}. You get an email once your order is paid, and you can check progress on the Track order page.`,
    },
    {
      q: 'How much is delivery?',
      a: 'The buyer pays the delivery fee. It depends on your location, and we agree the amount with you on WhatsApp.',
    },
    {
      q: 'Can I return an item?',
      a: `Yes. Unused items can be returned within ${siteConfig.returnWindowDays} days. See the Terms and returns page for the steps.`,
    },
    {
      q: 'How do I pay?',
      a: 'You enter your delivery details in the cart, then pay by card, bank transfer or USSD on the secure Paystack page.',
    },
    {
      q: 'How do I track my order?',
      a: 'Open the Track order page and enter your order number and the email you used at checkout.',
    },
    {
      q: 'An item I want is out of stock. What can I do?',
      a: 'Out-of-stock items cannot be ordered. Join the email list on the home page to hear about restocks.',
    },
  ];

  return (
    <>
      <PageHead title="FAQ" />
      <div className="mx-auto my-10 w-[calc(100%-2rem)] glass-strong rounded-[2rem] p-6 sm:p-10 max-w-3xl">
        <h1 className="text-3xl">Frequently asked questions</h1>
        <div className="mt-6 divide-y divide-white/70 rounded-2xl border border-white/70 bg-white/40">
          {items.map((item) => (
            <details key={item.q} className="group p-4">
              <summary className="flex min-h-[44px] cursor-pointer items-center text-lg font-semibold">
                {item.q}
              </summary>
              <p className="mt-2 text-base text-slate-700">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-lg">
          Still need help? <Link href="/contact" className="font-bold text-brand-teal-dark underline">Contact us</Link>.
        </p>
      </div>
    </>
  );
}
