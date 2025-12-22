//Nowy
// lib/productsService.ts
import {SortOption} from "../types/filters";
import {TypeProduct} from "../types/product";

import Product from "../models/Product";
import {connectToDatabase} from "./mongodb";
import {Types} from "mongoose";

type GetProductsOptions = {
  gender?: "mens" | "womens" | "kids";
  mode?: "all" | "bestseller" | "collection" | "sale" | "new";
  collectionSlug?: string;
  sizes?: string[];
  colors?: string[];
  page?: number;
  limit?: number;
  sort?: SortOption;
};

export async function getProducts(options: GetProductsOptions = {}) {
  await connectToDatabase();

  const {
    gender,
    mode = "all",
    collectionSlug,
    sizes,
    colors,
    page = 1,
    limit = 12,
    sort,
  } = options;

  const query: Record<string, unknown> = {};

  if (gender) {
    query.gender = gender.toUpperCase();
  }

  if (mode === "bestseller") {
    query.isBestseller = true;
  }

  if (mode === "sale") {
    query.tags = {$in: ["sale"]};
  }

  if (mode === "new") {
    query.tags = {$in: ["new"]};
  }

  if (mode === "collection" && collectionSlug) {
    query.collectionSlug = collectionSlug;
  }

  if ((sizes && sizes.length) || (colors && colors.length)) {
    const variantMatch: Record<string, unknown> = {};

    if (sizes && sizes.length) {
      variantMatch.size = {$in: sizes};
    }

    if (colors && colors.length) {
      variantMatch.color = {$in: colors};
    }

    query.variants = {$elemMatch: variantMatch};
  }

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 12;

  const skip = (safePage - 1) * safeLimit;

  // 🔹 sortowanie
  let sortQuery: Record<string, 1 | -1>;

  switch (sort) {
    case "price_asc":
      sortQuery = {price: 1};
      break;
    case "price_desc":
      sortQuery = {price: -1};
      break;
    case "newest":
    default:
      sortQuery = {createdAt: -1}; // najnowsze
      break;
  }

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortQuery) // możesz zmienić sortowanie
    .skip(skip)
    .limit(safeLimit)
    .lean();

  const items = products.map((p) => ({
    ...p,
    _id: (p._id as {toString(): string}).toString(),
  })) as unknown as TypeProduct[];

  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}

type MongoId = Types.ObjectId | string;

type LeanProduct = Omit<TypeProduct, "_id"> & {_id: MongoId};

function normalizeProduct(doc: LeanProduct): TypeProduct {
  return {
    ...doc,
    _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
  };
}

export async function getProductBySlug(
  slug: string
): Promise<TypeProduct | null> {
  await connectToDatabase();

  const doc = await Product.findOne({slug})
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
        // ✅ opis
        "summary",
        "sections",
        "styleCode",
        "deliveryReturns",
      ].join(" ")
    )
    .lean<LeanProduct>();

  if (!doc) return null;

  return {
    ...doc,
    _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
  };
}

export async function getRelatedProducts(opts: {
  gender: "MENS" | "WOMENS" | "UNISEX" | "KIDS";
  collectionSlug?: string;
  excludeId?: string;
  limit?: number;
}): Promise<TypeProduct[]> {
  const {gender, collectionSlug, excludeId, limit = 4} = opts;

  await connectToDatabase();

  const where: Record<string, unknown> = {gender};
  if (collectionSlug) where.collectionSlug = collectionSlug;
  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    where._id = {$ne: new Types.ObjectId(excludeId)};
  }

  const docs = await Product.find(where)
    .sort({createdAt: -1})
    .limit(limit)
    .select(
      "title price images slug gender collectionSlug currency tags oldPrice"
    )
    .lean<LeanProduct[]>();

  return docs.map(normalizeProduct);
}
