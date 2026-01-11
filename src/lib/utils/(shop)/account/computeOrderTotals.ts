import { AccountOrder } from "../../../../types/(shop)/account/orders";

export const computeOrderTotals = (order: AccountOrder) => {
    const subtotal =
      typeof order.amountSubtotal === "number"
        ? order.amountSubtotal
        : order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  
    const shipping =
      typeof order.shippingCost === "number"
        ? order.shippingCost
        : Math.max(order.amountTotal - subtotal, 0);
  
    return {subtotal, shipping};
  };