import Link from 'next/link';
import { categories } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import ProductImage from './ProductImage';

export default function ProductCard({ product, as: Heading = 'h3' }) {
  const category = categories[product.category];
  return (
    <Link
      href={`/product/${product.slug}`}
      className="glass group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative border-b border-white/60">
        <ProductImage image={product.images?.[0]} name={product.name} category={product.category} ratio={1} />
        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded bg-slate-900 px-2 py-1 text-xs font-bold text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {category && (
          <span className={`w-fit rounded-full border px-2 py-0.5 text-xs font-semibold ${category.accent.chip}`}>
            {category.short}
          </span>
        )}
        <Heading className="text-base font-semibold leading-snug text-slate-900 group-hover:text-brand-teal-dark">
          {product.name}
        </Heading>
        <p className="mt-auto text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
