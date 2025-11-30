"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";

const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["black", "silver", "gold"];

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
      // wyczyszczenie całego filtra (All)
      params.delete(type);
    } else {
      // aktualna lista z URL
      const current = searchParams.getAll(type); // np. ["M", "XL"]
      let next: string[];

      if (current.includes(value)) {
        // kliknięcie drugi raz -> odznacz
        next = current.filter((v) => v !== value);
      } else {
        // dodaj nową wartość
        next = [...current, value];
      }

      // czyścimy i wstawiamy wszystko od nowa
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
      // "najnowsze" traktujemy jako domyślne – bez parametru w URL
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // przy zmianie sortowania też resetujemy page
    params.delete("page");

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
  };

  return (
    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
      {/* 🔹 Rozmiary */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">Size:</span>
        <button
          type="button"
          onClick={() => updateFilter("size", undefined)}
          className={
            "px-3 py-1 text-sm border rounded-full transition " +
            (selectedSizes.length === 0
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-300")
          }
        >
          All
        </button>
        {SIZES.map((size) => (
          <button
            type="button"
            key={size}
            onClick={() => updateFilter("size", size)}
            className={
              "px-3 py-1 text-sm border rounded-full transition " +
              (selectedSizes.includes(size)
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black")
            }
          >
            {size}
          </button>
        ))}
      </div>

      {/* 🔹 Kolory */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">Color:</span>
        <button
          type="button"
          onClick={() => updateFilter("color", undefined)}
          className={
            "px-3 py-1 text-sm border rounded-full transition " +
            (selectedColors.length === 0
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-300")
          }
        >
          All
        </button>
        {COLORS.map((color) => (
          <button
            type="button"
            key={color}
            onClick={() => updateFilter("color", color)}
            className={
              "px-3 py-1 text-sm border rounded-full capitalize transition " +
              (selectedColors.includes(color)
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black")
            }
          >
            {color}
          </button>
        ))}
      </div>
      {/* 🔹 Sortowanie */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <select
          value={selectedSort ?? "newest"}
          onChange={(e) =>
            updateSort(e.target.value as "newest" | "price_asc" | "price_desc")
          }
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price, low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>
    </div>
  );
}
