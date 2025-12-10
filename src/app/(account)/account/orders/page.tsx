"use client";

import {useEffect} from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

type FulfillmentStatus =
  | "created" // zamówienie utworzone
  | "processing" // pakowanie / przygotowanie
  | "shipped" // wysłane
  | "delivered" // doręczone
  | "canceled";

// stałe kroki timeline
const ORDER_STEPS = [
  "Order placed",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

// mapowanie statusu na index kroku
const FULFILLMENT_STEP_INDEX: Record<FulfillmentStatus, number> = {
  created: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  canceled: 0, // canceled: zostaje na pierwszym kroku, ale mamy inny kolor
};

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
  paymentStatus: "pending" | "paid" | "canceled"; // status płatności
  fulfillmentStatus?: FulfillmentStatus; // status realizacji
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
  const {status} = useSession();
  const router = useRouter();

  // 🔐 redirect tylko w efekcie
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin?callbackUrl=/account/orders");
    }
  }, [status, router]);

  const shouldFetch = status === "authenticated";

  const {data, error, isLoading} = useSWR(
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
  console.log("orders", orders);

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
            const paymentStatus = order.paymentStatus ?? "pending"
            const createdAt = new Date(order.createdAt);
            const badgeClass =
            paymentStatus === "paid"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : paymentStatus === "pending"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-rose-50 text-rose-700 border-rose-200";
        
          const statusLabel =
            paymentStatus === "paid"
              ? "PAID"
              : paymentStatus === "pending"
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
              <div
                key={order._id}
                className="block rounded-3xl border border-zinc-200 bg-white/90 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition"
              >
                {/* TOP: Order meta + payment status + full-width timeline */}
                <div className="border-b border-zinc-100 pb-4">
                  {/* 1. GÓRNY WIERSZ: numer, data, payment */}
                  <div className="grid gap-4 sm:grid-cols-3 items-start">
                    {/* Numer zamówienia */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Order number
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {displayNumber}
                      </p>
                    </div>

                    {/* Data i godzina */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Placed on
                      </p>
                      <p className="mt-1 text-sm text-zinc-900">
                        {createdAt.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-zinc-500">
                        at{" "}
                        {createdAt.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Status płatności */}
                    <div className="sm:text-right">
                      <div className="flex flex-nowrap items-center justify-start sm:justify-end gap-2">
                        <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          Payment status:
                        </p>
                        <span
                          className={`whitespace-nowrap inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${badgeClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. DRUGI WIERSZ: TIMELINE NA CAŁĄ SZEROKOŚĆ */}
                  {(() => {
                    const fulfillmentStatus: FulfillmentStatus =
                      order.fulfillmentStatus ?? "created";
                    const currentStep =
                      FULFILLMENT_STEP_INDEX[fulfillmentStatus];
                    const isCanceled = fulfillmentStatus === "canceled";

                    return (
                      <div className="mt-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          Order status
                        </p>

                        {isCanceled ? (
                          <span className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
                            Canceled
                          </span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            {ORDER_STEPS.map((label, index) => {
                              const isActive = index <= currentStep;
                              const isCompleted = index < currentStep;

                              return (
                                <div
                                  key={label}
                                  className="flex items-center gap-2 flex-1 min-w-[60px]"
                                >
                                  {/* kropka */}
                                  <div
                                    className={[
                                      "flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border",
                                      isCompleted
                                        ? "border-emerald-500 bg-emerald-500"
                                        : isActive
                                        ? "border-emerald-500 bg-white"
                                        : "border-zinc-300 bg-white",
                                    ].join(" ")}
                                  />

                                  {/* label */}
                                  <span
                                    className={[
                                      "text-[10px] uppercase tracking-[0.16em] truncate",
                                      isActive
                                        ? "text-zinc-900 font-semibold"
                                        : "text-zinc-400",
                                    ].join(" ")}
                                  >
                                    {label}
                                  </span>

                                  {/* linia między krokami (nie przy ostatnim) */}
                                  {index < ORDER_STEPS.length - 1 && (
                                    <div
                                      className={[
                                        "h-[1px] flex-1",
                                        isCompleted
                                          ? "bg-emerald-500"
                                          : "bg-zinc-200",
                                      ].join(" ")}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* BODY: lewa kolumna – produkty, prawa – podsumowanie */}
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-stretch">
                  {/* produkty */}
                  <div className="flex-1 space-y-3">
                    {order.items.map((item, index) => {
                      const img = item.productId?.images?.[0];
                      const lineTotal = item.price * item.qty;
                      const slugProduct = item.productId.slug;

                      return (
                        <Link
                          key={`${order._id}-item-${index}`}
                          href={`/product/${slugProduct}`}
                          className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-2.5"
                        >
                          <div className="h-16 w-16 overflow-hidden  border border-zinc-200 bg-zinc-100">
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
                        </Link>
                      );
                    })}
                  </div>

                  {/* podsumowanie */}
                  <div className="w-full lg:w-64 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Order summary
                    </p>

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
                        Total paid
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
