import { ShippingMethod } from "../../lib/config/shop/shipping";
import { CartItem } from "./cart";

export type UiCartItem = CartItem & { key?: string };

export type FreeExpressProgress = {
  left: number;      // ile brakuje do progu
  progress: number;  // 0..100 do paska
};

// typy do checkout.xervice
export type CheckoutPayload = {
  items: UiCartItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: { street: string; city: string; postalCode: string; country: string };
  };
  shipping: { method: ShippingMethod; cost: number };
};

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };