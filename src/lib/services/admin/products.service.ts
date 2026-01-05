import type {FilterQuery} from "mongoose";

import {
  AdminProductsQuery,
  AdminProductsResult,
  ProductDocForQuery,
  ProductRow,
} from "../../../types/admin/products";
import {connectToDatabase} from "../../mongodb";
import Product from "../../../models/Product";
import {toAdminListItem} from "../../mappers/admin/products.mapper";

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
    where.$and = [
      ...(where.$and ?? []),
      {variants: {$not: {$elemMatch: {stock: {$gt: 0}}}}},
    ];
  }

  if (query.stock === "LOW") {
    where.$and = [
      ...(where.$and ?? []),
      {variants: {$elemMatch: {stock: {$type: "number", $lt: 5}}}},
      {variants: {$elemMatch: {stock: {$type: "number", $gt: 0}}}},
    ];
  }

  if (query.stock === "GOOD") {
    where.$and = [
      ...(where.$and ?? []),
      {variants: {$not: {$elemMatch: {stock: {$type: "number", $lt: 5}}}}},
      {variants: {$elemMatch: {stock: {$type: "number", $gte: 5}}}},
    ];
  }

  return where;
};

const getAdminProducts = async (
  query: AdminProductsQuery
): Promise<AdminProductsResult> => {
  await connectToDatabase();

  const where = buildProductsWhere(query);

  const total = await Product.countDocuments(where);

  const limit = query.limit;
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(query.page, pages);
  const skip = (page - 1) * limit;

  const rows = await Product.find(where)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
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
    .lean<ProductRow[]>();

  return {products: rows.map(toAdminListItem), total, page, pages, limit};
};
export default getAdminProducts;
