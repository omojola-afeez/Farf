// Class names are written out in full so Tailwind can find them.
export const categories = {
  utensils: {
    slug: 'utensils',
    title: 'Household Utensils',
    short: 'Utensils',
    blurb: 'Kitchen tools, cookware, storage and cleaning essentials.',
    accent: {
      solid: 'bg-teal-700 text-white',
      soft: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      chip: 'bg-teal-50 text-teal-800 border-teal-200',
    },
  },
  school: {
    slug: 'school',
    title: 'Back to School',
    short: 'Back to School',
    blurb: 'Bags, stationery, lunch boxes, uniforms and accessories.',
    accent: {
      solid: 'bg-orange-700 text-white',
      soft: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      chip: 'bg-orange-50 text-orange-800 border-orange-200',
    },
  },
  diy: {
    slug: 'diy',
    title: 'DIY & Home Equipment',
    short: 'DIY',
    blurb: 'Tools, hardware, fixtures and home-improvement basics.',
    accent: {
      solid: 'bg-sky-800 text-white',
      soft: 'bg-sky-50',
      text: 'text-sky-900',
      border: 'border-sky-200',
      chip: 'bg-sky-50 text-sky-900 border-sky-200',
    },
  },
};

export const categoryList = Object.values(categories);

export const occasions = {
  'new-term': 'New school term',
  'new-apartment': 'New apartment',
  'weekend-fix': 'Weekend fix-it project',
};

export const ageRanges = ['3-5', '6-8', '9-12', '13+'];

export const sortOptions = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name: A to Z',
};
