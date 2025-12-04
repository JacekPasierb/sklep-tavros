"use client";
import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import { CartItem } from "../types/cart";


type Entry = CartItem & {addedAt: number; key: string};

type State = {
  items: Record<string, Entry>;
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  update: (key: string, qty: number) => void;
  clear: () => void;
  getItems: () => (CartItem & {key: string})[];
  getSubtotal: () => number;
  getTotalItems: () => number;
};

const makeKey = (p: {_id: string; size?: string}) =>
  `${p._id}_${p.size || "nosize"}`;

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      items: {},

      add: (item) => {
        const key = makeKey(item);
        const state = get();
        const existing = state.items[key];

        if (existing) {
          state.update(key, existing.qty + item.qty);
        } else {
          set({
            items: {
              ...state.items,
              [key]: {...item, addedAt: Date.now(), key},
            },
          });
        }
      },

      remove: (key) => {
        const next = {...get().items};
        delete next[key];
        set({items: next});
      },

      update: (key, qty) => {
        if (qty <= 0) return get().remove(key);
        const next = {...get().items};
        if (next[key]) {
          next[key] = {...next[key], qty};
          set({items: next});
        }
      },

      clear: () => set({items: {}}),

      getItems: () =>
        Object.entries(get().items).map(([k, it]) => ({
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
