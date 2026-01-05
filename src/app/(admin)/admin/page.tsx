import SectionHeader from "../../../components/admin/SectionHeader";
import {StatCard} from "../../../components/admin/StatCard";
import {getAdminMetrics} from "../../../lib/services/admin/metrics.service";

function formatMoney(amount: number, currency: string) {
  // Jeśli masz amountTotal w pensach, zmień na: amount / 100
  const value = amount;

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value} ${currency.toUpperCase()}`;
  }
}

export default async function AdminDashboardPage() {
  const m = await getAdminMetrics();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Key store metrics — users, catalog, orders and revenue."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Users"
          value={String(m.usersCount)}
          hint="Registered accounts"
        />

        <StatCard
          label="Products"
          value={String(m.products.active)}
          hint={`Active: ${m.products.active} • Hidden: ${m.products.hidden}`}
        />

        <StatCard
          label="Orders"
          value={String(m.orders.total)}
          hint={`Paid: ${m.orders.paid} • Pending: ${m.orders.pending} • Canceled: ${m.orders.canceled}`}
        />

        <StatCard
          label="Revenue (last month)"
          value={formatMoney(m.revenue.thisMonth, m.revenue.currency)}
          hint={`All time: ${formatMoney(
            m.revenue.allTime,
            m.revenue.currency
          )}`}
        />

        <StatCard
          label="To ship"
          value={String(m.orders.toShip)}
          hint="Paid orders waiting for fulfillment"
        />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Orders status
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Pending</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.pending}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Paid</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.paid}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Canceled</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.canceled}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Total</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.total}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Fulfillment
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">To ship</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.toShip}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Shipped</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.shipped}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Delivered</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.delivered}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs text-zinc-500">Paid (total)</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900">
              {m.orders.paid}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
