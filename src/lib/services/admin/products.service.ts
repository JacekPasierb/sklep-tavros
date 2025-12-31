import type {FilterQuery} from "mongoose";

import {
  AdminProductListItem,
  AdminProductsQuery,
  AdminProductsResult,
  ProductDocForQuery,
} from "../../../types/admin/products";
import {connectToDatabase} from "../../mongodb";
import Product from "../../../models/Product";

type ProductRow = {
  _id: unknown;
  title: string;
  slug: string;
  styleCode: string;
  price: number;
  currency?: string | null;
  gender?: string | null;
  status?: "ACTIVE" | "HIDDEN";
  category?: "TSHIRT" | "HOODIE";
  variants?: Array<{
    sku?: string;
    size?: string;
    color?: string;
    stock?: number;
  }>;
  collectionSlug?: string | null;
  createdAt: Date;
};

const buildProductsWhere = (
  query: AdminProductsQuery
): FilterQuery<ProductDocForQuery> => {
  const where: FilterQuery<ProductDocForQuery> = {};

  if (query.q) {
    where.$or = [
      {title: {$regex: query.q, $options: "i"}},
      {styleCode: {$regex: query.q, $options: "i"}},
      {slug: {$regex: query.q, $options: "i"}},
    ];
  }

  if (query.status) where.status = query.status;
  if (query.category) where.category = query.category;
  if (query.gender) where.gender = query.gender;
  if (query.collection) where.collectionSlug = query.collection;

  // Stock:
  // OUT: brak wariantu stock > 0
  // LOW: istnieje wariant stock < 5 oraz istnieje wariant stock > 0
  // GOOD: brak wariantu stock < 5 oraz istnieje wariant stock >= 5
  if (query.stock === "OUT") {
    where.variants = {$not: {$elemMatch: {stock: {$gt: 0}}}};
  }

  if (query.stock === "LOW") {
    where.$and = [
      ...(where.$and ?? []),
      {variants: {$elemMatch: {stock: {$lt: 5}}}},
      {variants: {$elemMatch: {stock: {$gt: 0}}}},
    ];
  }

  if (query.stock === "GOOD") {
    where.$and = [
      ...(where.$and ?? []),
      {variants: {$not: {$elemMatch: {stock: {$lt: 5}}}}},
      {variants: {$elemMatch: {stock: {$gte: 5}}}},
    ];
  }

  return where;
};

const toAdminListItem = (p: ProductRow): AdminProductListItem => {
  return {
    _id: String(p._id),
    title: p.title,
    slug: p.slug,
    styleCode: p.styleCode,
    price: p.price,
    currency: p.currency ?? "GBP",
    gender: p.gender ?? null,
    status: p.status ?? "ACTIVE",
    category: p.category,
    collectionSlug: p.collectionSlug ?? null,
    variants: Array.isArray(p.variants) ? p.variants : [],
    createdAt: p.createdAt.toISOString(),
  };
};

const getAdminProducts = async (
  query: AdminProductsQuery
): Promise<AdminProductsResult> => {
  await connectToDatabase();

  const where = buildProductsWhere(query);

  const rows = await Product.find(where)
    .sort({createdAt: -1})
    .select({
      title: 1,
      slug: 1,
      styleCode: 1,
      price: 1,
      currency: 1,
      gender: 1,
      status: 1,
      collectionSlug: 1,
      variants: 1,
      category: 1,
      createdAt: 1,
    })
    .limit(query.limit)
    .lean<ProductRow[]>();

  const products = rows.map(toAdminListItem);
  return {products, total: products.length};
};
export default getAdminProducts;
