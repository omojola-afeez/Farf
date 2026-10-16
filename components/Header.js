import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { categoryList } from '@/lib/categories';
import { formatPrice } from '@/lib/format';
import { siteConfig } from '@/lib/siteConfig';
import Logo from './Logo';

function SearchForm({ className = '' }) {
  return (
    <form action="/search" method="get" role="search" className={`flex gap-2 ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        placeholder="Search products"
        className="input"
        autoComplete="off"
      />
      <button type="submit" className="btn-teal px-4" aria-label="Search">
        Search
      </button>
    </form>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { count, ready } = useCart();

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  const navLinks = [
    { href: '/', label: 'Home' },
    ...categoryList.map((c) => ({ href: `/shop/${c.slug}`, label: c.short })),
    { href: '/shop', label: 'All products' },
    { href: '/track', label: 'Track order' },
  ];

  return (
    <header className="glass-strong sticky top-0 z-40 !rounded-none !border-x-0 !border-t-0">
      <div className="bg-brand-teal-dark/90 px-4 py-2 text-center text-sm font-medium text-white">
        Delivery fee is agreed on WhatsApp
      </div>

      <div className="container-page flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-3 xl:flex" aria-label="Main">
          {navLinks.filter((l) => l.href !== '/track').map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap px-1 text-sm font-semibold text-slate-800 hover:text-brand-teal">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
                    <Link
            href="/cart"
            className="relative flex h-11 items-center gap-2 rounded-lg px-3 font-semibold text-slate-900 hover:bg-slate-100"
            aria-label={`Cart${ready ? `, ${count} items` : ''}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.5L21 7H6" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {ready && count > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-brand-orange-dark px-1.5 text-sm font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="container-page pb-3">
        <SearchForm />
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-white/70 xl:hidden" aria-label="Mobile">
          <ul className="container-page py-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex min-h-[48px] items-center border-b border-slate-100 text-lg font-semibold text-slate-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="flex min-h-[48px] items-center text-lg font-semibold text-slate-900">
                Contact us
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
