import { Suspense } from "react";
import OrdersClient from "./OrdersClient";
import OrdersLoading from "@/components/account/orders/OrdersLoading";

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersLoading items={3} />}>
      <OrdersClient />
    </Suspense>
  );
}
