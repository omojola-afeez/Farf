import PageHead from '@/components/PageHead';
import { findOrder } from '@/lib/orders';
import { formatPrice } from '@/lib/format';

const STEPS = [
  { value: 'paid', label: 'Order received' },
  { value: 'processing', label: 'Being prepared' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 'private, no-store');
  const id = String(query.id || '').trim();
  const email = String(query.email || '').trim();
  if (!id || !email) return { props: { searched: false, order: null, unavailable: false, id, email } };

  const { order, unavailable } = await findOrder(id, email);
  return { props: { searched: true, order: order || null, unavailable: Boolean(unavailable), id, email } };
}

export default function Track({ searched, order, unavailable, id, email }) {
  const stepIndex = order ? STEPS.findIndex((s) => s.value === order.status) : -1;

  return (
    <>
      <PageHead title="Track your order" />
      <div className="container-page max-w-3xl py-8">
        <h1 className="text-3xl">Track your order</h1>
        <p className="mt-2 text-lg text-slate-700">
          Enter your order number (or payment reference) and the email you used at checkout.
        </p>

        <form method="get" action="/track" className="glass-strong mt-6 grid gap-4 rounded-[2rem] p-6 sm:grid-cols-2">
          <div>
            <label htmlFor="t-id" className="label">Order number</label>
            <input id="t-id" name="id" required defaultValue={id} className="input" placeholder="FARF-AB12CD34" />
          </div>
          <div>
            <label htmlFor="t-email" className="label">Email</label>
            <input id="t-email" name="email" type="email" required defaultValue={email} className="input" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full sm:w-auto">Find my order</button>
          </div>
        </form>

        {searched && unavailable && (
          <p role="alert" className="glass mt-6 rounded-2xl p-4 font-semibold">
            Order lookup is not available right now. Please contact us.
          </p>
        )}

        {searched && !unavailable && !order && (
          <p role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 font-semibold text-red-800">
            We could not find an order with those details. Check the order number and email and try again.
          </p>
        )}

        {order && (
          <section className="glass-strong mt-8 rounded-[2rem] p-6">
            <h2 className="text-2xl">Order {order.orderNumber}</h2>

            {order.status === 'cancelled' ? (
              <p className="mt-3 text-lg font-bold text-red-800">This order was cancelled.</p>
            ) : (
              <ol className="mt-4 grid gap-2 sm:grid-cols-4">
                {STEPS.map((s, i) => (
                  <li
                    key={s.value}
                    className={`rounded-lg border p-3 text-base font-semibold ${
                      i <= stepIndex
                        ? 'border-teal-700 bg-teal-50 text-teal-900'
                        : 'border-slate-300 bg-white/60 text-slate-600'
                    }`}
                  >
                    {s.label}
                  </li>
                ))}
              </ol>
            )}

            {order.trackingNote && (
              <p className="mt-4 whitespace-pre-line rounded-2xl bg-white/60 p-3 text-base">{order.trackingNote}</p>
            )}

            <h3 className="mt-6 text-lg">Items</h3>
            <ul className="mt-2 divide-y divide-slate-200 text-base">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-4 py-2">
                  <span>{i.name} x {i.quantity}</span>
                  <span className="font-semibold">{formatPrice(i.unitAmount * i.quantity, order.currency)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 text-base">
              <div className="flex justify-between"><dt>Delivery</dt><dd>{formatPrice(order.shippingCost, order.currency)}</dd></div>
              <div className="flex justify-between text-lg font-bold"><dt>Total</dt><dd>{formatPrice(order.total, order.currency)}</dd></div>
            </dl>
          </section>
        )}
      </div>
    </>
  );
}
