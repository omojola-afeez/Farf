import PageHead from '@/components/PageHead';
import ProductDetail from '@/components/ProductDetail';
import ProductCard from '@/components/ProductCard';
import { getProductBySlug, getRelated } from '@/lib/data';

export async function getServerSideProps({ params, res }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { notFound: true };
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  const related = await getRelated(product, 4);
  return { props: { product, related } };
}

export default function ProductPage({ product, related }) {
  return (
    <>
      <PageHead title={product.name} description={product.description} />
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="container-page pb-4">
          <h2 className="text-2xl">More from this collection</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((p) => (
              <li key={p._id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
