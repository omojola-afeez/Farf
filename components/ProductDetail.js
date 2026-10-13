import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { categories } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import { siteConfig } from '@/lib/siteConfig';
import ProductImage from './ProductImage';

export default function ProductDetail({ product }) {
  const { addItem } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });

  const category = categories[product.category];
  const images = product.images || [];
  const current = images[imageIndex];
  const ratio = current?.width && current?.height ? current.width / current.height : 1;
  const variants = product.variants || [];
  const maxQty = product.stockCount != null ? Math.max(1, product.stockCount) : 99;

  function onAdd() {
    const missing = variants.find((v) => !selected[v.name]);
    if (missing) {
      setMessage({ type: 'error', text: `Choose a ${missing.name.toLowerCase()} first.` });
      return;
    }
    addItem({ product, variants: selected, quantity });
    setMessage({ type: 'ok', text: 'Added to your cart.' });
  }

  return (
    <div className="container-page grid gap-8 py-8 md:grid-cols-2">
      <div>
        <div className="glass overflow-hidden rounded-[2rem]">
          <ProductImage
            image={current}
            name={product.name}
            category={product.category}
            ratio={ratio}
            width={1000}
            maxHeight="75vh"
          />
        </div>
        {images.length > 1 && (
          <ul className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <li key={img._key || i}>
                <button
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === imageIndex}
                  className={`block h-16 w-16 overflow-hidden rounded-lg border-2 bg-white ${
                    i === imageIndex ? 'border-brand-teal' : 'border-slate-200'
                  }`}
                >
                  <img src={`${img.url}?w=160&auto=format`} alt="" className="h-full w-full object-contain" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass-strong h-fit rounded-[2rem] p-6 sm:p-8">
        {category && (
          <Link
            href={`/shop/${category.slug}`}
            className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${category.accent.chip}`}
          >
            {category.title}
          </Link>
        )}
        <h1 className="mt-3 text-3xl">{product.name}</h1>
        <p className="mt-3 text-3xl font-extrabold text-slate-900">{formatPrice(product.price)}</p>
        {product.description && <p className="mt-4 text-lg text-slate-700">{product.description}</p>}

        {product.inStock ? (
          <>
            {variants.map((v) => (
              <div key={v.name} className="mt-5">
                <label htmlFor={`variant-${v.name}`} className="label">{v.name}</label>
                <select
                  id={`variant-${v.name}`}
                  className="input"
                  value={selected[v.name] || ''}
                  onChange={(e) => {
                    setSelected((s) => ({ ...s, [v.name]: e.target.value }));
                    setMessage({ type: '', text: '' });
                  }}
                >
                  <option value="">Select {v.name.toLowerCase()}</option>
                  {v.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}

            <div className="mt-5 flex items-end gap-3">
              <div className="w-28">
                <label htmlFor="qty" className="label">Quantity</label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max={maxQty}
                  value={quantity}
                  inputMode="numeric"
                  className="input"
                  onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                />
              </div>
              <button type="button" onClick={onAdd} className="btn-primary flex-1">
                Add to cart
              </button>
            </div>

            {message.text && (
              <p
                role="status"
                className={`mt-3 text-base font-semibold ${message.type === 'error' ? 'text-red-700' : 'text-brand-teal-dark'}`}
              >
                {message.text}{' '}
                {message.type === 'ok' && (
                  <Link href="/cart" className="underline">View cart</Link>
                )}
              </p>
            )}

            <div className="mt-6 rounded-2xl border border-teal-300/60 bg-teal-50/70 p-4">
              <p className="text-base font-bold text-teal-900">In stock</p>
              <ul className="mt-2 space-y-1 text-base text-slate-800">
                {product.stockCount != null && product.stockCount <= 10 && (
                  <li>Only {product.stockCount} left.</li>
                )}
                <li>Delivery in {siteConfig.deliveryWindow}.</li>
                <li>
                  {siteConfig.freeShippingThreshold > 0
                    ? `Free delivery on orders over ${formatPrice(siteConfig.freeShippingThreshold)}.`
                    : 'Free delivery.'}
                </li>
                <li>Returns accepted within {siteConfig.returnWindowDays} days.</li>
              </ul>
            </div>
          </>
        ) : (
          <p className="mt-6 rounded-2xl border border-slate-300/70 bg-white/60 p-4 text-base font-bold">
            Currently out of stock.
          </p>
        )}

        {product.details?.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl">Product details</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-slate-800">
              {product.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
