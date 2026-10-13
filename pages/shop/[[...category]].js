import ShopView from '@/components/ShopView';
import { getProducts, parseFilters } from '@/lib/data';
import { categories } from '@/lib/categories';

// Filtering runs on the server so the first HTML response, crawlers and no-JS browsers all see filtered results.
export async function getServerSideProps({ params, query, res }) {
  const segments = params.category || [];
  const slug = segments[0] || null;
  if (segments.length > 1 || (slug && !categories[slug])) return { notFound: true };

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  const filters = parseFilters(query, slug);
  const { products, total } = await getProducts(filters);
  return { props: { products, total, filters, lockedCategory: slug } };
}

export default function Shop({ products, total, filters, lockedCategory }) {
  const category = filters.category ? categories[filters.category] : null;
  const basePath = lockedCategory ? `/shop/${lockedCategory}` : '/shop';
  return (
    <ShopView
      products={products}
      total={total}
      filters={filters}
      basePath={basePath}
      title={category ? category.title : 'All products'}
      intro={category ? category.blurb : 'Browse kitchen, school and DIY essentials.'}
      lockedCategory={lockedCategory}
    />
  );
}
