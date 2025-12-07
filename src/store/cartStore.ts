// store/cartStore.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "../types/cart";

type Entry = CartItem & { addedAt: number; key: string };

type State = {
  items: Record<string, Entry>;

  add: (item: CartItem) => void;
  remove: (key: string) => void;
  update: (key: string, qty: number) => void;
  clear: () => void;

  getItems: () => (CartItem & { key: string })[];
  getSubtotal: () => number;
  getTotalItems: () => number;
};

// klucz wariantu w koszyku gościa
const makeKey = (p: { productId: string; size?: string; color?: string }) =>
  `${p.productId}_${p.size || "nosize"}_${p.color || "nocolor"}`;

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      items: {},

      add: (item) => {
        const key = makeKey(item);
        const state = get();
        const existing = state.items[key];

        if (existing) {
          // zwiększamy ilość
          const newQty = existing.qty + item.qty;
          set({
            items: {
              ...state.items,
              [key]: { ...existing, qty: newQty },
            },
          });
        } else {
          // nowy wpis
          set({
            items: {
              ...state.items,
              [key]: {
                ...item,
                key,
                addedAt: Date.now(),
              },
            },
          });
        }
      },

      remove: (key) => {
        const next = { ...get().items };
        delete next[key];
        set({ items: next });
      },

      update: (key, qty) => {
        if (qty <= 0) return get().remove(key);

        const current = get().items;
        const entry = current[key];
        if (!entry) return;

        set({
          items: {
            ...current,
            [key]: { ...entry, qty },
          },
        });
      },

      clear: () => set({ items: {} }),

      getItems: () =>
        Object.entries(get().items)
          .sort(([, a], [, b]) => b.addedAt - a.addedAt)
          .map(([k, it]) => ({
            ...it,
            key: it.key ?? k,
            image:
              it.image ||
              (Array.isArray(it.images) ? it.images[0] : undefined) ||
              it.heroImage ||
              "",
          })),

      getSubtotal: () =>
        get()
          .getItems()
          .reduce((sum, item) => sum + item.price * item.qty, 0),

      getTotalItems: () =>
        get()
          .getItems()
          .reduce((sum, item) => sum + item.qty, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
