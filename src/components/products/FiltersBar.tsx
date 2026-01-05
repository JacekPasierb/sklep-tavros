"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {SortOption} from "../../types/filters";

type Props = {
  availableSizes: string[];
  availableColors: string[];
  selectedSizes?: string[];
  selectedColors?: string[];
};

export function FiltersBar({
  availableSizes,
  availableColors,
  selectedSizes = [],
  selectedColors = [],
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortParam = searchParams.get("sort") as SortOption;
  const selectedSort: SortOption = sortParam || "newest";

  const pushParams = (params: URLSearchParams) => {
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const updateFilter = (type: "size" | "color", value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(type);
      pushParams(params);
      return;
    }

    const current = params.getAll(type);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    params.delete(type);
    next.forEach((v) => params.append(type, v));

    pushParams(params);
  };

  const updateSort = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "newest") params.delete("sort");
    else params.set("sort", value);

    pushParams(params);
  };

  /* --- STYLES --- */
  const chipBase =
    "inline-flex items-center justify-center rounded-full border transition whitespace-nowrap select-none";
  const chipSize =
    "px-3 py-1.5 text-[11px] tracking-[0.14em] font-medium md:px-3.5 md:py-1.5 md:text-xs md:tracking-wide";
  const chipActive = "border-black bg-black text-white shadow-sm";
  const chipInactive =
    "border-zinc-300 bg-white text-zinc-900 hover:border-black hover:bg-zinc-50";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
      {/* ================= LEFT: SIZE + COLOUR ================= */}
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4">
        {/* SIZE */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 shrink-0 md:text-xs md:tracking-[0.16em]">
            Size
          </span>

          <div className="flex-1 overflow-x-auto no-scrollbar md:overflow-visible">
            <div className="flex items-center gap-2 pr-2 md:flex-wrap md:pr-0">
              <button
                type="button"
                onClick={() => updateFilter("size", undefined)}
                className={`${chipBase} ${chipSize} ${
                  selectedSizes.length === 0 ? chipActive : chipInactive
                }`}
              >
                All
              </button>

              {availableSizes.map((size) => {
                const active = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateFilter("size", size)}
                    className={`${chipBase} ${chipSize} ${
                      active ? chipActive : chipInactive
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLOUR */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 shrink-0 md:text-xs md:tracking-[0.16em]">
            Colour
          </span>

          <div className="flex-1 overflow-x-auto no-scrollbar md:overflow-visible">
            <div className="flex items-center gap-2 pr-2 md:flex-wrap md:pr-0">
              <button
                type="button"
                onClick={() => updateFilter("color", undefined)}
                className={`${chipBase} ${chipSize} ${
                  selectedColors.length === 0 ? chipActive : chipInactive
                }`}
              >
                All
              </button>

              {availableColors.map((color) => {
                const active = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateFilter("color", color)}
                    className={`${chipBase} ${chipSize} ${
                      active ? chipActive : chipInactive
                    }`}
                  >
                    <span
                      className="mr-2 h-3 w-3 rounded-full border border-zinc-300"
                      style={{backgroundColor: color}}
                    />
                    <span className="capitalize">{color}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT: SORT ================= */}
      {/* MOBILE */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Sort
        </span>

        <div className="relative">
          <select
            value={selectedSort ?? "newest"}
            onChange={(e) => updateSort(e.target.value as SortOption)}
            className="
              h-8 rounded-full border border-zinc-300 bg-white
              px-3 pr-7 text-[12px] font-medium text-zinc-900
              shadow-sm appearance-none
            "
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-zinc-500">
            ▼
          </span>
        </div>
      </div>

      {/* DESKTOP – WYGLĄD JAK WCZEŚNIEJ */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-500 whitespace-nowrap">
          Sort by
        </span>

        <div className="relative">
          <select
            value={selectedSort ?? "newest"}
            onChange={(e) => updateSort(e.target.value as SortOption)}
            className="
              h-9 rounded-full border border-zinc-300 bg-white
              px-4 pr-8 text-xs font-medium text-zinc-900
              shadow-sm appearance-none
              focus:outline-none focus:ring-2 focus:ring-black/10
            "
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price, low to high</option>
            <option value="price_desc">Price, high to low</option>
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-zinc-500">
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}
