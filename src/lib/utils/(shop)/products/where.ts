import { GetProductsOptions } from "@/types/(shop)/product";


export const buildProductsWhere=(opts: GetProductsOptions): Record<string, unknown> =>{
  const { gender, mode = "all", collectionSlug, sizes, colors } = opts;

  const where: Record<string, unknown> = { status: "ACTIVE" };

  if (gender) where.gender = gender;

  if (mode === "bestseller") where.tags = { $in: ["bestseller"] };
  if (mode === "sale") where.tags = { $in: ["sale"] };
  if (mode === "new") where.tags = { $in: ["new"] };

  if (mode === "collection" && collectionSlug) where.collectionSlug = collectionSlug;

  if ((sizes && sizes.length) || (colors && colors.length)) {
    const variantMatch: Record<string, unknown> = { stock: { $gt: 0 } };

    if (sizes?.length) variantMatch.size = { $in: sizes.map((s) => s.toUpperCase()) };
    if (colors?.length) variantMatch.color = { $in: colors };

    where.variants = { $elemMatch: variantMatch };
  }

  return where;
}
