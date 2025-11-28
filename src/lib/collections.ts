import {connectToDatabase} from "./mongodb";
import Collection from "../models/Collection";
import {Gender, TypeCollection} from "../types/collection";

type GetCollectionsOptions = {
  gender?: Gender;
  limit?: number;
};

type CollectionMongoDoc = {
  _id: {toString(): string};
  slug: string;
  name: string;
  gender: string[];
  heroImage?: string;
  sortOrder?: number;
  isFeatured?: boolean;
};

export async function getCollections(
  options: GetCollectionsOptions = {}
): Promise<TypeCollection[]> {
  const {gender, limit} = options;

  await connectToDatabase();

  const query: Record<string, unknown> = {};

  if (gender) {
    // w DB trzymasz MENS/WOMENS/KIDS
    query.gender = {$in: [gender.toUpperCase()]};
  }

  const docs = await Collection.find(query)
    .sort({sortOrder: 1})
    .limit(limit ?? 0) // 0 = bez limitu
    .lean<CollectionMongoDoc[]>() // ⬅️ typujemy wynik
    .exec();

  const items: TypeCollection[] = docs.map((doc: CollectionMongoDoc) => {
    const genders: Gender[] = Array.isArray(doc.gender)
      ? doc.gender.map((g) => g.toLowerCase() as Gender)
      : [];

    return {
      _id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      gender: genders, // ← teraz tablica
      heroImage: doc.heroImage,
      sortOrder: doc.sortOrder,
      isFeatured: doc.isFeatured ?? false,
    };
  });

  return items;
}
