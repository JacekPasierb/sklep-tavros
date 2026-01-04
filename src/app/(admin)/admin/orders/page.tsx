import type {FulfillmentStatus, PaymentStatus} from "../../../../types/order";

import {normalizeOrdersQuery} from "../../../../lib/utils/admin/orders/query";
import getAdminOrders from "../../../../lib/services/admin/orders.service";

import OrdersFilters from "../../../../components/admin/orders/OrdersFilters";
import OrdersList from "../../../../components/admin/orders/OrdersList";
import SectionHeader from "../../../../components/admin/SectionHeader";

const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    paymentStatus?: PaymentStatus | "";
    fulfillmentStatus?: FulfillmentStatus | "";
  }>;
}) => {
  const sp = await searchParams;

  const query = normalizeOrdersQuery(sp, {limit: 10});
  const {orders, total, page, pages} = await getAdminOrders(query);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Management"
        title="Orders"
        description="Track payments, fulfillment and shipping status."
      />

      <OrdersFilters
        q={query.q}
        paymentStatus={query.paymentStatus}
        fulfillmentStatus={query.fulfillmentStatus}
      />

      <OrdersList orders={orders} total={total} page={page} pages={pages} />
    </div>
  );
};

export default AdminOrdersPage;
