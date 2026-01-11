

import { ProductCategory } from "../../../../types/(shop)/product";
import { ColorRow, SectionInput, Size, SIZES } from "../../../../types/admin/productForm";

import { emptyColorRow } from "./formDefaults";
import { normalizeColor, safeIntStock } from "./formText";

// variants -> rows
export const variantsToColorRows = (
  variants: Array<{ sku?: string; size?: string; color?: string; stock?: number }>,
  fallbackCategory: ProductCategory
): ColorRow[] => {
  const byColor = new Map<string, ColorRow>();

  for (const v of variants ?? []) {
    const color = normalizeColor(typeof v.color === "string" ? v.color : "");
    if (!color) continue;

    const size = (typeof v.size === "string" ? v.size : "")
      .trim()
      .toUpperCase() as Size;
    if (!SIZES.includes(size)) continue;

    const stock = Number.isFinite(Number(v.stock))
      ? Math.max(0, Math.floor(Number(v.stock)))
      : 0;

    if (!byColor.has(color)) {
      byColor.set(color, {
        color,
        skuPrefix: `TVR-${fallbackCategory}-${color.toUpperCase().slice(0, 3)}`,
        stockBySize: SIZES.reduce((acc, s) => {
          acc[s] = "0";
          return acc;
        }, {} as Record<Size, string>),
      });
    }

    const row = byColor.get(color)!;
    row.stockBySize[size] = String(stock);

    if (!row.skuPrefix && typeof v.sku === "string" && v.sku.includes("-")) {
      row.skuPrefix = v.sku.split("-").slice(0, -1).join("-");
    }
  }

  const rows = Array.from(byColor.values());
  return rows.length ? rows : [emptyColorRow()];
};

// sections
export const sectionsToInputs = (
  sections?: Array<{ title: string; items: string[] }>
): SectionInput[] => {
  if (!Array.isArray(sections) || sections.length === 0) {
    return [{ title: "Details", itemsText: "" }];
  }
  return sections.map((s) => ({
    title: s?.title ?? "",
    itemsText: Array.isArray(s?.items) ? s.items.join("\n") : "",
  }));
};

export const normalizeSections = (sections: SectionInput[]) =>
  sections
    .map((s) => ({
      title: s.title.trim(),
      items: s.itemsText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    }))
    .filter((s) => s.title && s.items.length > 0);

// rows -> variants
export const buildVariants = (colorRows: ColorRow[]) => {
  const rows = colorRows
    .map((r) => ({
      color: normalizeColor(r.color),
      skuPrefix: (r.skuPrefix ?? "").trim(),
      stockBySize: r.stockBySize,
    }))
    .filter((r) => r.color.length > 0);

  const seen = new Set<string>();
  const uniqueRows = rows.filter((r) => {
    if (seen.has(r.color)) return false;
    seen.add(r.color);
    return true;
  });

  return uniqueRows.flatMap((r) =>
    SIZES.map((size) => {
      const stock = safeIntStock(r.stockBySize[size]);
      const sku = r.skuPrefix ? `${r.skuPrefix}-${size}` : "";
      return { sku, size, color: r.color, stock };
    })
  );
};

export type ProductTagFlags = {
  tagNew?: boolean;
  tagSale?: boolean;
  tagBestseller?: boolean;
};

export function buildTags(flags: ProductTagFlags): string[] {
  const tags: string[] = [];

  if (flags.tagNew) tags.push("new");
  if (flags.tagSale) tags.push("sale");
  if (flags.tagBestseller) tags.push("bestseller");

  return tags;
}