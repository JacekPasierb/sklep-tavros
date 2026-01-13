import {SHIPPING_CONFIG} from "@/lib/config/shop/shipping";

export const getFreeExpressProgress = (subtotal: number) => {
  const left = Math.max(0, SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(
    100,
    (subtotal / SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) * 100
  );

  return {left, progress, unlocked: left === 0};
};
