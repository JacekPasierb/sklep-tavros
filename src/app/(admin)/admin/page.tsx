import SectionHeader from "../../../components/admin/SectionHeader";
import {StatCard} from "../../../components/admin/StatCard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Premium, minimal panel for store operations."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Orders" value="—" hint="Stripe + DB sync (soon)" />
        <StatCard label="Revenue" value="—" hint="Monthly breakdown (soon)" />
        <StatCard label="Users" value="—" hint="Admin-only access" />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Next step
        </div>
        <p className="mt-2 text-sm text-zinc-600">
          Add: users list endpoint, orders list, product CRUD, and admin
          navigation.
        </p>
      </div>
    </div>
  );
}
