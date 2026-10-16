// Every NEXT_PUBLIC_ variable is referenced by its full literal name so Next.js can inline it for the browser.
export const siteConfig = {
  name: 'FARF',
  tagline: 'Everyday essentials for home, school and DIY',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  currency: (process.env.NEXT_PUBLIC_CURRENCY || 'ngn').toLowerCase(),
  // Delivery is paid by the buyer and agreed on WhatsApp, so there is no shipping fee in the checkout.
  deliveryWindow: process.env.NEXT_PUBLIC_DELIVERY_WINDOW || '1 to 3 days',
  returnWindowDays: process.env.NEXT_PUBLIC_RETURN_WINDOW_DAYS || '1 to 3',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349113693694').replace(/\D/g, ''),
  phone: process.env.NEXT_PUBLIC_PHONE || '0911 369 3694',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Yarottan Estate Gate, Zone A, Yarottan, Gaa Saka, Ilorin',
  paymentProvider: (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'paystack').toLowerCase(),
};
