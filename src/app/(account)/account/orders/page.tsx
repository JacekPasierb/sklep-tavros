import {Suspense} from "react";
import OrdersClient from "./OrdersClient";


export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <section className="container mx-auto px-4 py-10">
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm text-center">
            <p className="text-sm text-zinc-600">Loading your orders…</p>
          </div>
        </section>
      }
    >
      <OrdersClient />
    </Suspense>
  );
}
