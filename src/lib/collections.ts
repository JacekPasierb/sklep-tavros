import { connectToDatabase } from "./mongodb";
import Collection from "../models/Collection";
import { Gender, TypeCollection } from "../types/collection";


type GetCollectionsOptions = {
  gender?: Extract<Gender, "mens" | "womens" | "kids">;
  limit?: number;
};

export async function getCollections(options: GetCollectionsOptions = {}) {
  const { gender, limit } = options;

  await connectToDatabase();

  const query: Record<string, unknown> = {};

  if (gender) {
    // w DB trzymasz MENS/WOMENS/KIDS
    query.gender = gender.toUpperCase();
  }

  const docs = Collection.find(query)
    .sort({ sortOrder: 1 })
    .limit(limit ?? 0) // 0 = bez limitu
    .lean();



    const items: TypeCollection[] = docs.map((doc: any) => {
      // gender może być stringiem ALBO tablicą (["MENS","WOMENS"])
      const rawGender = Array.isArray(doc.gender)
        ? doc.gender[0] // bierzemy pierwszy jako "główny"
        : doc.gender;
  
      const normalizedGender: Gender =
        typeof rawGender === "string"
          ? (rawGender.toLowerCase() as Gender)
          : "mens";
  
      return {
        _id: doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        gender: normalizedGender,
        heroImage: doc.heroImage ?? undefined,
        sortOrder: doc.sortOrder ?? undefined,
      };
    });

  return items;
}
