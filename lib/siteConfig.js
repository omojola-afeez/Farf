// Every NEXT_PUBLIC_ variable is referenced by its full literal name so Next.js can inline it for the browser.
export const siteConfig = {
  name: 'FARF',
  tagline: 'Everyday essentials for home, school and DIY',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  currency: (process.env.NEXT_PUBLIC_CURRENCY || 'ngn').toLowerCase(),
  // Amounts below are in Naira. They are placeholders: set your real policy in the environment.
  freeShippingThreshold: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 50000),
  flatShippingFee: Number(process.env.NEXT_PUBLIC_FLAT_SHIPPING_FEE || 3500),
  deliveryWindow: process.env.NEXT_PUBLIC_DELIVERY_WINDOW || '3 to 7 business days',
  returnWindowDays: Number(process.env.NEXT_PUBLIC_RETURN_WINDOW_DAYS || 7),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  paymentProvider: (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'paystack').toLowerCase(),
};
