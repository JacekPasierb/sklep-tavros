import { Types } from "mongoose";

import type { ProductGender, TypeProduct } from "../../../types/product";

import type { GetProductsOptions, ProductsResult } from "../../../types/shop/products";

import { connectToDatabase } from "../../mongodb";
import Product from "../../../models/Product";

// ✅ helpery z utils
import { normalizeProduct, type LeanProduct } from "../../utils/shop/products/mongo";
import { parsePaging } from "../../utils/shop/products/paging";
import { buildSort } from "../../utils/shop/products/sort";
import { buildProductsWhere } from "../../utils/shop/products/where";
import { normalizeSizes, normalizeColors } from "../../utils/shop/products/filters";

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductsResult<TypeProduct>> {
  await connectToDatabase();

  const { page, limit, sort } = options;

  const where = buildProductsWhere(options);
  const sortQuery = buildSort(sort);

  const { safePage, safeLimit, skip } = parsePaging(page, limit);

  const total = await Product.countDocuments(where);

  const docs = await Product.find(where)
    .sort(sortQuery)
    .skip(skip)
    .limit(safeLimit)
    .lean<LeanProduct[]>();

  const items = docs.map(normalizeProduct);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return { items, total, page: safePage, limit: safeLimit, totalPages };
}

export async function getProductBySlug(slug: string): Promise<TypeProduct | null> {
  await connectToDatabase();

  const doc = await Product.findOne({ slug, status: "ACTIVE" })
    .select(
      [
        "title",
        "slug",
        "price",
        "oldPrice",
        "currency",
        "images",
        "gender",
        "collectionSlug",
        "tags",
        "variants",
        "summary",
        "sections",
        "styleCode",
        "deliveryReturns",
      ].join(" ")
    )
    .lean<LeanProduct>();

  if (!doc) return null;
  return normalizeProduct(doc);
}

export async function getRelatedProducts(opts: {
  gender: ProductGender;
  collectionSlug?: string;
  excludeId?: string;
  limit?: number;
}): Promise<TypeProduct[]> {
  const { gender, collectionSlug, excludeId, limit = 4 } = opts;

  await connectToDatabase();

  const where: Record<string, unknown> = { gender, status: "ACTIVE" };
  if (collectionSlug) where.collectionSlug = collectionSlug;
  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    where._id = { $ne: new Types.ObjectId(excludeId) };
  }

  const docs = await Product.find(where)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title price images slug gender collectionSlug currency tags oldPrice")
    .lean<LeanProduct[]>();

  return docs.map(normalizeProduct);
}

/**
 * ✅ Jeśli chcesz filtry z bazy “bez kurczenia”
 * (dla danego widoku: gender + mode + collectionSlug)
 */
export type ProductsFiltersResult = {
  sizes: string[];
  colors: string[];
};

export async function getAvailableProductFilters(opts: Pick<GetProductsOptions, "gender" | "mode" | "collectionSlug">)
: Promise<ProductsFiltersResult> {
  await connectToDatabase();

  // bazowe where BEZ sizes/colors
  const baseWhere = buildProductsWhere({
    gender: opts.gender,
    mode: opts.mode ?? "all",
    collectionSlug: opts.collectionSlug,
  });

  const rows = await Product.aggregate([
    { $match: baseWhere },
    { $unwind: "$variants" },
    { $match: { "variants.stock": { $gt: 0 } } },
    {
      $group: {
        _id: null,
        sizes: { $addToSet: "$variants.size" },
        colors: { $addToSet: "$variants.color" },
      },
    },
  ]);

  const first = rows?.[0] ?? { sizes: [], colors: [] };

  return {
    sizes: normalizeSizes(first.sizes),
    colors: normalizeColors(first.colors),
  };
}
