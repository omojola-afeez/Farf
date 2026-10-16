import PageHead from '@/components/PageHead';
import { formatPrice } from '@/lib/format';
import { siteConfig } from '@/lib/siteConfig';

// The figures on this page come from environment variables. Confirm them before launch.
export default function Terms() {
  return (
    <>
      <PageHead title="Terms and returns" />
      <div className="mx-auto my-10 w-[calc(100%-2rem)] glass-strong rounded-[2rem] p-6 sm:p-10 max-w-3xl">
        <h1 className="text-3xl">Terms and returns policy</h1>

        <div className="mt-6 space-y-8 text-base text-slate-800">
          <section>
            <h2 className="text-xl">Orders and payment</h2>
            <p className="mt-2">
              Prices are shown in Naira (₦). Payment is taken at checkout through {siteConfig.paymentProvider === 'stripe' ? 'Stripe' : 'Paystack'}.
              An order is confirmed when payment succeeds and you receive a confirmation email.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Delivery</h2>
            <p className="mt-2">
              The buyer pays the delivery fee. It depends on your location and is agreed on WhatsApp.
              Orders usually arrive in {siteConfig.deliveryWindow}.
              Please check your delivery address carefully before paying.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Returns</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>You can return unused items in their original packaging within {siteConfig.returnWindowDays} days of delivery.</li>
              <li>
                To start a return, email{' '}
                <a className="underline" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> with
                your order number.
              </li>
              <li>If an item arrives damaged or wrong, tell us as soon as you can and we will arrange a replacement or refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl">Contact</h2>
            <p className="mt-2">
              Questions about these terms: <a className="underline" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
