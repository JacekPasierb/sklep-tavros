import {OrdersQuery, OrdersSearchParams} from "../../../../types/admin/orders";
import {FulfillmentStatus, PaymentStatus} from "../../../../types/order";

function parsePositiveInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeText(value: string | undefined) {
  return (value ?? "").trim();
}

export function normalizeOrdersQuery(
  sp: OrdersSearchParams,
  options?: {limit?: number}
): OrdersQuery {
  const limit = options?.limit ?? 20;

  return {
    page: parsePositiveInt(sp.page, 1),
    limit,
    q: normalizeText(sp.q),
    paymentStatus: normalizeText(sp.paymentStatus as string) as
      | PaymentStatus
      | "",
    fulfillmentStatus: normalizeText(sp.fulfillmentStatus as string) as
      | FulfillmentStatus
      | "",
  };
}
