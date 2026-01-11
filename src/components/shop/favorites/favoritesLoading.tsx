"use client";

import { memo } from "react";

type Props = {
  items?: number; 
};

const FavoritesLoading = memo(function FavoritesLoading({ items = 8 }: Props) {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* header skeleton */}
      <div className="py-4 text-center">
        <div className="mx-auto mb-3 h-7 w-48 rounded-md bg-zinc-200/70" />
        <div className="mx-auto h-4 w-44 rounded-md bg-zinc-200/60" />
      </div>

      {/* grid skeleton */}
      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: items }).map((_, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            {/* shimmer */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-zinc-100/80 to-transparent" />

            {/* image */}
            <div className="aspect-[3/4] w-full bg-zinc-200/60" />

            {/* content */}
            <div className="p-3">
              <div className="h-4 w-4/5 rounded bg-zinc-200/70" />
              <div className="mt-2 h-4 w-1/2 rounded bg-zinc-200/60" />
            </div>
          </div>
        ))}
      </section>

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

export default FavoritesLoading;
