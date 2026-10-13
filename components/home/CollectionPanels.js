import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import ProductImage from '../ProductImage';

const PANELS = [
  {
    slug: 'utensils',
    icon: 'chef-hat',
    title: 'Home and kitchen',
    text: 'Cookware, utensils, storage and everyday kitchen tools.',
    tone: 'bg-teal-700/80',
  },
  {
    slug: 'school',
    icon: 'backpack',
    title: 'School supplies',
    text: 'Bags, lunch boxes, stationery and accessories for every term.',
    tone: 'bg-orange-700/80',
  },
  {
    slug: 'diy',
    icon: 'toolbox',
    title: 'DIY and tools',
    text: 'Hand tools, fixings and hardware for repairs and projects.',
    tone: 'bg-slate-800/80',
  },
];

// Accordion on large screens (hover, focus or click opens a panel, autoplay every 3.5s).
// Stacked cards below lg, where every panel shows its text.
export default function CollectionPanels({ covers = {} }) {
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
        className="flex flex-col gap-4 lg:h-[460px] lg:flex-row"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
      >
        {PANELS.map((p, i) => {
          const cover = covers[p.slug];
          return (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`panel group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/30 p-8 text-white shadow-xl backdrop-blur-2xl ${p.tone} ${
                active === i ? 'active' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <Icon name={p.icon} className="h-12 w-12 text-[#FFF8F1]" />
                {cover?.image?.url && (
                  <div className="cover glass w-28 rotate-3 animate-float rounded-2xl p-2 sm:w-36">
                    <div className="overflow-hidden rounded-xl">
                      <ProductImage
                        image={cover.image}
                        name={cover.name}
                        category={p.slug}
                        ratio={cover.image.width && cover.image.height ? Math.min(Math.max(cover.image.width / cover.image.height, 0.75), 1.4) : 1}
                        width={400}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold !text-white">{p.title}</h3>
                <div className="panel-desc">
                  <p className="mt-3 max-w-sm text-lg font-light text-white/85">{p.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold">
                    Shop now <Icon name="arrow-right-linear" className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
