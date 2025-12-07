"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useMemo } from "react";
import { useUserFavorites } from "../../../lib/useUserFavorites";
import { useFavoritesStore } from "../../../store/favoritesStore";
import { TypeProduct } from "../../../types/product";
import ProductCard from "../../../components/products/ProductCard";



const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export default function FavoritesPage() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  // -------- zalogowany: ulubione z Mongo przez API --------
  const {
    products: userProducts,
    remove: removeServer,
    isLoading: userLoading,
  } = useUserFavorites(isLoggedIn);

  // -------- gość: ulubione z Zustand + dociąganie szczegółów produktów --------
  const favoritesMap = useFavoritesStore((s) => s.favorites);
  const guestIds = useMemo(() => Object.keys(favoritesMap), [favoritesMap]);

  const removeGuest = useFavoritesStore((s) => s.remove);
  const clearGuest = useFavoritesStore((s) => s.clear);

  // jeśli nie jesteśmy zalogowani i mamy jakieś ID, dociągamy produkty z API
  const guestKey =
  !isLoggedIn && guestIds.length
    ? `/api/products?ids=${encodeURIComponent(guestIds.join(","))}` // ✅ TU
    : null;


  const { data: guestData, isLoading: guestLoading } = useSWR(
    guestKey,
    fetcher,
    { revalidateOnFocus: false }
  );

  // -------- wspólna lista produktów --------
  const loading =
    status === "loading" || (isLoggedIn ? userLoading : guestLoading);

  const products: TypeProduct[] = useMemo(() => {
    if (isLoggedIn) return (userProducts as TypeProduct[]) ?? [];
    return (guestData?.data as TypeProduct[]) ?? [];
  }, [isLoggedIn, userProducts, guestData?.data]);

  // usuwanie pojedynczego produktu z listy
  const handleRemove = async (id: string) => {
    if (isLoggedIn) {
      await removeServer(id);
    } else {
      removeGuest(id);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-center text-sm text-zinc-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold uppercase tracking-[0.2em]">
          My Wishlist
        </h1>
        <p className="text-sm text-zinc-500">
          Saved products: <span className="font-medium">{products.length}</span>
        </p>
      </header>

      {/* info dla gościa – zachęta do założenia konta */}
      {!isLoggedIn && (
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-left sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            Your favourites are saved only in this browser. Create a free
            Tavros account to keep your wishlist across all devices and never
            lose it.
          </p>
          {guestIds.length > 0 && (
            <button
              onClick={clearGuest}
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* pusty stan */}
      {products.length === 0 && (
        <section className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center shadow-sm">
          <h3 className="mb-2 text-lg font-semibold text-zinc-800">
            Your wishlist is empty 🖤
          </h3>
          <p className="mb-6 max-w-md text-sm text-zinc-600">
            Looks like you haven’t added any products to your favourites yet.
            Browse our collections and tap the heart icon to start saving the
            pieces you love.
          </p>
          {/* Możesz dodać button np. do /mens/all */}
          {/* <Link
            href="/mens/all"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-black/90"
          >
            Discover products
          </Link> */}
        </section>
      )}

      {/* lista produktów */}
      {products.length > 0 && (
        <section className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              // serduszko zostaje – po kliknięciu ProductCard wywoła onRemoved
              showHeart={false}
              onRemoved={handleRemove}
            />
          ))}
        </section>
      )}
    </main>
  );
}
