const ITEMS = [
  { image: '/images/why-price.jpg', alt: 'A price tag showing the Naira sign', title: 'Priced for everyday use', text: 'Clear prices in Naira. No hidden charges added at the last step.' },
  { image: '/images/why-phone.jpg', alt: 'A phone showing a shopping cart', title: 'Made for phones', text: 'Browse, filter and pay comfortably from a small screen.' },
  { image: '/images/why-box.jpg', alt: 'A parcel marked with a shopping cart', title: 'Honest product info', text: 'Sizes, materials and stock levels are listed as they are.' },
  { image: '/images/why-track.jpg', alt: 'A parcel marked with a location pin', title: 'Track every order', text: 'Enter your order number and email to see where your order stands.' },
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ITEMS.map((it) => (
          <div key={it.title} onMouseMove={spotlight} className="glow-card glass flex items-center gap-5 rounded-[2rem] p-4 sm:p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.image}
              alt={it.alt}
              width={220}
              height={206}
              loading="lazy"
              className="h-28 w-28 shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36"
            />
            <div>
              <h3 className="text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-slate-700">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
