import { Children, useRef } from 'react';

// Swipe and button driven. There is no auto-scrolling and no CSS keyframe animation,
// which keeps it reliable on mobile Safari. It uses native scroll snapping.
export default function Carousel({ children, label }) {
  const ref = useRef(null);

  const scrollByPage = (direction) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {Children.map(children, (child) => (
          <div className="w-[68%] shrink-0 snap-start sm:w-[38%] lg:w-[23.5%]">{child}</div>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          className="btn-secondary h-11 w-11 !px-0"
          aria-label="Previous products"
        >
          &#8249;
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          className="btn-secondary h-11 w-11 !px-0"
          aria-label="Next products"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
