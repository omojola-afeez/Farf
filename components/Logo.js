import Link from 'next/link';

// Text-only logo. Replace with an image when a real logo is ready.
export default function Logo({ className = '' }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="FARF home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange text-lg font-extrabold text-slate-900">
        F
      </span>
      <span className="text-2xl font-extrabold tracking-tight text-brand-teal-dark">FARF</span>
    </Link>
  );
}
