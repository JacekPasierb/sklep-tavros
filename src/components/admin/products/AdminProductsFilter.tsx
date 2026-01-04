"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useMemo, useState} from "react";

type Props = {
  defaults?: {
    q?: string;
    status?: string;
    category?: string;
    gender?: string;
    collection?: string;
    stock?: string;
  };
};

export function AdminProductsFilters({defaults}: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo(() => {
    const get = (k: string) =>
      sp.get(k) ?? defaults?.[k as keyof Props["defaults"]] ?? "";
    return {
      q: get("q"),
      status: get("status"),
      category: get("category"),
      gender: get("gender"),
      collection: get("collection"),
      stock: get("stock"),
    };
  }, [sp, defaults]);

  const [q, setQ] = useState(initial.q);
  const [status, setStatus] = useState(initial.status);
  const [category, setCategory] = useState(initial.category);
  const [gender, setGender] = useState(initial.gender);
  const [collection, setCollection] = useState(initial.collection);
  const [stock, setStock] = useState(initial.stock);

  const apply = () => {
    const params = new URLSearchParams(sp.toString());

    const setOrDelete = (key: string, val: string) => {
      const v = val.trim();
      if (!v) params.delete(key);
      else params.set(key, v);
    };

    setOrDelete("q", q);
    setOrDelete("status", status);
    setOrDelete("category", category);
    setOrDelete("gender", gender);
    setOrDelete("collection", collection);
    setOrDelete("stock", stock);

    router.push(`/admin/products?${params.toString()}`);
  };

  const reset = () => router.push("/admin/products");

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Search
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title / styleCode / slug..."
            className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="HIDDEN">HIDDEN</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="TSHIRT">TSHIRT</option>
            <option value="HOODIE">HOODIE</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="mens">MENS</option>
            <option value="womens">WOMENS</option>
            <option value="kids">KIDS</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Collection
          </label>
          <input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            placeholder="e.g. christmas20"
            className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Stock
          </label>
          <select
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="OUT">OUT</option>
            <option value="LOW">LOW</option>
            <option value="GOOD">GOOD</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button
            type="button"
            onClick={apply}
            className="w-full rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
