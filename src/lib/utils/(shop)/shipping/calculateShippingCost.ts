import { SHIPPING_CONFIG, ShippingMethod } from "@/lib/config/shop/shipping";

export const calculateShippingCost=(subtotal: number, method: ShippingMethod) =>{
    if (method === "standard") return SHIPPING_CONFIG.STANDARD_COST;
    return subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_CONFIG.EXPRESS_COST;
  }