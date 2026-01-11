// src/lib/utils/shared/parsers/product.ts

import { ProductCategory, ProductStatus, ShopGender } from "../../../../types/(shop)/product";

export const toUpper = (v: unknown) =>
  typeof v === "string" ? v.trim().toUpperCase() : "";

export const toLower = (v: unknown) =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

export const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export const toNumber = (v: unknown): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// ✅ mapowanie requestów typu "MENS" -> "mens"
export function parseGender(v: unknown): ShopGender | undefined {
  const g = toUpper(v);
  if (g === "MENS") return "mens";
  if (g === "WOMENS") return "womens";
  if (g === "KIDS") return "kids";
  return undefined;
}

export function parseCategory(v: unknown): ProductCategory | undefined {
  const c = toUpper(v);
  if (c === "TSHIRT" || c === "HOODIE") return c;
  return undefined;
}

export function parseStatus(v: unknown): ProductStatus | undefined {
  const s = toUpper(v);
  if (s === "ACTIVE" || s === "HIDDEN") return s;
  return undefined;
}
