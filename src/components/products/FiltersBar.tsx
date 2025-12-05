"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";

const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["black", "white"];

type SortOption = "newest" | "price_asc" | "price_desc" | undefined;

type FiltersBarProps = {
  selectedSizes?: string[];
  selectedColors?: string[];
};

export function FiltersBar({
  selectedSizes = [],
  selectedColors = [],
}: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortParam = searchParams.get("sort") as SortOption;
  const selectedSort: SortOption = sortParam || "newest";

  const updateFilter = (type: "size" | "color", value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(type);
    } else {
      const current = searchParams.getAll(type);
      let next: string[];

      if (current.includes(value)) {
        next = current.filter((v) => v !== value);
      } else {
        next = [...current, value];
      }

      params.delete(type);
      next.forEach((v) => params.append(type, v));
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
  };

  const updateSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    params.delete("page");

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
  };

  const chipBase =
    "inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition cursor-pointer";

  const chipActive = "border-black bg-black text-white shadow-sm";
  const chipInactive =
    "border-zinc-300 bg-white text-zinc-900 hover:border-black hover:bg-zinc-50";

  return (
    <div className="mt-6 flex flex-col gap-4 border-b border-zinc-200 pb-4 md:flex-row md:items-center md:justify-between">
      {/* LEWA STRONA: Size + Colour (stack na mobile, row od md) */}
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
        {/* 🔹 Size */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Size
          </span>

          <button
            type="button"
            onClick={() => updateFilter("size", undefined)}
            className={`${chipBase} ${
              selectedSizes.length === 0 ? chipActive : chipInactive
            }`}
          >
            All
          </button>

          {SIZES.map((size) => {
            const active = selectedSizes.includes(size);
            return (
              <button
                type="button"
                key={size}
                onClick={() => updateFilter("size", size)}
                className={`${chipBase} ${active ? chipActive : chipInactive}`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* 🔹 Colour */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Colour
          </span>

          <button
            type="button"
            onClick={() => updateFilter("color", undefined)}
            className={`${chipBase} ${
              selectedColors.length === 0 ? chipActive : chipInactive
            }`}
          >
            All
          </button>

          {COLORS.map((color) => {
            const active = selectedColors.includes(color);
            return (
              <button
                type="button"
                key={color}
                onClick={() => updateFilter("color", color)}
                className={`${chipBase} capitalize ${
                  active ? chipActive : chipInactive
                }`}
              >
                <span
                  className="mr-2 h-3 w-3 rounded-full border border-zinc-300"
                  style={{backgroundColor: color}}
                />
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRAWA STRONA: Sort by (od md idzie na prawo przez justify-between) */}
      <div className="flex items-center gap-2 md:ml-auto">
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-500 whitespace-nowrap">
          Sort by
        </span>

        <div className="relative">
          <select
            value={selectedSort ?? "newest"}
            onChange={(e) =>
              updateSort(e.target.value as "newest" | "price_asc" | "price_desc")
            }
            className="
              h-9 rounded-full border border-zinc-300 bg-white
              px-4 pr-8 text-xs font-medium text-zinc-900 cursor-pointer
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-black/10
              appearance-none
            "
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price, low to high</option>
            <option value="price_desc">Price, high to low</option>
          </select>

          <span
            className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-zinc-500"
            aria-hidden="true"
          >
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}
