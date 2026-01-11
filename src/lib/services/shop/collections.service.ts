import Collection from "../../../models/Collection";
import {TypeCollection} from "../../../types/shop/collection";
import {ShopGender} from "../../../types/shop/productsList";
import {
  CollectionMongoDoc,
  mapCollectionDocToCollection,
} from "../../mappers/collections/collections.mapper";

import {connectToDatabase} from "../db/mongodb";

type GetCollectionsOptions = {
  gender?: ShopGender;
  limit?: number;
};

export async function getCollections(
  options: GetCollectionsOptions = {}
): Promise<TypeCollection[]> {
  const {gender, limit} = options;

  await connectToDatabase();

  const query: Record<string, unknown> = {};
  if (gender) {
    query.gender = {$in: [gender]};
  }

  const q = Collection.find(query).sort({sortOrder: 1});
  if (typeof limit === "number" && limit > 0) q.limit(limit);

  const docs = await q.lean<CollectionMongoDoc[]>().exec();
  return docs.map(mapCollectionDocToCollection);
}
