import { smartSortSizes } from "./smartSizeSort";


export const uniqSorted=(values: string[]) =>{
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }
  
  export const normalizeSizes=(values: unknown): string[]=> {
    const arr = Array.isArray(values) ? values : [];
    const cleaned = arr
      .map((v) => String(v ?? "").trim().toUpperCase())
      .filter(Boolean);
  
    const uniq = Array.from(new Set(cleaned));
    return smartSortSizes(uniq);
  }
  
  export const normalizeColors=(values: unknown[]): string[] =>{
    const out = values
      .filter((v): v is string => typeof v === "string")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.toLowerCase());
  
    return uniqSorted(out);
  }
  