// app/(shop)/favorites/page.tsx
import { Suspense } from "react";
import FavoritesClient from "./FavoritesClient";
import FavoritesLoading from "@/components/shop/favorites/favoritesLoading";
import { FAVORITES_PAGE_SIZE } from "@/lib/config/shop/pagination";

export default function FavoritesPage() {
  return (
    <Suspense fallback={<FavoritesLoading items={FAVORITES_PAGE_SIZE} />}>
      <FavoritesClient />
    </Suspense>
  );
}
