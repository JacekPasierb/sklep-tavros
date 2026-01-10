// src/lib/utils/shared/normalizers/product.ts

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function getString(obj: UnknownRecord, key: string): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v.trim() : undefined;
}

function getBoolean(obj: UnknownRecord, key: string): boolean {
  return Boolean(obj[key]);
}

function getNumber(obj: UnknownRecord, key: string): number | undefined {
  const v = obj[key];
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

// ─────────────────────────────────────────────────────────────

export function normalizeTags(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim())
    .filter(Boolean);
}

// return type możesz dopasować do swojego modelu obrazków
export type NormalizedImage = {
  src: string;
  alt: string;
  primary: boolean;
};

export function normalizeImages(v: unknown): NormalizedImage[] {
  if (!Array.isArray(v)) return [];

  return v
    .map((x): NormalizedImage | null => {
      if (!isRecord(x)) return null;

      const src = getString(x, "src");
      if (!src) return null;

      const alt = getString(x, "alt") ?? "";
      const primary = getBoolean(x, "primary");

      return { src, alt, primary };
    })
    .filter((x): x is NormalizedImage => x !== null)
    .slice(0, 10);
}

export type NormalizedVariant = {
  sku: string;
  size: string;
  color: string;
  stock: number;
};

export function normalizeVariants(v: unknown): NormalizedVariant[] {
  if (!Array.isArray(v)) return [];

  return v
    .map((x): NormalizedVariant | null => {
      if (!isRecord(x)) return null;

      const sku = getString(x, "sku") ?? "";
      const sizeRaw = getString(x, "size");
      const colorRaw = getString(x, "color");

      const size = sizeRaw ? sizeRaw.toUpperCase() : "";
      const color = colorRaw ? colorRaw.toLowerCase() : "";

      const stock = getNumber(x, "stock");
      const safeStock =
        typeof stock === "number" ? Math.max(0, Math.floor(stock)) : 0;

      if (!size || !color) return null;

      return { sku, size, color, stock: safeStock };
    })
    .filter((x): x is NormalizedVariant => x !== null);
}

export type NormalizedSection = {
  title: string;
  items: string[];
};

export function normalizeSections(v: unknown): NormalizedSection[] {
  if (!Array.isArray(v)) return [];

  return v
    .map((s): NormalizedSection | null => {
      if (!isRecord(s)) return null;

      const title = getString(s, "title");
      if (!title) return null;

      const itemsRaw = s["items"];
      const items = Array.isArray(itemsRaw)
        ? itemsRaw
            .filter((it): it is string => typeof it === "string")
            .map((it) => it.trim())
            .filter(Boolean)
        : [];

      if (items.length === 0) return null;

      return { title, items };
    })
    .filter((x): x is NormalizedSection => x !== null);
}
