// app/(admin)/admin/page.tsx

import { AdminStatsGrid } from "../../../components/admin/dashboard/AdminStatsGrid";
import { FulfillmentSection } from "../../../components/admin/dashboard/FullfilmentSection";
import { OrdersStatusSection } from "../../../components/admin/dashboard/OrdersStatusSection";
import SectionHeader from "../../../components/admin/SectionHeader";
import { getAdminMetrics } from "../../../lib/services/admin/metrics.service";


const AdminDashboardPage = async () => {
  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Key store metrics — users, catalog, orders and revenue."
      />

      <AdminStatsGrid metrics={metrics} />
      <OrdersStatusSection orders={metrics.orders} />
      <FulfillmentSection orders={metrics.orders} />
    </div>
  );
};

export default AdminDashboardPage;
