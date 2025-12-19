// lib/useUserFavorites.ts
"use client";
import useSWR from "swr";

type FavoriteProduct = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  currency?: string;
  images?: string[];
  collectionSlug?: string;
};

type FavoritesResponse = {
  ok: boolean;
  data: FavoriteProduct[];
  count: number;
};

const fetcher = async (url: string): Promise<FavoritesResponse> => {
  const res = await fetch(url);

  // jeśli backend zwróci 401 (np. brak sesji) → traktujemy jak pustą listę
  if (res.status === 401) {
    return { ok: true, data: [], count: 0 };
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};

export function useUserFavorites(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<FavoritesResponse>(
    enabled ? "/api/favorites" : null,   // jeśli !enabled → brak requestu
    enabled ? fetcher : null,
    { revalidateOnFocus: false }
  );

  const products = data?.data ?? [];
  const ids = new Set(products.map((p) => p._id));

  async function add(productId: string) {
    if (!enabled) return; // na wszelki wypadek

    // optymistyczny update
    mutate(
      (prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.some((p) => p._id === productId)
                ? prev.data
                : [{ _id: productId } as FavoriteProduct, ...prev.data],
              count: prev.count + 1,
            }
          : prev,
      false
    );

    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (!res.ok) {
      mutate(); // rollback
      throw new Error("POST /api/favorites failed");
    }

    mutate(); // dociągamy pełne dane
  }

  async function remove(productId: string) {
    if (!enabled) return;

    mutate(
      (prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((p) => p._id !== productId),
              count: Math.max(0, prev.count - 1),
            }
          : prev,
      false
    );

    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (!res.ok) {
      mutate(); // rollback
      throw new Error("DELETE /api/favorites failed");
    }

    mutate();
  }

  return { products, ids, isLoading, error, add, remove, mutate };
}
