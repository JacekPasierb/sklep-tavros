import { Suspense } from "react";
import FavoritesClient from "./FavoritesClient";

export default function FavoritesPage() {
  return (
    <Suspense
      fallback={
        <section className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-zinc-500">Loading…</p>
        </section>
      }
    >
      <FavoritesClient />
    </Suspense>
  );
}
