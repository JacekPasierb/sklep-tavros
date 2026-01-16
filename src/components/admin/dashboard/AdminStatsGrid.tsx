// components/admin/dashboard/AdminStatsGrid.tsx

import formatMoney from "@/lib/utils/shared/formatMoney";
import {StatCard} from "../StatCard";

type Props = {
  metrics: {
    usersCount: number;
    products: {
      active: number;
      hidden: number;
    };
    orders: {
      total: number;
      paid: number;
      pending: number;
      canceled: number;
      toShip: number;
    };
    revenue: {
      thisMonth: number;
      allTime: number;
      currency: string;
    };
  };
};

export const AdminStatsGrid = ({metrics}: Props) => {
  const {usersCount, products, orders, revenue} = metrics;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Users"
        value={String(usersCount)}
        hint="Registered accounts"
      />

      <StatCard
        label="Products"
        value={String(products.active)}
        hint={`Active: ${products.active} • Hidden: ${products.hidden}`}
      />

      <StatCard
        label="Orders"
        value={String(orders.total)}
        hint={`Paid: ${orders.paid} • Pending: ${orders.pending} • Canceled: ${orders.canceled}`}
      />

      <StatCard
        label="Revenue (last month)"
        value={formatMoney(revenue.thisMonth)}
        hint={`All time: ${formatMoney(revenue.allTime)}`}
      />

      <StatCard
        label="To ship"
        value={String(orders.toShip)}
        hint="Paid orders waiting for fulfillment"
      />
    </div>
  );
};
