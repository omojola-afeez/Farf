import Link from 'next/link';
import { useEffect } from 'react';
import PageHead from '@/components/PageHead';
import { useCart } from '@/context/CartContext';
import { getStripe } from '@/lib/stripe';
import { verifyTransaction, paystackConfigured } from '@/lib/paystack';
import { orderNumberFromSession } from '@/lib/format';

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 'private, no-store');
  const none = { props: { paid: false, orderNumber: null, email: null } };

  try {
    const reference = String(query.reference || query.trxref || '');
    if (reference && paystackConfigured()) {
      const data = await verifyTransaction(reference);
      const paid = data.status === 'success' && data.metadata?.source === 'farf';
      return {
        props: {
          paid,
          orderNumber: paid ? orderNumberFromSession(data.reference) : null,
          email: paid ? data.customer?.email || null : null,
        },
      };
    }

    const sessionId = String(query.session_id || '');
    const stripe = getStripe();
    if (sessionId && stripe) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paid = session.payment_status === 'paid';
      return {
        props: {
          paid,
          orderNumber: paid ? orderNumberFromSession(session.id) : null,
          email: paid ? session.customer_details?.email || null : null,
        },
      };
    }
  } catch (e) {
    // Fall through to the "could not confirm" message.
  }
  return none;
}

export default function Success({ paid, orderNumber, email }) {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (paid && ready) clear();
  }, [paid, ready, clear]);

  const trackHref =
    orderNumber && email
      ? `/track?id=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      : '/track';

  return (
    <>
      <PageHead title="Order confirmation" />
      <div className="container-page max-w-2xl py-12">
        <div className="glass-strong rounded-[2rem] p-8 text-center sm:p-12">
          {paid ? (
            <>
              <h1 className="text-3xl">Thank you for your order</h1>
              <p className="mt-4 text-lg">
                Your order number is <strong>{orderNumber}</strong>.
              </p>
              <p className="mt-2 text-lg text-slate-700">
                A confirmation email is on its way{email ? ` to ${email}` : ''}.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={trackHref} className="btn-primary">Track this order</Link>
                <Link href="/shop" className="btn-secondary">Keep shopping</Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl">We could not confirm a payment</h1>
              <p className="mt-4 text-lg text-slate-700">
                If you were charged, contact us with your payment receipt and we will check the order.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/cart" className="btn-primary">Back to cart</Link>
                <Link href="/contact" className="btn-secondary">Contact us</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
