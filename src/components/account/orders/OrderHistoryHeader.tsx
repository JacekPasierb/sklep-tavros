// src/components/account/orders/OrderHistoryHeader.tsx

type Props = {
  totalOrders: number;
};

export const OrderHistoryHeader = ({totalOrders}: Props) => {
  const label = totalOrders === 1 ? "order" : "orders";

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.20em] text-zinc-500">
          Account · Orders
        </p>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
          Order history
        </h1>

        <p className="text-sm text-zinc-600 max-w-md">
          Review your recent purchases, delivery progress and payment status.
        </p>
      </div>

      <div className="flex items-center justify-start sm:justify-end">
        <div className="inline-flex items-center gap-3 rounded-full bg-zinc-900 px-5 py-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
          <span className="text-lg font-semibold text-zinc-50 leading-none">
            {totalOrders}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-200">
            {label}
          </span>
        </div>
      </div>
    </header>
  );
};
