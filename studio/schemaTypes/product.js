import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Collection',
      type: 'string',
      options: {
        list: [
          { title: 'Kitchen Utensils', value: 'utensils' },
          { title: 'Back to School', value: 'school' },
          { title: 'DIY & Gadgets', value: 'diy' },
          { title: 'Home Utilities', value: 'utilities' },
          { title: 'Educational Toys', value: 'toys' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      description: 'In Naira, for example 12500',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      description: 'Use real product photos. The first photo is the main one.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: false },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),
    defineField({ name: 'description', title: 'Short description', type: 'text', rows: 3 }),
    defineField({
      name: 'details',
      title: 'Product details',
      description: 'One bullet per line item. Only list facts that are true for this product.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'inStock',
      title: 'In stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stockCount',
      title: 'Units available',
      description: 'Optional. When set, customers cannot order more than this.',
      type: 'number',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      description: 'Only add options that really exist, for example Size: Small, Medium, Large.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variantGroup',
          fields: [
            defineField({ name: 'name', title: 'Option name', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'options',
              title: 'Choices',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'options' } },
        }),
      ],
    }),
    defineField({
      name: 'ageRange',
      title: 'Age range',
      description: 'Back to School items only.',
      type: 'string',
      options: {
        list: [
          { title: '3 to 5', value: '3-5' },
          { title: '6 to 8', value: '6-8' },
          { title: '9 to 12', value: '9-12' },
          { title: '13 and up', value: '13+' },
        ],
      },
    }),
    defineField({
      name: 'occasions',
      title: 'Shop by occasion',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'School items', value: 'new-term' },
          { title: 'New apartment', value: 'new-apartment' },
          { title: 'Weekend fix-it project', value: 'weekend-fix' },
        ],
      },
    }),
    defineField({ name: 'sku', title: 'SKU', type: 'string' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'images.0' },
  },
});
