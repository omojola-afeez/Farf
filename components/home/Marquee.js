import { siteConfig } from '@/lib/siteConfig';
import { formatPrice } from '@/lib/format';
import Icon from '../Icon';

// Two identical blocks, so the -50% loop is seamless. Timing is a fixed 25s linear.
export default function Marquee() {
  const items = [
    { icon: 'delivery', text: 'Delivery fee agreed on WhatsApp' },
    { icon: 'restart', text: 'Easy returns' },
    { icon: 'shield-check', text: 'Secure checkout' },
    { icon: 'map-point', text: 'Order tracking' },
  ];
  const block = (hidden) => (
    <div
      className="flex shrink-0 items-center gap-14 pr-14 text-sm font-medium uppercase tracking-widest text-[#FFF8F1]"
      aria-hidden={hidden || undefined}
    >
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center gap-3 whitespace-nowrap">
          <Icon name={item.icon} className="h-6 w-6" />
          {item.text}
        </span>
      ))}
    </div>
  );

  return (
    <section className="container-page mt-8" aria-label="Store promises">
      <div className="glass-teal overflow-hidden rounded-full py-4">
        <div className="animate-marquee flex w-max">
          {block(false)}
          {block(true)}
        </div>
      </div>
    </section>
  );
}
