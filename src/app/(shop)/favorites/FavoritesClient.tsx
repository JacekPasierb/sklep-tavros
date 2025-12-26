"use client";

import {useCallback, useEffect, useMemo} from "react";
import {useSession} from "next-auth/react";
import useSWR from "swr";
import {useRouter, useSearchParams} from "next/navigation";

import {useUserFavorites} from "../../../lib/hooks/useUserFavorites";
import {useFavoritesStore} from "../../../store/favoritesStore";

import {TypeProduct} from "../../../types/product";
import ProductCard from "../../../components/products/ProductCard";
import {Pagination} from "../../../components/products/Pagination";
import {isCustomerSession} from "../../../lib/utils/isCustomer";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export default function FavoritesClient() {
  const {data: session, status} = useSession();
  const isCustomer = isCustomerSession(session, status);

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageSize = 8;
  const pageParam = searchParams.get("page");
  const currentPage =
    typeof pageParam === "string" && !Number.isNaN(Number(pageParam))
      ? Math.max(1, Number(pageParam))
      : 1;

  const {
    products: userProducts,
    remove: removeServer,
    isLoading: userLoading,
  } = useUserFavorites(isCustomer);

  const favoritesMap = useFavoritesStore((s) => s.favorites);
  const guestIds = useMemo(() => Object.keys(favoritesMap), [favoritesMap]);

  const removeGuest = useFavoritesStore((s) => s.remove);
  const clearGuest = useFavoritesStore((s) => s.clear);

  const guestKey =
    !isCustomer && guestIds.length
      ? `/api/products?ids=${encodeURIComponent(guestIds.join(","))}`
      : null;

  const {data: guestData, isLoading: guestLoading} = useSWR(guestKey, fetcher, {
    revalidateOnFocus: false,
  });

  const loading =
    status === "loading" || (isCustomer ? userLoading : guestLoading);

  const products: TypeProduct[] = useMemo(() => {
    if (isCustomer) return (userProducts as TypeProduct[]) ?? [];
    return (guestData?.data as TypeProduct[]) ?? [];
  }, [isCustomer, userProducts, guestData?.data]);

  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage, pageSize]);

  useEffect(() => {
    if (totalItems === 0) return;
    if (currentPage <= totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    if (totalPages <= 1) params.delete("page");
    else params.set("page", String(totalPages));

    const url = params.toString() ? `/favourites?${params}` : "/favourites";
    router.replace(url);
  }, [currentPage, totalPages, totalItems, router, searchParams]);

  const handleRemove = useCallback(
    async (id: string) => {
      if (isCustomer) await removeServer(id);
      else removeGuest(id);
      router.refresh();
    },
    [isCustomer, removeServer, removeGuest, router]
  );

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <p className="text-center text-sm text-zinc-500">Loading…</p>
      </section>
    );
  }

  const basePath = "/favourites";

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="text-center py-4">
        <h1 className="mb-6 text-2xl font-semibold">MY WISHLIST</h1>
        <p className="text-sm text-zinc-600">
          Saved products:{" "}
          <span className="font-medium text-zinc-900">{totalItems}</span>
        </p>
      </div>

      {!isCustomer && (
        <div className="mt-4 mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-left sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            Your favourites are saved only in this browser. Create a free Tavros
            account to keep your wishlist across all devices.
          </p>

          {guestIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearGuest();
                router.replace(basePath);
              }}
              className="mt-3 inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50 sm:mt-0"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {totalItems === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center shadow-sm">
          <h3 className="mb-2 text-lg font-semibold text-zinc-800">
            Your wishlist is empty 🖤
          </h3>
          <p className="mx-auto mb-6 max-w-md text-sm text-zinc-600">
            Browse our collections and tap the heart icon to start saving the
            pieces you love.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-black/90"
          >
            Discover products
          </button>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mt-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                showHeart={false}
                onRemoved={handleRemove}
              />
            ))}
          </section>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500">
                Wyświetlane {(currentPage - 1) * pageSize + 1}–{" "}
                {Math.min(currentPage * pageSize, totalItems)} z {totalItems}{" "}
                produktów
              </p>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </section>
  );
}
