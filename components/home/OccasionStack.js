import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Icon from '../Icon';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const CARDS = [
  {
    href: '/shop?occasion=new-term',
    number: '01',
    title: 'School items',
    text: 'Bags, lunch boxes, stationery and accessories, gathered in one list so nothing gets missed on the first morning.',
    tone: 'glass-teal text-white',
    top: 'top-44 lg:top-32',
    muted: 'text-white',
  },
  {
    href: '/shop?occasion=new-apartment',
    number: '02',
    title: 'New apartment',
    text: 'Cookware, storage, cleaning basics and a few tools, so the first week in a new place is easier.',
    tone: 'bg-[#C2410C]/85 text-white border border-white/30 backdrop-blur-2xl shadow-2xl',
    top: 'top-48 lg:top-36',
    muted: 'text-white',
  },
  {
    href: '/shop?occasion=weekend-fix',
    number: '03',
    title: 'Weekend fix-it project',
    text: 'Hand tools, fixings and hardware for the job you have been putting off.',
    tone: 'glass-strong text-slate-900',
    top: 'top-52 lg:top-40',
    muted: 'text-slate-700',
  },
];

// Sticky stack. As the next card slides up, the earlier cards shrink a little and darken.
export default function OccasionStack() {
  const refs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const cards = refs.current;
      cards.forEach((card, i) => {
        if (!card || i === cards.length - 1) return;
        const nextTop = cards[i + 1].getBoundingClientRect().top;
        const q = clamp((vh * 0.75 - nextTop) / (vh * 0.5), 0, 1);
        const scale = 1 - (cards.length - 1 - i) * 0.04 * q;
        card.style.transform = `scale(${scale})`;
        card.style.filter = `brightness(${1 - 0.3 * q})`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="occasions" className="container-page py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-teal">Shop by occasion</p>
        <h2 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">Start with the moment, not the aisle.</h2>
      </div>

      <div className="space-y-10 pb-24">
        {CARDS.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            ref={(el) => (refs.current[i] = el)}
            className={`sticky ${c.top} block min-h-[300px] rounded-[2.5rem] p-8 will-change-transform md:p-12 ${c.tone}`}
          >
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-current font-heading font-medium">
                {c.number}
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight !text-current md:text-3xl">{c.title}</h3>
                <p className={`mt-4 max-w-xl text-lg font-light ${c.muted}`}>{c.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                  Shop this list <Icon name="arrow-right-linear" className="h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
