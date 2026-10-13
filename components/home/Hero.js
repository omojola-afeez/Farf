import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { formatPrice } from '@/lib/format';
import ProductImage from '../ProductImage';

// Three floating slots. A slot shows a real product photo when one exists,
// and a plain collection tile when it does not.
const SLOTS = [
  { pos: 'left-0 top-0 w-64', anim: 'animate-float', depth: 16 },
  { pos: 'right-0 top-32 w-60', anim: 'animate-float-slow', depth: 26 },
  { pos: 'left-0 bottom-0 w-52', anim: 'animate-float', depth: 10 },
];

const FALLBACK = [
  { image: '/images/hero-kitchen.jpg', ratio: 388 / 157, href: '/shop/utensils', label: 'Kitchen', sub: 'Utensils and storage', tone: 'bg-white/20 text-white' },
  { image: '/images/hero-school.jpg', ratio: 353 / 195, href: '/shop/school', label: 'School', sub: 'Bags and stationery', tone: 'bg-[#FFF8F1]/95 text-slate-900' },
  { image: '/images/hero-diy.jpg', ratio: 359 / 158, href: '/shop/diy', label: 'DIY', sub: 'Tools and hardware', tone: 'bg-teal-900/60 text-white' },
];

function PhotoFloater({ product }) {
  const image = product.images[0];
  const ratio = image.width && image.height ? image.width / image.height : 1;
  return (
    <Link href={`/product/${product.slug}`} className="glass block rounded-[2rem] p-3 shadow-2xl">
      <div className="overflow-hidden rounded-[1.4rem]">
        <ProductImage image={image} name={product.name} category={product.category} ratio={Math.min(Math.max(ratio, 0.75), 1.4)} width={600} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 px-1 pb-1">
        <span className="truncate text-sm font-semibold text-slate-900">{product.name}</span>
        <span className="shrink-0 rounded-full bg-[#C2410C] px-2.5 py-1 text-xs font-bold text-white">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}

function TileFloater({ tile }) {
  return (
    <Link href={tile.href} className={`block rounded-[2rem] border border-white/30 p-3 shadow-xl backdrop-blur-xl ${tile.tone}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.image}
        alt={`${tile.label}: ${tile.sub}`}
        width={400}
        height={Math.round(400 / tile.ratio)}
        className="w-full rounded-[1.4rem] object-cover"
        style={{ aspectRatio: tile.ratio }}
      />
      <p className="mt-3 px-2 font-heading text-xl font-semibold">{tile.label}</p>
      <p className="px-2 pb-2 text-sm opacity-80">{tile.sub}</p>
    </Link>
  );
}

export default function Hero({ featured }) {
  const root = useRef(null);
  const photos = featured.filter((p) => p.images?.[0]?.url).slice(0, 3);

  // Gentle mouse parallax on the floating cards (desktop only, skipped for reduced motion).
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (!window.matchMedia('(hover: hover)').matches) return undefined;
    const layers = el.querySelectorAll('[data-depth]');
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((layer) => {
        const d = Number(layer.dataset.depth);
        layer.style.transform = `translate3d(${x * d * -1}px, ${y * d * -1}px, 0)`;
      });
    };
    const onLeave = () => layers.forEach((l) => (l.style.transform = 'translate3d(0,0,0)'));
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section id="home" className="container-page pt-6 sm:pt-10">
      <div ref={root} className="glass-teal relative rounded-[2.5rem] p-6 text-white sm:p-10 lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="animate-glow inline-flex items-center gap-2 rounded-full border border-[#F26B1D]/60 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#F26B1D]" />
              Home, school and DIY in one store
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl">
              Everything your{' '}
              <span className="bg-gradient-to-r from-[#F26B1D] to-[#FFF8F1] bg-clip-text text-transparent">household</span>{' '}
              needs, in one place.
            </h1>

            <p className="mt-5 max-w-xl text-lg font-light text-white/85">
              Kitchen tools, school supplies and home-improvement basics, priced in Naira and delivered across Nigeria.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-primary">
                Shop all products
              </Link>
              <Link href="#occasions" className="btn border-2 border-white/50 text-white hover:bg-white/15">
                Shop by occasion
              </Link>
            </div>
          </div>

          <div className="relative hidden h-[500px] lg:block">
            {SLOTS.map((slot, i) => (
              <div key={i} className={`absolute ${slot.pos}`} data-depth={slot.depth} style={{ transition: 'transform 0.3s ease-out' }}>
                <div className={slot.anim} style={{ animationDelay: `${i * 0.8}s` }}>
                  {photos[i] ? <PhotoFloater product={photos[i]} /> : <TileFloater tile={FALLBACK[i]} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* On phones the floating cards become a simple row below the copy. */}
        <div className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
          {[0, 1, 2].map((i) =>
            photos[i] ? (
              <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.6}s` }}>
                <PhotoFloater product={photos[i]} />
              </div>
            ) : (
              <Link key={i} href={FALLBACK[i].href} className="block rounded-2xl border border-white/30 bg-white/15 p-1.5 text-center backdrop-blur-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={FALLBACK[i].image} alt="" width={200} height={110} className="aspect-[4/3] w-full rounded-xl object-cover" />
                <p className="my-1.5 text-sm font-semibold">{FALLBACK[i].label}</p>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
