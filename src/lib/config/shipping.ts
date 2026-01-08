export const SHIPPING_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 125,
  STANDARD_COST: 4.99,
  EXPRESS_COST: 9.99,
} as const;

export type ShippingMethod = "standard" | "express";
