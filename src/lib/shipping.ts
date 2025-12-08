// ❗ BACKEND is source of truth for shipping
export const FREE_SHIPPING_THRESHOLD = 125;
export const STANDARD_SHIPPING_COST = 4.99;
export const EXPRESS_SHIPPING_COST = 9.99;

export type ShippingMethod = "standard" | "express";

export function calculateShippingCost(
  subtotal: number,
  method: ShippingMethod
): number {
  // Standard: zawsze stała cena
  if (method === "standard") return STANDARD_SHIPPING_COST;

  // Express: darmowa powyżej progu, inaczej stała cena
  if (method === "express") {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : EXPRESS_SHIPPING_COST;
  }

  // Fallback (gdyby coś poszło nie tak) – standard
  return STANDARD_SHIPPING_COST;
}
