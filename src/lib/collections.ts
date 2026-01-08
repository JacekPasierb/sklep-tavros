import { connectToDatabase } from "./mongodb";
import Collection from "../models/Collection";
import type {  TypeCollection } from "../types/collection";
import { ShopGender } from "../types/shop/productsList";

type GetCollectionsOptions = {
  gender?: ShopGender;
  limit?: number;
};

type CollectionMongoDoc = {
  _id: { toString(): string };
  slug: string;
  name: string;
  gender: ShopGender[]; // ✅ już małe litery w DB
  heroImage?: string;
  sortOrder?: number;
  isFeatured?: boolean;
};

export async function getCollections(
  options: GetCollectionsOptions = {}
): Promise<TypeCollection[]> {
  const { gender, limit } = options;

  await connectToDatabase();

  const query: Record<string, unknown> = {};
  if (gender) {
    // ✅ w DB trzymasz: "mens" | "womens" | "kids"
    query.gender = { $in: [gender] };
  }

  const q = Collection.find(query).sort({ sortOrder: 1 });
  if (typeof limit === "number" && limit > 0) q.limit(limit);

  const docs = await q.lean<CollectionMongoDoc[]>().exec();

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    gender: Array.isArray(doc.gender) ? doc.gender : [],
    heroImage: doc.heroImage,
    sortOrder: doc.sortOrder,
    isFeatured: doc.isFeatured ?? false,
  }));
}
