import { getProductsByIds } from './data';
import { siteConfig } from './siteConfig';
import { variantLabel } from './format';

// Server-side cart check shared by every payment provider.
// All money values in the result are in minor units (kobo for Naira).
// Nothing the browser sends is trusted: price, stock and variants are re-read from the CMS.
export async function prepareCart(rawItems) {
  const cart = Array.isArray(rawItems) ? rawItems.slice(0, 50) : [];
  if (cart.length === 0) return { error: 'Your cart is empty.' };

  const ids = [...new Set(cart.map((i) => String(i.productId)))];
  const products = await getProductsByIds(ids);
  const byId = new Map(products.map((p) => [p._id, p]));

  const lines = [];
  const perProduct = new Map();
  let subtotal = 0;

  for (const item of cart) {
    const product = byId.get(String(item.productId));
    if (!product) return { error: 'An item in your cart is no longer available.' };
    if (!product.inStock) return { error: `${product.name} is out of stock.` };

    const quantity = Math.floor(Number(item.quantity));
    if (!(quantity >= 1) || quantity > 99) return { error: `Check the quantity for ${product.name}.` };

    const total = (perProduct.get(product._id) || 0) + quantity;
    perProduct.set(product._id, total);
    if (product.stockCount != null && total > product.stockCount) {
      return { error: `Only ${product.stockCount} of ${product.name} available.` };
    }

    const selected = {};
    for (const group of product.variants || []) {
      const choice = item.variants?.[group.name];
      if (!group.options.includes(choice)) {
        return { error: `Choose a ${group.name.toLowerCase()} for ${product.name}.` };
      }
      selected[group.name] = choice;
    }

    const unitAmount = Math.round(product.price * 100);
    subtotal += unitAmount * quantity;
    lines.push({
      product,
      quantity,
      selected,
      label: variantLabel(selected),
      unitAmount,
    });
  }

  // Delivery is paid by the buyer and agreed on WhatsApp, so it is not part of the payment.
  return { lines, subtotal, shipping: 0, total: subtotal };
}
