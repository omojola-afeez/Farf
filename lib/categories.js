// Class names are written out in full so Tailwind can find them.
export const categories = {
  utensils: {
    slug: 'utensils',
    title: 'Kitchen Utensils',
    short: 'Kitchen Utensils',
    blurb: 'Cookware, kitchen tools, storage and serving ware.',
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
    title: 'DIY & Gadgets',
    short: 'DIY & Gadgets',
    blurb: 'Hand tools, hardware, gadgets and accessories for fixing and making things.',
    accent: {
      solid: 'bg-sky-800 text-white',
      soft: 'bg-sky-50',
      text: 'text-sky-900',
      border: 'border-sky-200',
      chip: 'bg-sky-50 text-sky-900 border-sky-200',
    },
  },
  utilities: {
    slug: 'utilities',
    title: 'Home Utilities',
    short: 'Home Utilities',
    blurb: 'Bulbs, extension sockets, cleaning supplies and everyday household basics.',
    accent: {
      solid: 'bg-emerald-800 text-white',
      soft: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      chip: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
  },
  toys: {
    slug: 'toys',
    title: 'Educational Toys',
    short: 'Educational Toys',
    blurb: 'Puzzles, building sets, flashcards and learning games for children.',
    accent: {
      solid: 'bg-violet-700 text-white',
      soft: 'bg-violet-50',
      text: 'text-violet-900',
      border: 'border-violet-200',
      chip: 'bg-violet-50 text-violet-900 border-violet-200',
    },
  },
  other: {
    slug: 'other',
    title: 'Other',
    short: 'Other',
    blurb: 'More useful items that do not fit the other collections.',
    accent: {
      solid: 'bg-slate-700 text-white',
      soft: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
      chip: 'bg-slate-100 text-slate-800 border-slate-300',
    },
  },
};

export const categoryList = Object.values(categories);

export const occasions = {
  'new-term': 'School items',
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
