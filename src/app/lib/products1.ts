// lib/products.ts

import Product from "../models/Product";
import { connectToDatabase } from "./mongodb";



type ProductVariant = {
  size: string;
  sku: string;
  stock: number;
  color?: string;
};

type ProductDocument = {
  _id: unknown;
  title: string;
  price: number;
  currency?: string;
  images?: string[];
  variants?: ProductVariant[];
  gender: string;
  collectionSlug?: string;
  slug: string;
};

type RelatedProductDocument = {
  _id: unknown;
  title: string;
  price: number;
  images?: string[];
  slug: string;
  gender: string;
  collectionSlug?: string;
};

function toPlain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getProductBySlug(slug: string): Promise<ProductDocument | null> {
  await connectToDatabase();

  const doc = await Product.findOne({slug})
    .select("title price images variants gender collectionSlug slug currency")
    .lean();

  return doc ? (toPlain(doc) as unknown as ProductDocument) : null;
}

export async function getRelatedProducts(opts: {
  gender: string;
  collectionSlug?: string;
  excludeId?: string;
  limit?: number;
}): Promise<RelatedProductDocument[]> {
  const {gender, collectionSlug, excludeId, limit = 4} = opts;

  await connectToDatabase();

  const where: {gender: string; collectionSlug?: string; _id?: {$ne: string}} = {gender};

  if (collectionSlug) {
    where.collectionSlug = collectionSlug;
  }

  if (excludeId) {
    where._id = {$ne: excludeId};
  }

  const docs = await Product.find(where)
    .sort({createdAt: -1})
    .limit(limit)
    .select("title price images slug gender collectionSlug")
    .lean();

  return (toPlain(docs) as unknown as RelatedProductDocument[]);
}
