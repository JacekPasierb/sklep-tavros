// src/components/account/orders/OrderCard.tsx
import React from "react";

import { PaymentStatusCard } from "./PaymentStatusCard";
import { OrderTimeline } from "./OrderTimeline";
import { OrderItemsList } from "./OrderItemsList";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { AccountOrder } from "../../../types/order";

type OrderCardProps = {
  order: AccountOrder;
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const createdAt = new Date(order.createdAt);

  const formattedDate = createdAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = createdAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="block rounded-3xl border border-zinc-200 bg-white/90 p-4 sm:p-5 shadow-sm">
      {/* META + PAYMENT + TIMELINE */}
      <div className="border-b border-zinc-100 pb-4">
        {/* Order number + date/time */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Order number
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {order.orderNumber}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Placed on
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900 whitespace-nowrap">
              {formattedDate} {formattedTime}
            </p>
          </div>
        </div>

        <PaymentStatusCard paymentStatus={order.paymentStatus} orderId={order._id} />
        <OrderTimeline fulfillmentStatus={order.fulfillmentStatus} />
      </div>

      {/* BODY: produkty + podsumowanie */}
      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <OrderItemsList order={order} />
        <OrderSummaryCard order={order} />
      </div>
    </article>
  );
};
