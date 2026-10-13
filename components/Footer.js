import Link from 'next/link';
import { categoryList } from '@/lib/categories';
import { siteConfig } from '@/lib/siteConfig';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="glass-dark relative mt-16 overflow-hidden !rounded-none !border-x-0 !border-b-0 text-slate-200">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-3 text-sm text-slate-300">{siteConfig.tagline}.</p>
        </div>
        <div>
          <h2 className="mb-3 text-base font-bold text-white">Shop</h2>
          <ul className="space-y-2 text-sm">
            {categoryList.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="hover:underline">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="hover:underline">
                All products
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-base font-bold text-white">Help</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/track" className="hover:underline">Track your order</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms and returns</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact us</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-base font-bold text-white">Company</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">About FARF</Link></li>
            <li>
              <a href={`mailto:${siteConfig.supportEmail}`} className="hover:underline">
                {siteConfig.supportEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 py-4 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} FARF. All rights reserved.
      </div>
      <div className="watermark -mb-3 text-center font-extrabold" aria-hidden="true">
        FARF
      </div>
    </footer>
  );
}
