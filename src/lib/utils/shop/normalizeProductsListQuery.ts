import {
  ProductsListQuery,
  ProductsListSearchParams,
  ProductsSort,
} from "../../../types/shop/productsList";

function parsePositiveInt(value: unknown, fallback: number) {
  const n = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const arr = value.filter((x): x is string => typeof x === "string");
    return arr.length ? arr : undefined;
  }
  if (typeof value === "string") return value.trim() ? [value] : undefined;
  return undefined;
}

function parseSort(value: unknown): ProductsSort | undefined {
  if (value === "newest" || value === "price_asc" || value === "price_desc") {
    return value;
  }
  return undefined;
}

function normalizeSizes(
  value: string | string[] | undefined
): string[] | undefined {
  const arr = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? [value]
    : [];
  const normalized = arr.map((x) => x.trim().toUpperCase()).filter(Boolean);

  return normalized.length ? Array.from(new Set(normalized)) : undefined;
}

export function normalizeProductsListQuery(
  sp: ProductsListSearchParams
): ProductsListQuery {
  return {
    page: parsePositiveInt(sp.page, 1),
    sizes: normalizeSizes(sp.size),
    colors: toStringArray(sp.color),
    sort: parseSort(sp.sort),
  };
}
