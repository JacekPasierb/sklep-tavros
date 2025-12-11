// src/lib/orders/utils.ts

import { AccountOrder } from "../../types/order";


export const ordersFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return (await res.json()) as { orders: AccountOrder[] };
};

export const formatPrice = (amount: number, currency?: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: (currency || "GBP").toUpperCase(),
  }).format(amount || 0);

export const computeOrderTotals = (order: AccountOrder) => {
  const subtotal =
    typeof order.amountSubtotal === "number"
      ? order.amountSubtotal
      : order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const shipping =
    typeof order.shippingCost === "number"
      ? order.shippingCost
      : Math.max(order.amountTotal - subtotal, 0);

  return { subtotal, shipping };
};

export const getPaymentMeta = (paymentStatus: AccountOrder["paymentStatus"]) => {
  const normalized = paymentStatus ?? "pending";

  const badgeClass =
    normalized === "paid"
      ? "border-emerald-500 bg-emerald-500/10 text-emerald-800"
      : normalized === "pending"
      ? "border-amber-500 bg-amber-500/10 text-amber-800"
      : "border-rose-500 bg-rose-500/10 text-rose-800";

  const panelClass =
    normalized === "paid"
      ? "border-emerald-200 bg-emerald-50/80"
      : normalized === "pending"
      ? "border-amber-200 bg-amber-50/80"
      : "border-rose-200 bg-rose-50/80";

  const label =
    normalized === "paid"
      ? "Payment completed"
      : normalized === "pending"
      ? "Awaiting payment"
      : "Payment canceled";

  const description =
    normalized === "paid"
      ? "We have received your payment. Your order is being processed."
      : normalized === "pending"
      ? "Your order is placed but still waiting for payment confirmation."
      : "This order has been canceled. No further action is required.";

  return {
    badgeClass,
    panelClass,
    label,
    description,
    displayStatus: normalized.toUpperCase(),
  };
};
