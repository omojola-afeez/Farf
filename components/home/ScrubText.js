import { useEffect, useRef } from 'react';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Words fade from 20% to full opacity as the paragraph scrolls through the screen.
export default function ScrubText({ text, label }) {
  const ref = useRef(null);
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const spans = el.querySelectorAll('[data-w]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = clamp((vh * 0.85 - r.top) / (vh * 0.4 + r.height), 0, 1);
      const n = spans.length;
      spans.forEach((span, i) => {
        const local = clamp((progress * (n + 4) - i) / 4, 0, 1);
        span.style.opacity = String(0.2 + 0.8 * local);
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
  }, [text]);

  return (
    <section className="container-page py-24 sm:py-32">
      <div className="glass rounded-[2.5rem] p-8 sm:p-14">
        {label && <p className="text-sm font-medium uppercase tracking-widest text-brand-teal">{label}</p>}
        <p ref={ref} className="mt-5 font-heading text-3xl font-semibold leading-[1.2] tracking-tight sm:text-5xl">
          {words.map((w, i) => (
            <span key={i} data-w>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
