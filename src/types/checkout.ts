import { CartItem } from "./shop/cart";

export type UiCartItem = CartItem & { key?: string };

export type FreeExpressProgress = {
  left: number;      // ile brakuje do progu
  progress: number;  // 0..100 do paska
};
