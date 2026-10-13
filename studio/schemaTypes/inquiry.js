import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'inquiry',
  title: 'Customer inquiry',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'message', type: 'text', readOnly: true }),
    defineField({ name: 'createdAt', type: 'datetime', readOnly: true }),
    defineField({ name: 'handled', title: 'Handled', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'name', subtitle: 'email' } },
});
