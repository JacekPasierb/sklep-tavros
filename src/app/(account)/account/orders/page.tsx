"use client";

import { useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type OrderItemProduct = {
  _id: string;
  slug: string;
  images?: string[];
  title?: string;
  price?: number;
  currency?: string;
};

type OrderItem = {
  productId: OrderItemProduct;
  title: string;
  qty: number;
  price: number;
};

type AccountOrder = {
  _id: string;
  orderNumber: string;
  status: "pending" | "paid" | "canceled";
  createdAt: string;
  amountTotal: number;
  amountSubtotal?: number;
  shippingCost?: number;
  currency: string;
  items: OrderItem[];
};

type OrdersResponse = {
  orders: AccountOrder[];
};

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json() as Promise<OrdersResponse>);

const formatPrice = (amount: number, currency?: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: (currency || "GBP").toUpperCase(),
  }).format(amount || 0);

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();

  // 🔐 redirect tylko w efekcie
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin?callbackUrl=/account/orders");
    }
  }, [status, router]);

  const shouldFetch = status === "authenticated";

  const { data, error, isLoading } = useSWR(
    shouldFetch ? "/api/account/orders" : null,
    fetcher
  );

  // ładowanie (auth lub fetch)
  if (status === "loading" || (shouldFetch && isLoading && !data)) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm text-center">
          <p className="text-sm text-zinc-600">Loading your orders…</p>
        </div>
      </section>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm text-center">
          <h2 className="mb-3 text-xl font-semibold">Something went wrong</h2>
          <p className="mb-4 text-sm text-zinc-600">
            We couldn&apos;t load your orders right now. Please try again in a
            moment.
          </p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90"
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
            You haven&apos;t placed any orders so far.
          </p>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full
                       bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]
                       text-white hover:bg-black/90"
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
        {/* nagłówek strony */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Order history
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Track your recent orders, delivery and payment status.
            </p>
          </div>
          <span className="text-xs rounded-full bg-zinc-900 px-3 py-1 font-medium uppercase tracking-[0.16em] text-zinc-50">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <div className="space-y-5">
          {orders.map((order) => {
            const createdAt = new Date(order.createdAt);

            const badgeClass =
              order.status === "paid"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : order.status === "pending"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-rose-50 text-rose-700 border-rose-200";

            const statusLabel =
              order.status === "paid"
                ? "PAID"
                : order.status === "pending"
                ? "PENDING"
                : "CANCELED";

            const displayNumber =
              order.orderNumber || `#${String(order._id).slice(-6)}`;

            const subtotal =
              typeof order.amountSubtotal === "number"
                ? order.amountSubtotal
                : order.items.reduce(
                    (sum, item) => sum + item.price * item.qty,
                    0
                  );

            const shipping =
              typeof order.shippingCost === "number"
                ? order.shippingCost
                : Math.max(order.amountTotal - subtotal, 0);

            return (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="block rounded-3xl border border-zinc-200 bg-white/90 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition"
              >
                {/* TOP: Order info + status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-zinc-900">
                      Order <span className="tracking-[0.18em]">{displayNumber}</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      Placed on{" "}
                      {createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {createdAt.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${badgeClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* BODY: lewa kolumna – produkty, prawa – podsumowanie */}
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-stretch">
                  {/* produkty */}
                  <div className="flex-1 space-y-3">
                    {order.items.map((item, index) => {
                      const img = item.productId?.images?.[0];
                      const lineTotal = item.price * item.qty;

                      return (
                        <div
                          key={`${order._id}-item-${index}`}
                          className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-2.5"
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                            {img ? (
                              <Image
                                src={img}
                                alt={item.title}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col justify-center">
                            <p className="text-sm font-medium text-zinc-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-zinc-500">
                              Qty {item.qty}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-zinc-400 line-through">
                              {item.qty > 1
                                ? formatPrice(item.price, order.currency)
                                : ""}
                            </p>
                            <p className="text-sm font-semibold text-zinc-900">
                              {formatPrice(lineTotal, order.currency)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* podsumowanie */}
                  <div className="w-full lg:w-64 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-zinc-500">Items subtotal</span>
                      <span className="font-medium text-zinc-900">
                        {formatPrice(subtotal, order.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-zinc-500">Delivery</span>
                      <span className="font-medium text-zinc-900">
                        {shipping > 0
                          ? formatPrice(shipping, order.currency)
                          : "Free"}
                      </span>
                    </div>

                    <div className="my-2 border-t border-zinc-200" />

                    <div className="flex items-center justify-between py-1">
                      <span className="text-[13px] font-semibold text-zinc-900">
                        Total
                      </span>
                      <span className="text-base font-semibold text-zinc-900">
                        {formatPrice(order.amountTotal, order.currency)}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] leading-snug text-zinc-400">
                      All prices include VAT where applicable.
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
