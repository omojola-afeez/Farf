import Link from 'next/link';

// Bag mark (public/images/logo-mark.png) with the store name set as live text.
export default function Logo({ className = '', light = false }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="FARF home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-mark.png" alt="" width={40} height={43} className="h-10 w-auto drop-shadow-sm" />
      <span className={`text-2xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-brand-teal-dark'}`}>FARF</span>
    </Link>
  );
}
