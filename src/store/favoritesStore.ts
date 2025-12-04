// store/favoritesStore.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Entry = { id: string; addedAt: number };
type State = {
  favorites: Record<string, Entry>;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<State>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggle: (id) => {
        const next = { ...get().favorites };
        if (next[id]) delete next[id];
        else next[id] = { id, addedAt: Date.now() };
        set({ favorites: next });
      },
      remove: (id) => {
        const next = { ...get().favorites };
        delete next[id];
        set({ favorites: next });
      },
      clear: () => set({ favorites: {} }),
      isFavorite: (id) => Boolean(get().favorites[id]),
    }),
    { name: "favorites-storage", storage: createJSONStorage(() => localStorage) }
  )
);
