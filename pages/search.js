import ShopView from '@/components/ShopView';
import { getProducts, parseFilters } from '@/lib/data';

export async function getServerSideProps({ query }) {
  const filters = parseFilters(query);
  const { products, total } = await getProducts(filters);
  return { props: { products, total, filters } };
}

export default function Search({ products, total, filters }) {
  return (
    <ShopView
      products={products}
      total={total}
      filters={filters}
      basePath="/search"
      title={filters.q ? `Search results for "${filters.q}"` : 'Search'}
      intro="Search across household, school and DIY products."
      lockedCategory={null}
    />
  );
}
