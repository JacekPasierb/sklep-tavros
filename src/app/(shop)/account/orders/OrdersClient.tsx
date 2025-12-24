"use client";

import {useEffect, useMemo} from "react";
import useSWR from "swr";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";

import {OrdersResponse} from "../../../../types/order";
import {ordersFetcher} from "../../../../lib/utils/orders";
import {OrderHistoryHeader} from "../../../../components/account/orders/OrderHistoryHeader";
import {OrderCard} from "../../../../components/account/orders/OrderCard";
import {Pagination} from "../../../../components/products/Pagination";

export default function OrdersClient() {
  const {status} = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---- auth guard ----
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin?callbackUrl=/account/orders");
    }
  }, [status, router]);

  const shouldFetch = status === "authenticated";

  const {data, error, isLoading} = useSWR<OrdersResponse>(
    shouldFetch ? "/api/account/orders" : null,
    ordersFetcher,
    {revalidateOnFocus: false}
  );

  // ---- pagination ----
  const pageSize = 6; // możesz zmienić (np. 5/8/10)
  const pageParam = searchParams.get("page");
  const currentPage =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Math.max(1, Number(pageParam))
      : 1;

      const orders = useMemo(() => {
        return data?.orders ?? [];
      }, [data]);
      
  const totalItems = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage, pageSize]);

  // jeśli user jest na stronie, która już nie istnieje (np. po zmianie listy)
  useEffect(() => {
    if (totalItems === 0) return;
    if (currentPage <= totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    if (totalPages <= 1) params.delete("page");
    else params.set("page", String(totalPages));

    const url = params.toString()
      ? `/account/orders?${params.toString()}`
      : "/account/orders";

    router.replace(url);
  }, [currentPage, totalPages, totalItems, router, searchParams]);

  // ---- loading ----
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

  // ---- error ----
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

  // ---- empty ----
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

  // ---- content ----
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-zinc-50/60 px-4 py-6 shadow-sm sm:px-6 sm:py-8">
        <OrderHistoryHeader totalOrders={orders.length} />

        <div className="space-y-5">
          {paginatedOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>

        {/* pagination footer */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-sm text-zinc-500">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
              orders
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </div>
    </section>
  );
}
