import Link from 'next/link';
import PageHead from '@/components/PageHead';
import ProductCard from '@/components/ProductCard';
import Carousel from '@/components/Carousel';
import Newsletter from '@/components/Newsletter';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import ScrubText from '@/components/home/ScrubText';
import OccasionStack from '@/components/home/OccasionStack';
import CollectionPanels from '@/components/home/CollectionPanels';
import WhyFarf from '@/components/home/WhyFarf';
import FaqTabs from '@/components/home/FaqTabs';
import StoreBanner from '@/components/home/StoreBanner';
import { getFeatured } from '@/lib/data';

export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  const featured = await getFeatured(8);
  return { props: { featured } };
}

export default function Home({ featured }) {
  return (
    <>
      <PageHead />
      <Hero featured={featured} />
      <Marquee />
      <ScrubText
        label="What we sell"
        text="Good homes run on small things done well. A pan that heats evenly, a bag that lasts the term, a screwdriver that is where you left it."
      />
      <OccasionStack />
      <CollectionPanels />

      {featured.length > 0 && (
        <section className="container-page py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold sm:text-4xl">Featured products</h2>
            <Link href="/shop" className="text-base font-semibold text-brand-teal-dark underline">
              View all
            </Link>
          </div>
          <Carousel label="Featured products">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </Carousel>
        </section>
      )}

      <WhyFarf />
      <FaqTabs />
      <StoreBanner />
      <Newsletter />
    </>
  );
}
