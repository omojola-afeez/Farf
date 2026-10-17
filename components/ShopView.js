import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ageRanges, categories, categoryList, occasions, sortOptions } from '@/lib/categories';
import { PAGE_SIZE } from '@/lib/dataConstants';
import PageHead from './PageHead';
import ProductCard from './ProductCard';

function buildQuery(filters, overrides = {}, omit = []) {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (omit.includes(key)) return;
    if (value === null || value === undefined || value === '' || value === false) return;
    if (key === 'sort' && value === 'featured') return;
    if (key === 'page' && value === 1) return;
    params.set(key, value === true ? '1' : String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export default function ShopView({ products, total, filters, basePath, title, intro, lockedCategory }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showAge = !filters.category || filters.category === 'school';
  const omit = lockedCategory ? ['category'] : [];
  const category = filters.category ? categories[filters.category] : null;
  const panel = useRef(null);

  // The panel renders closed so phones show products first with no layout shift. Desktop shows it open through CSS, and this opens it as a fallback.
  useEffect(() => {
    if (panel.current && window.matchMedia('(min-width: 1024px)').matches) {
      panel.current.open = true;
    }
  }, []);

  return (
    <>
      <PageHead title={title} description={intro} />
      <section className="container-page pt-8">
        <div className={`glass-strong rounded-[2rem] border-l-8 p-6 sm:p-8 ${category ? category.accent.border : 'border-orange-200'}`}>
          <h1 className="text-3xl">{title}</h1>
          {intro && <p className="mt-2 max-w-2xl text-lg text-slate-700">{intro}</p>}
        </div>
      </section>

      <div className="container-page grid grid-cols-1 gap-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <details ref={panel} className="glass filter-panel rounded-[1.75rem]">
            <summary className="flex min-h-[48px] cursor-pointer items-center px-4 text-base font-bold lg:pointer-events-none">
              Filters
            </summary>
            <form method="get" action={basePath} className="space-y-4 border-t border-white/60 p-4">
              <div>
                <label htmlFor="f-q" className="label">Search</label>
                <input id="f-q" name="q" type="search" defaultValue={filters.q} className="input" />
              </div>

              {!lockedCategory && (
                <div>
                  <label htmlFor="f-category" className="label">Collection</label>
                  <select id="f-category" name="category" defaultValue={filters.category || ''} className="input">
                    <option value="">All collections</option>
                    {categoryList.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="f-min" className="label">Min price</label>
                  <input id="f-min" name="min" type="number" min="0" step="any" inputMode="decimal" defaultValue={filters.min ?? ''} className="input" />
                </div>
                <div>
                  <label htmlFor="f-max" className="label">Max price</label>
                  <input id="f-max" name="max" type="number" min="0" step="any" inputMode="decimal" defaultValue={filters.max ?? ''} className="input" />
                </div>
              </div>

              {showAge && (
                <div>
                  <label htmlFor="f-age" className="label">Age range (school items)</label>
                  <select id="f-age" name="age" defaultValue={filters.age || ''} className="input">
                    <option value="">Any age</option>
                    {ageRanges.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="f-occasion" className="label">Occasion</label>
                <select id="f-occasion" name="occasion" defaultValue={filters.occasion || ''} className="input">
                  <option value="">Any occasion</option>
                  {Object.entries(occasions).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input id="f-stock" name="inStock" type="checkbox" value="1" defaultChecked={filters.inStock} className="h-5 w-5 accent-teal-700" />
                <label htmlFor="f-stock" className="text-base font-semibold">In stock only</label>
              </div>

              <div>
                <label htmlFor="f-sort" className="label">Sort by</label>
                <select id="f-sort" name="sort" defaultValue={filters.sort} className="input">
                  {Object.entries(sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Apply</button>
                <Link href={basePath} className="btn-secondary flex-1">Clear</Link>
              </div>
            </form>
          </details>
        </aside>

        <div>
          <p className="mb-4 text-base text-slate-700" aria-live="polite">
            {total} {total === 1 ? 'product' : 'products'}
          </p>

          {products.length === 0 ? (
            <div className="glass rounded-[2rem] p-8 text-center">
              <p className="text-lg font-semibold">No products match those filters.</p>
              <Link href={basePath} className="btn-primary mt-4">Clear filters</Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {products.map((p) => (
                <li key={p._id}>
                  <ProductCard product={p} as="h2" />
                </li>
              ))}
            </ul>
          )}

          {pages > 1 && (
            <nav className="mt-8 flex items-center justify-between" aria-label="Pagination">
              {filters.page > 1 ? (
                <Link href={`${basePath}${buildQuery(filters, { page: filters.page - 1 }, omit)}`} className="btn-secondary">
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-base font-semibold">Page {filters.page} of {pages}</span>
              {filters.page < pages ? (
                <Link href={`${basePath}${buildQuery(filters, { page: filters.page + 1 }, omit)}`} className="btn-secondary">
                  Next
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
