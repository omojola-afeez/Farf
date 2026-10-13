# FARF

Home, school and DIY essentials store for Nigeria. Prices in Naira (₦).

Stack: Next.js (Pages Router), Tailwind CSS, Sanity, Paystack (Stripe optional), Resend, Vercel.

## Run locally

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it in.
3. `npm run dev` and open http://localhost:3000

With no Sanity keys the site runs in demo mode with sample products and a yellow banner.

## Set up the services

**Sanity**
1. Create a project and a private dataset.
2. Create an editor token and put it in `SANITY_API_TOKEN`.
3. Deploy the studio in `studio/` (`cd studio && npm install && npx sanity deploy`).
4. Add products. Upload real photos and tick "featured": featured products with photos float in the home hero, and collection panels pick up a cover photo from each category.

**Paystack**
1. Put the secret key in `PAYSTACK_SECRET_KEY`.
2. In the Paystack dashboard, set the webhook URL to `https://your-domain/api/paystack-webhook`.
3. Use test keys first.

Stripe is supported but not the default. Set `NEXT_PUBLIC_PAYMENT_PROVIDER=stripe`, add the Stripe keys, and point the Stripe webhook to `/api/webhook`.

**Resend**: set `RESEND_API_KEY`, `EMAIL_FROM` (a verified domain) and `ADMIN_EMAIL`.

**WhatsApp orders**: set `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, for example 2348012345678). The cart then shows an "Order on WhatsApp" button that opens a chat with the full cart, delivery fee, total and any delivery details already typed in.

**Vercel**: import the repo, add every variable from `.env.local`, deploy. Variables read by the browser must start with exactly `NEXT_PUBLIC_`.

## The two landing page files

`nature-nest-essentials.html` and `farf-landing.html` are standalone design demos. Double-click to open them in a browser. They need internet for fonts and animations. They are not part of the store. The store's home page (`pages/index.js`) already carries the merged design.

## Placeholders to confirm

- Free delivery over ₦50,000, flat delivery ₦3,500, returns within 1 to 3 days, delivery in 1 to 3 days. Change them in `.env.local`.
- Brand colours (orange and teal), text-only logo, support email.
- Sample products are demo data only.

## Purchase-flow test checklist

1. Add a product with a variant to the cart, change the quantity, reload: cart persists.
2. Fill the delivery form and pay with a Paystack test card.
3. The success page shows the order number.
4. The order appears in Sanity once, even if the webhook is retried.
5. Customer and admin emails arrive.
6. `/track` with the order number and the same email shows the status.
7. Repeat on a phone.

## Credits

Icons: Solar icon set by 480 Design, CC BY 4.0.
