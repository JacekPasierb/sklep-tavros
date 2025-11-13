// components/FiltersBar.tsx
"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];
const AVAILABLE_COLORS = ["black", "white", "blue", "red"];

function toggleInArray(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function FiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const currentSizes = (sp.get("sizes") || "").split(",").filter(Boolean);
  const currentColors = (sp.get("colors") || "").split(",").filter(Boolean);
  const inStock = sp.get("inStock") === "true";

  const updateFilters = (opts: {
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
  }) => {
    const params = new URLSearchParams(sp.toString());

    if (opts.sizes) {
      if (opts.sizes.length) params.set("sizes", opts.sizes.join(","));
      else params.delete("sizes");
    }
    if (opts.colors) {
      if (opts.colors.length) params.set("colors", opts.colors.join(","));
      else params.delete("colors");
    }
    if (typeof opts.inStock === "boolean") {
      if (opts.inStock) params.set("inStock", "true");
      else params.delete("inStock");
    }

    // przy zmianie filtra resetujemy na page 1
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-4">
      {/* Rozmiary */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="mr-2 font-medium">Size:</span>
        {AVAILABLE_SIZES.map((size) => {
          const active = currentSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() =>
                updateFilters({sizes: toggleInArray(currentSizes, size)})
              }
              className={`rounded-full border px-3 py-1 ${
                active
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Kolory */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="mr-2 font-medium">Color:</span>
        {AVAILABLE_COLORS.map((color) => {
          const active = currentColors.includes(color);
          return (
            <button
              key={color}
              type="button"
              onClick={() =>
                updateFilters({colors: toggleInArray(currentColors, color)})
              }
              className={`rounded-full border px-3 py-1 capitalize ${
                active
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
              }`}
            >
              {color}
            </button>
          );
        })}
      </div>

      {/* Tylko dostępne */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => updateFilters({inStock: e.target.checked})}
        />
        <span>Only in stock</span>
      </label>
    </div>
  );
}
