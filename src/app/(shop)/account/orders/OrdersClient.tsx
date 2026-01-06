"use client";

import {useMemo} from "react";

import Link from "next/link";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

import {OrderHistoryHeader} from "../../../../components/account/orders/OrderHistoryHeader";
import {OrderCard} from "../../../../components/account/orders/OrderCard";
import {Pagination} from "../../../../components/products/Pagination";

import {useAuthRedirect} from "../../../../lib/hooks/useAuthRedirect";
import {useOrders} from "../../../../lib/hooks/useOrders";
import {useClientPageSlice} from "../../../../lib/hooks/useClientPageSlice";

export default function OrdersClient() {
  const {status} = useSession();
  const router = useRouter();

  useAuthRedirect(status, "/signin?callbackUrl=/account/orders");

  const shouldFetch = status === "authenticated";
  const {data, error, isLoading} = useOrders(shouldFetch);

  const orders = useMemo(() => {
    return data?.orders ?? [];
  }, [data]);

  const {
    currentPage,
    totalPages,
    totalItems,
    pageItems: paginatedOrders,
    showingFrom,
    showingTo,
  } = useClientPageSlice({
    items: orders,
    pageSize: 6,
    basePath: "/account/orders",
  });

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
              Showing {showingFrom}–{showingTo} of {totalItems} orders
            </p>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </div>
    </section>
  );
}
