import { SHIPPING_CONFIG, ShippingMethod } from "../../config/shipping";


export function calculateShippingCost(subtotal: number, method: ShippingMethod) {
  if (method === "standard") return SHIPPING_CONFIG.STANDARD_COST;
  return subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD
    ? 0
    : SHIPPING_CONFIG.EXPRESS_COST;
}

export function getFreeExpressProgress(subtotal: number) {
  const left = Math.max(0, SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) * 100);

  return { left, progress, unlocked: left === 0 };
}
