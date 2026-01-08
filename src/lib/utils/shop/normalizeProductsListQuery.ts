import {
  ProductsListQuery,
  ProductsListSearchParams,
  ProductsSort,
} from "../../../types/shop/productsList";
import { parsePositiveInt } from "../shared/number";


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
  const pageValue = typeof sp.page === 'string' 
    ? sp.page 
    : Array.isArray(sp.page) 
    ? sp.page[0] 
    : undefined;
  
  return {
    page: parsePositiveInt(pageValue, 1),
    sizes: normalizeSizes(sp.size),
    colors: toStringArray(sp.color),
    sort: parseSort(sp.sort),
  };
}
