// src/lib/mappers/admin/orders.mapper.ts

import { OrderRow, PublicOrder } from "../../../types/admin/orders";


/**
 * Mapper: zamienia rekord zamówienia z DB (OrderRow) na bezpieczny format
 * do wyświetlania w panelu admina (PublicOrder).
 */
export function toPublicOrder(row: OrderRow): PublicOrder {
  return {
    id: String(row._id),
    orderNumber: row.orderNumber,
    email: row.email,
    total: typeof row.amountTotal === "number" ? row.amountTotal : 0,
    currency: (row.currency ?? "gbp").toUpperCase(),
    paymentStatus: row.paymentStatus,
    fulfillmentStatus: row.fulfillmentStatus,
    createdAt: row.createdAt.toISOString(),
    customer: row.customer ?? null,
    items: Array.isArray(row.items)
      ? row.items.map((it) => ({
          slug: it.slug,
          title: it.title,
          price: it.price,
          qty: it.qty,
          size: it.size,
          color: it.color,
        }))
      : [],
    shippingMethod: row.shippingMethod,
    shippingCost: row.shippingCost,
  };
}
