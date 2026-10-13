import Icon from '../Icon';

const ITEMS = [
  { icon: 'tag-price', title: 'Priced for everyday use', text: 'Clear prices in Naira. No hidden charges added at the last step.' },
  { icon: 'smartphone', title: 'Made for phones', text: 'Browse, filter and pay comfortably from a small screen.' },
  { icon: 'clipboard-check', title: 'Honest product info', text: 'Sizes, materials and stock levels are listed as they are.' },
  { icon: 'map-point', title: 'Track every order', text: 'Enter your order number and email to see where your order stands.' },
];

function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
}

export default function WhyFarf() {
  return (
    <section className="container-page py-12">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-teal">Why FARF</p>
        <h2 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">Simple shopping, done properly.</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((it) => (
          <div key={it.title} onMouseMove={spotlight} className="glow-card glass rounded-[2rem] p-8">
            <Icon name={it.icon} className="h-10 w-10 text-brand-orange" />
            <h3 className="mt-5 text-xl font-semibold">{it.title}</h3>
            <p className="mt-2 text-slate-700">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
