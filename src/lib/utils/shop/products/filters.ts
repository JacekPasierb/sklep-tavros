import { smartSortSizes } from "../smartSizeSort";

export function uniqSorted(values: string[]) {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }
  
  export function normalizeSizes(values: unknown): string[] {
    const arr = Array.isArray(values) ? values : [];
    const cleaned = arr
      .map((v) => String(v ?? "").trim().toUpperCase())
      .filter(Boolean);
  
    const uniq = Array.from(new Set(cleaned));
    return smartSortSizes(uniq);
  }
  
  export function normalizeColors(values: unknown[]): string[] {
    const out = values
      .filter((v): v is string => typeof v === "string")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.toLowerCase());
  
    return uniqSorted(out);
  }
  