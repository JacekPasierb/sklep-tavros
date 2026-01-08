"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";

import { useCartStore } from "../../../store/cartStore";
import { useSuccessCleanupCart } from "../../../lib/hooks/useSuccessCleanupCart";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const { status } = useSession();
  const clearCart = useCartStore((s) => s.clear);
  const { mutate } = useSWRConfig();

  useSuccessCleanupCart({
    sessionId,
    status,
    router,
    clearGuestCart: clearCart,
    mutate,
  });

  if (!sessionId) return null;

  return (
    <main className="min-h-[70vh] bg-zinc-50/80 px-4 py-10 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center">
        <div className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          <span className="text-zinc-500">Bag</span>
          <span>—</span>
          <span className="text-zinc-500">Checkout</span>
          <span>—</span>
          <span className="text-zinc-900">Order confirmed</span>
        </div>

        <div className="w-full rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/70 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/40">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                <path
                  d="M20 6L9 17l-5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Payment successful
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Thank you for your order
            </h1>

            <p className="mt-3 max-w-md text-sm text-zinc-600">
              We&apos;ve received your payment and we&apos;re preparing your package.
              You will receive an order confirmation email shortly.
            </p>
          </div>

          <div className="mt-6 grid gap-4 text-xs text-zinc-600 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                What happens next
              </p>
              <p className="mt-2 leading-relaxed">
                Once your order is packed and ready to ship, we&apos;ll send you another email with tracking details.
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Need help?
              </p>
              <p className="mt-2 leading-relaxed">
                If you have any questions about your order, reply to the confirmation email and our team will assist you.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-zinc-900/30 transition hover:bg-black hover:shadow-zinc-900/40 sm:w-auto"
            >
              Continue shopping
            </Link>

            <p className="text-[11px] text-zinc-500 sm:text-right">
              You can safely close this window. Your order has been saved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
