// components/admin/dashboard/OrdersStatusSection.tsx
type Props = {
  orders: {
    pending: number;
    paid: number;
    canceled: number;
    total: number;
  };
};

export const OrdersStatusSection = ({orders}: Props) => {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
        Orders status
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusTile label="Pending" value={orders.pending} />
        <StatusTile label="Paid" value={orders.paid} />
        <StatusTile label="Canceled" value={orders.canceled} />
        <StatusTile label="Total" value={orders.total} />
      </div>
    </div>
  );
};

const StatusTile = ({label, value}: {label: string; value: number}) => (
  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
    <div className="text-xs text-zinc-500">{label}</div>
    <div className="mt-1 text-lg font-semibold text-zinc-900">{value}</div>
  </div>
);
