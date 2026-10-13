import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';

const PANELS = [
  {
    slug: 'utensils',
    title: 'Home and kitchen',
    text: 'Cookware, utensils, storage and everyday kitchen tools.',
    image: '/images/panel-kitchen.jpg',
    alt: 'A teal pot, ceramic bowls and wooden spoons on a kitchen counter',
    tint: 'from-teal-900/90 via-teal-900/25 to-transparent',
    width: 509,
  },
  {
    slug: 'school',
    title: 'School supplies',
    text: 'Bags, lunch boxes, stationery and accessories for every term.',
    image: '/images/panel-school.jpg',
    alt: 'Notebooks, pencils, scissors and a ruler on an orange background',
    tint: 'from-orange-800/90 via-orange-800/25 to-transparent',
    width: 507,
  },
  {
    slug: 'diy',
    title: 'DIY and tools',
    text: 'Hand tools, fixings and hardware for repairs and projects.',
    image: '/images/panel-diy.jpg',
    alt: 'A hammer, pliers, screwdriver and tape measure on a wooden workbench',
    tint: 'from-slate-900/90 via-slate-900/30 to-transparent',
    width: 510,
  },
];

// Accordion on large screens (hover, focus or click opens a panel, autoplay every 3.5s).
// Stacked cards below lg, where every panel shows its text.
export default function CollectionPanels() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => {
      if (paused.current) return;
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      setActive((a) => (a + 1) % PANELS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container-page py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-teal">Collections</p>
        <h2 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">Three aisles, one basket.</h2>
      </div>

      <div
        className="flex flex-col gap-4 lg:h-[480px] lg:flex-row"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
      >
        {PANELS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/shop/${p.slug}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`panel group relative block min-h-[340px] overflow-hidden rounded-[2.5rem] border border-white/40 text-white shadow-xl lg:min-h-0 ${
              active === i ? 'active' : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.alt}
              width={p.width}
              height={1024}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${p.tint}`} />
            <div className="relative z-10 flex h-full min-h-[340px] flex-col justify-end p-8 lg:min-h-0">
              <h3 className="text-2xl font-semibold !text-white md:text-3xl">{p.title}</h3>
              <div className="panel-desc">
                <p className="mt-3 max-w-sm text-lg font-light text-white/90">{p.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-semibold">
                  Shop now <Icon name="arrow-right-linear" className="h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
