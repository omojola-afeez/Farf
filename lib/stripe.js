import Stripe from 'stripe';

let instance = null;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!instance) instance = new Stripe(process.env.STRIPE_SECRET_KEY);
  return instance;
}
