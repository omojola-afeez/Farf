import { defineArrayMember, defineField, defineType } from 'sanity';

// Orders are created by the Stripe webhook. Staff change only the status and the tracking note.
export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'orderNumber', title: 'Order number', type: 'string', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'paid' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'paid',
    }),
    defineField({
      name: 'trackingNote',
      title: 'Tracking note',
      description: 'Shown to the customer on the order tracking page. Courier name, waybill number, expected date.',
      type: 'text',
      rows: 3,
    }),
    defineField({ name: 'email', title: 'Customer email', type: 'string', readOnly: true }),
    defineField({ name: 'customerName', title: 'Customer name', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'shippingName', title: 'Ship to', type: 'string', readOnly: true }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping address',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({ name: 'line1', type: 'string' }),
        defineField({ name: 'line2', type: 'string' }),
        defineField({ name: 'city', type: 'string' }),
        defineField({ name: 'state', type: 'string' }),
        defineField({ name: 'postalCode', type: 'string' }),
        defineField({ name: 'country', type: 'string' }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'productId', type: 'string' }),
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'variants', type: 'string' }),
            defineField({ name: 'quantity', type: 'number' }),
            defineField({ name: 'unitAmount', type: 'number' }),
          ],
          preview: { select: { title: 'name', subtitle: 'quantity' } },
        }),
      ],
    }),
    defineField({ name: 'subtotal', type: 'number', readOnly: true }),
    defineField({ name: 'shippingCost', type: 'number', readOnly: true }),
    defineField({ name: 'total', type: 'number', readOnly: true }),
    defineField({ name: 'currency', type: 'string', readOnly: true }),
    defineField({ name: 'paymentProvider', title: 'Payment provider', type: 'string', readOnly: true }),
    defineField({ name: 'paymentReference', title: 'Payment reference', type: 'string', readOnly: true }),
    defineField({ name: 'paidAt', title: 'Paid at', type: 'datetime', readOnly: true }),
  ],
  orderings: [{ title: 'Newest first', name: 'paidAtDesc', by: [{ field: 'paidAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'orderNumber', subtitle: 'status' },
  },
});
