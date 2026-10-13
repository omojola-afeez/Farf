import Link from 'next/link';
import Icon from '../Icon';

export default function StoreBanner() {
  return (
    <section className="container-page py-8">
      <Link
        href="/shop"
        className="group relative flex items-center gap-4 overflow-hidden rounded-full sm:min-h-[150px] border border-white/40 p-3 pr-4 text-white shadow-2xl sm:gap-6 sm:p-4 sm:pr-6"
        style={{ background: 'linear-gradient(90deg, #2f8c87 0%, #2a817c 45%, #1c7569 100%)' }}
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E9F7F1] text-brand-teal-dark sm:h-20 sm:w-20">
          <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-10 sm:w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.1L20 8H6.2" />
            <circle cx="9" cy="19" r="1.4" />
            <circle cx="17" cy="19" r="1.4" />
          </svg>
        </span>
        <span className="relative z-10 text-xl leading-tight sm:text-4xl">
          <span className="block font-semibold">Home, school and DIY</span>
          <span className="block font-light text-white/85">in one store</span>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/banner-products.jpg"
          alt=""
          width={604}
          height={280}
          loading="lazy"
          className="pointer-events-none absolute right-24 top-1/2 hidden h-[92%] w-auto -translate-y-1/2 md:block"
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 25%, #000 82%, transparent 100%)',
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 25%, #000 82%, transparent 100%)',
          }}
        />
        <span className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF8F1] text-brand-teal-dark transition-transform group-hover:translate-x-1 sm:h-16 sm:w-16">
          <Icon name="arrow-right-linear" className="h-6 w-6 sm:h-8 sm:w-8" />
        </span>
      </Link>
    </section>
  );
}
