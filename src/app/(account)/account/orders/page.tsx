// src/app/account/orders/page.tsx
"use client";

import {useEffect} from "react";
import useSWR from "swr";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {OrdersResponse} from "../../../../types/order";
import {ordersFetcher} from "../../../../lib/utils/orders";
import {OrderHistoryHeader} from "../../../../components/account/orders/OrderHistoryHeader";
import {OrderCard} from "../../../../components/account/orders/OrderCard";

export default function OrdersPage() {
  const {status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin?callbackUrl=/account/orders");
    }
  }, [status, router]);

  const shouldFetch = status === "authenticated";

  const {data, error, isLoading} = useSWR<OrdersResponse>(
    shouldFetch ? "/api/account/orders" : null,
    ordersFetcher
  );

  if (status === "loading" || (shouldFetch && isLoading && !data)) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm text-center">
          <p className="text-sm text-zinc-600">Loading your orders…</p>
        </div>
      </section>
    );
  }

  if (status !== "authenticated") return null;

  if (error) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm text-center">
          <h2 className="mb-3 text-xl font-semibold">Something went wrong</h2>
          <p className="mb-4 text-sm text-zinc-600">
            We couldn&apos;t load your orders right now.
          </p>
          <button
            onClick={() => router.refresh()}
            className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm text-center">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            Order history
          </h1>
          <p className="mb-6 text-sm text-zinc-600">
            You haven&apos;t placed any orders.
          </p>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase text-white"
          >
            Start shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-zinc-50/60 px-4 py-6 sm:px-6 sm:py-8 shadow-sm">
        <OrderHistoryHeader totalOrders={orders.length} />

        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
}
