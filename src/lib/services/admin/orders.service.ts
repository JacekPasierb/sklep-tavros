import Order from "../../../models/Order";
import {
  OrdersQuery,
  OrdersResult,
  PublicOrder,
} from "../../../types/admin/orders";
import {Customer} from "../../../types/customer";
import {FulfillmentStatus, PaymentStatus} from "../../../types/order";
import {connectToDatabase} from "../../mongodb";

type OrderRow = {
  _id: unknown;
  orderNumber: string;
  email: string;
  amountTotal?: number | null;
  currency?: string | null;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: Date;
  customer?: Customer | null;
  items?: Array<{
    slug?: string;
    title?: string;
    price?: number;
    qty?: number;
    size?: string;
    color?: string;
  }>;

  shippingMethod?: "standard" | "express";
  shippingCost?: number;
};

const buildOrdersFilter = (query: OrdersQuery): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (query.q) {
    filter.$or = [
      {orderNumber: {$regex: query.q, $options: "i"}},
      {email: {$regex: query.q, $options: "i"}},
      {"customer.email": {$regex: query.q, $options: "i"}},
      {"customer.firstName": {$regex: query.q, $options: "i"}},
      {"customer.lastName": {$regex: query.q, $options: "i"}},
    ];
  }

  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.fulfillmentStatus)
    filter.fulfillmentStatus = query.fulfillmentStatus;

  return filter;
};

const toPublicOrder = (row: OrderRow): PublicOrder => {
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
};

const getAdminOrders = async (query: OrdersQuery): Promise<OrdersResult> => {
  await connectToDatabase();

  const filter = buildOrdersFilter(query);

  const total = await Order.countDocuments(filter);
  const limit = query.limit;
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(query.page, pages);

  const rows = await Order.find(filter)
    .sort({createdAt: -1})
    .skip((page - 1) * query.limit)
    .limit(query.limit)
    .select({
      orderNumber: 1,
      email: 1,
      amountTotal: 1,
      currency: 1,
      paymentStatus: 1,
      fulfillmentStatus: 1,
      createdAt: 1,
      customer: 1,
      items: 1,
      shippingMethod: 1, // ✅
      shippingCost: 1,
    })
    .lean<OrderRow[]>();

  return {
    orders: rows.map(toPublicOrder),
    total,
    page,
    pages,
    limit: query.limit,
  };
};

export default getAdminOrders;
