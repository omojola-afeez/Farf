import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'subscriber',
  title: 'Newsletter subscriber',
  type: 'document',
  fields: [
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'subscribedAt', type: 'datetime', readOnly: true }),
  ],
  preview: { select: { title: 'email' } },
});
