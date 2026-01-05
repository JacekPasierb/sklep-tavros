// src/lib/utils/admin/products/stock.ts

import { AdminProductVariantRow, StockFilter } from "../../../../types/admin/products";


export const getStockStatus = (variants: AdminProductVariantRow[]): StockFilter => {
  if (!variants.length) return "";

  const stocks = variants.map((v) => Math.max(0, Number(v.stock ?? 0)));

  if (stocks.every((s) => s === 0)) return "OUT";
  if (stocks.some((s) => s < 5)) return "LOW";
  return "GOOD";
};

export const getStockBadgeClass = (status: StockFilter) => {
  switch (status) {
    case "OUT":
      return "bg-red-100 text-red-700";
    case "LOW":
      return "bg-amber-100 text-amber-700";
    case "GOOD":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
};
