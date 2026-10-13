import { client, sanityConfigured } from './sanity';
import { sampleProducts } from './sampleData';
import { categories, ageRanges, occasions, sortOptions } from './categories';

import { PAGE_SIZE } from './dataConstants';

export { PAGE_SIZE };

const FIELDS = `
  _id,
  name,
  "slug": slug.current,
  category,
  price,
  description,
  details,
  inStock,
  stockCount,
  variants,
  ageRange,
  occasions,
  featured,
  "images": images[]{
    _key,
    alt,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
`;

// Next.js needs plain JSON (no undefined) in getServerSideProps.
const plain = (value) => JSON.parse(JSON.stringify(value ?? null));

const first = (v) => (Array.isArray(v) ? v[0] : v) || '';

function toNumber(v) {
  const n = parseFloat(first(v));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function parseFilters(query = {}, forcedCategory = null) {
  const requested = String(first(query.category));
  const category = forcedCategory || (categories[requested] ? requested : null);
  const sortRaw = String(first(query.sort));
  const age = String(first(query.age));
  const occasion = String(first(query.occasion));
  return {
    category,
    q: String(first(query.q)).trim().slice(0, 80),
    min: toNumber(query.min),
    max: toNumber(query.max),
    inStock: String(first(query.inStock)) === '1',
    age: ageRanges.includes(age) ? age : null,
    occasion: occasions[occasion] ? occasion : null,
    sort: sortOptions[sortRaw] ? sortRaw : 'featured',
    page: Math.max(1, parseInt(first(query.page), 10) || 1),
  };
}

const ORDER_BY = {
  featured: 'coalesce(featured, false) desc, _createdAt desc',
  'price-asc': 'price asc',
  'price-desc': 'price desc',
  name: 'lower(name) asc',
};

export async function getProducts(filters) {
  const start = (filters.page - 1) * PAGE_SIZE;

  if (!sanityConfigured) {
    let list = sampleProducts.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.min != null && p.price < filters.min) return false;
      if (filters.max != null && p.price > filters.max) return false;
      if (filters.inStock && !p.inStock) return false;
      if (filters.age && p.ageRange !== filters.age) return false;
      if (filters.occasion && !(p.occasions || []).includes(filters.occasion)) return false;
      if (filters.q) {
        const needle = filters.q.toLowerCase();
        const hay = `${p.name} ${p.description}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const sorters = {
      featured: (a, b) => Number(b.featured) - Number(a.featured),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    list = [...list].sort(sorters[filters.sort]);
    return plain({ products: list.slice(start, start + PAGE_SIZE), total: list.length });
  }

  const conds = ['_type == "product"', 'defined(slug.current)'];
  const params = {};
  if (filters.category) {
    conds.push('category == $category');
    params.category = filters.category;
  }
  if (filters.q) {
    conds.push('(name match $q || description match $q)');
    params.q = `${filters.q}*`;
  }
  if (filters.min != null) {
    conds.push('price >= $min');
    params.min = filters.min;
  }
  if (filters.max != null) {
    conds.push('price <= $max');
    params.max = filters.max;
  }
  if (filters.inStock) conds.push('inStock == true');
  if (filters.age) {
    conds.push('ageRange == $age');
    params.age = filters.age;
  }
  if (filters.occasion) {
    conds.push('$occasion in occasions');
    params.occasion = filters.occasion;
  }

  const where = conds.join(' && ');
  const query = `{
    "products": *[${where}] | order(${ORDER_BY[filters.sort]}) [${start}...${start + PAGE_SIZE}] {${FIELDS}},
    "total": count(*[${where}])
  }`;
  const result = await client.fetch(query, params);
  return plain(result);
}

export async function getFeatured(limit = 8) {
  if (!sanityConfigured) {
    const featured = sampleProducts.filter((p) => p.featured);
    return plain((featured.length ? featured : sampleProducts).slice(0, limit));
  }
  const result = await client.fetch(
    `*[_type == "product" && defined(slug.current) && featured == true && inStock == true] | order(_createdAt desc) [0...${limit}] {${FIELDS}}`
  );
  return plain(result);
}

// One cover photo per collection, taken from an in-stock product that has a photo.
// Returns { utensils: {name, image} | null, school: ..., diy: ... }.
export async function getCategoryCovers() {
  const slugs = Object.keys(categories);
  if (!sanityConfigured) return plain(Object.fromEntries(slugs.map((s) => [s, null])));
  const parts = slugs.map(
    (s) =>
      `"${s}": *[_type == "product" && category == "${s}" && inStock == true && count(images) > 0] | order(coalesce(featured, false) desc, _createdAt desc) [0]{
        name,
        "image": images[0]{ alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }
      }`
  );
  const result = await client.fetch(`{ ${parts.join(', ')} }`);
  return plain(result);
}

export async function getProductBySlug(slug) {
  if (!sanityConfigured) {
    return plain(sampleProducts.find((p) => p.slug === slug) || null);
  }
  const result = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{${FIELDS}}`,
    { slug }
  );
  return plain(result);
}

export async function getProductsByIds(ids) {
  if (!ids.length) return [];
  if (!sanityConfigured) {
    return plain(sampleProducts.filter((p) => ids.includes(p._id)));
  }
  const result = await client.fetch(`*[_type == "product" && _id in $ids]{${FIELDS}}`, { ids });
  return plain(result);
}

export async function getRelated(product, limit = 4) {
  if (!sanityConfigured) {
    return plain(
      sampleProducts
        .filter((p) => p.category === product.category && p._id !== product._id)
        .slice(0, limit)
    );
  }
  const result = await client.fetch(
    `*[_type == "product" && category == $category && _id != $id && defined(slug.current)] | order(_createdAt desc) [0...${limit}] {${FIELDS}}`,
    { category: product.category, id: product._id }
  );
  return plain(result);
}
