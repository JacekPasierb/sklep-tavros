import {NextResponse} from "next/server";
import { requireAdmin } from "../../../../lib/utils/requireAdmin";
import { connectToDatabase } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";


type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded" | "failed";
type FulfillmentStatus = "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";

type PublicOrder = {
  id: string;
  orderNumber: string;
  email: string;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
};

type OrdersResponse = {
  orders: PublicOrder[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

function parseIntSafe(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);

  const page = parseIntSafe(url.searchParams.get("page"), 1);
  const limitRaw = parseIntSafe(url.searchParams.get("limit"), 20);
  const limit = Math.min(limitRaw, 100);

  const q = (url.searchParams.get("q") ?? "").trim();
  const paymentStatus = (url.searchParams.get("paymentStatus") ?? "").trim();
  const fulfillmentStatus = (url.searchParams.get("fulfillmentStatus") ?? "").trim();

  await connectToDatabase();

  const filter: Record<string, unknown> = {};

  if (q) {
    filter.$or = [
      {orderNumber: {$regex: q, $options: "i"}},
      {email: {$regex: q, $options: "i"}},
    ];
  }

  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (fulfillmentStatus) filter.fulfillmentStatus = fulfillmentStatus;

  const total = await Order.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);

  const rows = await Order.find(filter)
    .sort({createdAt: -1})
    .skip((safePage - 1) * limit)
    .limit(limit)
    .select({
      orderNumber: 1,
      email: 1,
      total: 1,
      currency: 1,
      paymentStatus: 1,
      fulfillmentStatus: 1,
      createdAt: 1,
    })
    .lean<
      Array<{
        _id: unknown;
        orderNumber: string;
        email: string;
        total: number;
        currency: string;
        paymentStatus: PaymentStatus;
        fulfillmentStatus: FulfillmentStatus;
        createdAt: Date;
      }>
    >();

  const orders: PublicOrder[] = rows.map((o) => ({
    id: String(o._id),
    orderNumber: o.orderNumber,
    email: o.email,
    total: o.total,
    currency: o.currency,
    paymentStatus: o.paymentStatus,
    fulfillmentStatus: o.fulfillmentStatus,
    createdAt: o.createdAt.toISOString(),
  }));

  const payload: OrdersResponse = {orders, page: safePage, limit, total, pages};
  return NextResponse.json(payload);
}
