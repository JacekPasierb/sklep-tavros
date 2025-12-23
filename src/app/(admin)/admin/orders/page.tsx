import Link from "next/link";
import {connectToDatabase} from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import {SectionHeader} from "../../../../components/admin/SectionHeader";
import {Pagination} from "../../../../components/products/Pagination";

import type {FulfillmentStatus, PaymentStatus} from "../../../../types/order";
import { OrderStatusControls } from "../../../../components/admin/orders/OrderStatusContrlos";

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

function parseIntSafe(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    paymentStatus?: PaymentStatus | "";
    fulfillmentStatus?: FulfillmentStatus | "";
  }>;
}) {
  const sp = await searchParams;

  const pageParam = parseIntSafe(sp.page, 1);
  const limit = 20;

  const q = (sp.q ?? "").trim();
  const paymentStatus = (sp.paymentStatus ?? "").trim() as PaymentStatus | "";
  const fulfillmentStatus = (sp.fulfillmentStatus ?? "").trim() as
    | FulfillmentStatus
    | "";

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
  const page = Math.min(pageParam, pages);

  const rows = await Order.find(filter)
    .sort({createdAt: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .select({
      orderNumber: 1,
      email: 1,
      amountTotal: 1, // ✅ w modelu
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
        amountTotal?: number | null;
        currency?: string | null;
        paymentStatus: PaymentStatus;
        fulfillmentStatus: FulfillmentStatus;
        createdAt: Date;
      }>
    >();

  const orders: PublicOrder[] = rows.map((o) => ({
    id: String(o._id),
    orderNumber: o.orderNumber,
    email: o.email,
    total: typeof o.amountTotal === "number" ? o.amountTotal : 0,
    currency: (o.currency ?? "gbp").toUpperCase(),
    paymentStatus: o.paymentStatus,
    fulfillmentStatus: o.fulfillmentStatus,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Management"
        title="Orders"
        description="Track payments, fulfillment and shipping status."
      />

      {/* Filters */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5">
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-5">
            <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Search
            </label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Order number or email…"
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Payment
            </label>
            <select
              name="paymentStatus"
              defaultValue={paymentStatus}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Fulfillment
            </label>
            <select
              name="fulfillmentStatus"
              defaultValue={fulfillmentStatus}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
            >
              <option value="">All</option>
              <option value="created">Created</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className="sm:col-span-1 flex gap-2 sm:justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-black/90"
            >
              Apply
            </button>
          </div>

          <div className="sm:col-span-12">
            <Link
              href="/admin/orders"
              className="inline-flex rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-zinc-50"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {total} total
          </div>
          <div className="text-xs text-zinc-500">
            Page <span className="text-black font-medium">{page}</span> / {pages}
          </div>
        </div>

        {/* headers */}
        <div className="hidden sm:block px-5 py-3 border-b border-zinc-200">
          <div className="grid grid-cols-12 gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <div className="col-span-3">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-2">Fulfillment</div>
          </div>
        </div>

        <div className="divide-y divide-zinc-200">
          {orders.map((o) => (
            <div key={o.id} className="px-5 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4 sm:items-center">
                <div className="sm:col-span-3 min-w-0">
                  <div className="text-sm font-semibold text-black truncate">
                    {o.orderNumber}
                  </div>
                  <div className="mt-1 sm:hidden text-xs text-zinc-500">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div className="sm:col-span-3 min-w-0">
                  <div className="text-sm text-zinc-700 truncate">{o.email}</div>
                  <div className="hidden sm:block text-xs text-zinc-500">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div className="sm:col-span-2 sm:text-right text-sm text-black">
                  {Number.isFinite(o.total) ? o.total.toFixed(2) : "—"}{" "}
                  {o.currency}
                </div>

                <div className="sm:col-span-2">
                  <OrderStatusControls
                    orderId={o.id}
                    paymentStatus={o.paymentStatus}
                    fulfillmentStatus={o.fulfillmentStatus}
                    kind="payment"
                  />
                </div>

                <div className="sm:col-span-2">
                  <OrderStatusControls
                    orderId={o.id}
                    paymentStatus={o.paymentStatus}
                    fulfillmentStatus={o.fulfillmentStatus}
                    kind="fulfillment"
                  />
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 ? (
            <div className="px-5 py-10 text-sm text-zinc-600">No orders found.</div>
          ) : null}
        </div>

        <div className="px-5 py-4 border-t border-zinc-200">
          <Pagination currentPage={page} totalPages={pages} />
        </div>
      </div>
    </div>
  );
}
