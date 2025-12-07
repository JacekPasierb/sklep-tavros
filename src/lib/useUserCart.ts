"use client";

import useSWR from "swr";
import {CartItem} from "../types/cart";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Typy dla surowej odpowiedzi z API /api/cart
type PopulatedProduct = {
  _id: string;
  slug?: string;
  title?: string;
  price?: number;
  currency?: string;
  images?: string[];
  heroImage?: string;
  sku?: string;
};

type CartApiEntry = {
  product: string | PopulatedProduct;
  qty: number;
  size?: string | null;
  color?: string | null;
  sku?: string | null;
  addedAt?: string | Date;
};

export function useUserCart(enabled: boolean = true) {
  const {data, isLoading, mutate} = useSWR(
    enabled ? "/api/cart" : null, // jeśli enabled = false → brak requestu
    enabled ? fetcher : null,
    {revalidateOnFocus: false}
  );

  const raw: CartApiEntry[] = enabled ? data?.cart ?? [] : [];

  // 🔁 MAPOWANIE odpowiedzi z API → CartItem[]
  const mapped: CartItem[] = raw.map((entry: CartApiEntry) => {
    const prod =
      entry.product && typeof entry.product === "object" ? entry.product : null;

    const productId = prod ? String(prod._id) : String(entry.product);
    const imagesArray = prod?.images ?? [];
const imageSrc = imagesArray[0];

    
    return {
      key: `${productId}_${entry.size || "nosize"}_${entry.color || "nocolor"}`,
      productId,
      slug: prod?.slug ?? "",
      title: prod?.title ?? "",
      price: prod?.price ?? 0,
      currency: prod?.currency,
      image: imageSrc || prod?.heroImage || undefined, // UWAGA: używamy || i NIE dajemy ""
      images: imagesArray,
      heroImage: prod?.heroImage,
      qty: entry.qty ?? 1,
      size: entry.size ?? undefined,
      color: entry.color ?? undefined,
      sku: entry.sku ?? prod?.sku,
    };
  });

  // --- GRUPOWANIE: łączymy ten sam wariant produktu ---
  const grouped: Record<string, CartItem> = {};

  for (const item of mapped) {
    const existing = grouped[item.key];
    if (!existing) {
      grouped[item.key] = {...item};
    } else {
      grouped[item.key] = {
        ...existing,
        qty: existing.qty + item.qty, // SUMUJEMY ilość
      };
    }
  }

  const cart: CartItem[] = Object.values(grouped);
  // ADD
  async function addItem(payload: {
    productId: string;
    size?: string;
    color?: string;
    qty?: number;
  }) {
    if (!enabled) return; // dla gościa nic nie rób
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    mutate();
  }

  // UPDATE QTY
  async function updateQty(payload: {
    productId: string;
    size?: string;
    color?: string;
    qty: number;
  }) {
    if (!enabled) return;
    await fetch("/api/cart", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    mutate();
  }

  // REMOVE
  async function removeItem(payload: {
    productId: string;
    size?: string;
    color?: string;
  }) {
    if (!enabled) return;
    await fetch("/api/cart", {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
    mutate();
  }

  return {
    cart,
    addItem,
    updateQty,
    removeItem,
    isLoading,
  };
}
