// src/components/account/orders/OrderSummaryCard.tsx

import {computeOrderTotals} from "@/lib/utils/(shop)/account/computeOrderTotals";
import formatMoney from "@/lib/utils/shared/formatMoney";
import {AccountOrder} from "@/types/(shop)/account/orders";

type Props = {
  order: AccountOrder;
};

export const OrderSummaryCard = ({order}: Props) => {
  const {subtotal, shipping} = computeOrderTotals(order);

  return (
    <aside className="w-full lg:w-64 rounded-2xl border bg-zinc-50 px-4 py-3 text-sm">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Order summary
      </p>

      <div className="flex justify-between py-1">
        <span className="text-zinc-500">Items subtotal</span>
        <span className="text-zinc-900 font-medium">
          {formatMoney(subtotal)}
        </span>
      </div>

      <div className="flex justify-between py-1">
        <span className="text-zinc-500">Delivery</span>
        <span className="text-zinc-900 font-medium">
          {shipping > 0 ? formatMoney(shipping) : "Free"}
        </span>
      </div>

      <div className="my-2 border-t" />

      <div className="flex justify-between py-1">
        <span className="text-[13px] font-semibold text-zinc-900">
          Total paid
        </span>
        <span className="text-base font-semibold text-zinc-900">
          {formatMoney(order.amountTotal)}
        </span>
      </div>

      <p className="mt-2 text-[11px] text-zinc-400">
        All prices include VAT where applicable.
      </p>
    </aside>
  );
};
