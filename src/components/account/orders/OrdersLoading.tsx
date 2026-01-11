"use client";

import { memo } from "react";

type Props = {
  items?: number;
};

const OrdersLoading = memo(function OrdersLoading({ items = 3 }: Props) {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-zinc-50/60 px-4 py-6 shadow-sm sm:px-6 sm:py-8">
        {/* header skeleton */}
        <div className="mb-6">
          <div className="h-8 w-48 rounded-md bg-zinc-200/70" />
          <div className="mt-2 h-4 w-64 rounded-md bg-zinc-200/60" />
        </div>

        {/* cards skeleton */}
        <div className="space-y-5">
          {Array.from({ length: items }).map((_, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm"
            >
              {/* shimmer */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-zinc-100/80 to-transparent" />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-44 rounded bg-zinc-200/70" />
                  <div className="mt-3 h-4 w-72 max-w-full rounded bg-zinc-200/60" />
                </div>

                <div className="h-8 w-24 rounded-full bg-zinc-200/60" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="h-4 rounded bg-zinc-200/60" />
                <div className="h-4 rounded bg-zinc-200/60" />
                <div className="h-4 rounded bg-zinc-200/60" />
                <div className="h-4 rounded bg-zinc-200/60" />
              </div>

              <div className="mt-5 h-10 w-full rounded-xl bg-zinc-200/50" />
            </div>
          ))}
        </div>
      </div>

      {/* keyframes inline przez tailwind arbitrary animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
});

export default OrdersLoading;
