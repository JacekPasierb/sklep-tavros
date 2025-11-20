//Nowy
// lib/productsService.ts
import Product from "../models/Product";
import {connectToDatabase} from "./mongodb";

type SortOption = "newest" | "price_asc" | "price_desc" | undefined;

type GetProductsOptions = {
  gender?: "mens" | "womens";
  mode?: "all" | "bestseller" | "collection";
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

  const query: any = {};

  if (gender) {
    query.gender = gender.toUpperCase();
  }

  if (mode === "bestseller") {
    query.isBestseller = true;
  }

  if (mode === "collection" && collectionSlug) {
    query.collectionSlug = collectionSlug;
  }

  if ((sizes && sizes.length) || (colors && colors.length)) {
    const variantMatch: any = {};

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
       sortQuery = { price: 1 };
       break;
     case "price_desc":
       sortQuery = { price: -1 };
       break;
     case "newest":
     default:
       sortQuery = { createdAt: -1 }; // najnowsze
       break;
   }

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortQuery) // możesz zmienić sortowanie
    .skip(skip)
    .limit(safeLimit)
    .lean();
  // console.log("Pro", products);

  const items = products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}


export async function getProductBySlug(slug: string) {
  await connectToDatabase();

  const doc = await Product.findOne({ slug }).lean();

  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
  };
}