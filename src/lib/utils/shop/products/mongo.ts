import type { Types } from "mongoose";
import type { TypeProduct } from "../../../../types/product";

export type MongoId = Types.ObjectId | string;
export type LeanProduct = Omit<TypeProduct, "_id"> & { _id: MongoId };

export function normalizeProduct(doc: LeanProduct): TypeProduct {
  return {
    ...doc,
    _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
  };
}
