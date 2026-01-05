"use client";

import {useState} from "react";

import {
  formatAddress,
  formatCustomerName,
  formatDate,
  formatTime,
} from "../../../lib/utils/admin/orders/formatters";
import {PublicOrder} from "../../../types/admin/orders";
import {Pagination} from "../../products/Pagination";
import OrderStatusControls from "./OrderStatusContrlos";
import OrderItemsPreview from "./OrderItemsPreview";

type Props = {
  orders: PublicOrder[];
  total: number;
  page: number;
  pages: number;
};

const OrdersList = ({orders, total, page, pages}: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
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
        <div className="grid grid-cols-13 gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <div className="col-span-2">Order</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-2">Pay</div>
          <div className="col-span-2">Ship</div>
        </div>
      </div>

      <div className="divide-y divide-zinc-200">
        {orders.map((o) => {
          const customerName = formatCustomerName(o.customer);
          const customerEmail = o.customer?.email || o.email;
          const address = formatAddress(o.customer?.address);
          const isOpen = openId === o.id;

          return (
            <div key={o.id} className="px-5 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-13 sm:gap-4 sm:items-center">
                {/* ORDER NUMBER */}
                <div className="sm:col-span-2 min-w-0">
                  <div className="text-sm font-semibold text-black truncate">
                    {o.orderNumber}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : o.id)}
                      className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                      {isOpen
                        ? "Hide items"
                        : `Items (${o.items?.length ?? 0})`}
                    </button>

                    {/* mobile: date under order */}
                    <div className="sm:hidden text-xs text-zinc-500">
                      {formatDate(o.createdAt)} • {formatTime(o.createdAt)}
                    </div>
                  </div>
                </div>

                {/* DATE (desktop) */}
                <div className="hidden sm:block sm:col-span-2 text-xs text-zinc-700">
                  <div className="font-medium text-zinc-900">
                    {formatDate(o.createdAt)}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {formatTime(o.createdAt)}
                  </div>
                </div>

                {/* CUSTOMER + ADDRESS */}
                <div className="sm:col-span-3 min-w-0">
                  <div className="text-sm font-medium text-zinc-900 truncate">
                    {customerName}
                  </div>
                  <div className="text-xs text-zinc-600 truncate">
                    {customerEmail}
                    {o.customer?.phone ? ` • ${o.customer.phone}` : ""}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500 line-clamp-2">
                    {address}
                  </div>
                </div>

                {/* TOTAL */}
                <div className="sm:col-span-2 sm:text-right">
                  <div className="text-sm text-black">
                    {Number.isFinite(o.total) ? o.total.toFixed(2) : "—"}{" "}
                    {o.currency}
                  </div>

                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    Shipping:{" "}
                    {o.shippingMethod === "express" ? "Express" : "Standard"}
                    {typeof o.shippingCost === "number"
                      ? ` • ${o.shippingCost.toFixed(2)} ${o.currency}`
                      : ""}
                  </div>
                </div>

                {/* PAYMENT */}
                <div className="sm:col-span-2">
                  <OrderStatusControls
                    orderId={o.id}
                    paymentStatus={o.paymentStatus}
                    fulfillmentStatus={o.fulfillmentStatus}
                    kind="payment"
                  />
                </div>

                {/* FULFILLMENT */}
                <div className="sm:col-span-2">
                  <OrderStatusControls
                    orderId={o.id}
                    paymentStatus={o.paymentStatus}
                    fulfillmentStatus={o.fulfillmentStatus}
                    kind="fulfillment"
                  />
                </div>
              </div>

              {/* EXPANDED ITEMS */}
              {isOpen ? (
                <div className="mt-4">
                  <OrderItemsPreview items={o.items ?? []} />
                </div>
              ) : null}
            </div>
          );
        })}

        {orders.length === 0 ? (
          <div className="px-5 py-10 text-sm text-zinc-600">
            No orders found.
          </div>
        ) : null}
      </div>

      <div className="px-5 py-4 border-t border-zinc-200">
        <Pagination currentPage={page} totalPages={pages} />
      </div>
    </div>
  );
};

export default OrdersList;
