import Link from 'next/link';
import Icon from '../Icon';

// Compact version of the banner. Sits above the hero headline.
export default function StoreBanner() {
  return (
    <Link
      href="/shop"
      className="group inline-flex max-w-full items-center gap-2 sm:gap-3 rounded-full border border-white/40 py-1.5 pl-1.5 pr-1.5 text-white shadow-lg"
      style={{ background: 'linear-gradient(90deg, #2f8c87 0%, #2a817c 45%, #1c7569 100%)' }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E9F7F1] text-brand-teal-dark">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.1L20 8H6.2" />
          <circle cx="9" cy="19" r="1.4" />
          <circle cx="17" cy="19" r="1.4" />
        </svg>
      </span>
      <span className="min-w-0 text-xs font-medium leading-tight tracking-wide min-[380px]:whitespace-nowrap sm:text-sm">Home, school and DIY in one store</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF8F1] text-brand-teal-dark transition-transform group-hover:translate-x-0.5">
        <Icon name="arrow-right-linear" className="h-4 w-4" />
      </span>
    </Link>
  );
}
