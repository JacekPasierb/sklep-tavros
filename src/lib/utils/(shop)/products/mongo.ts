import type {Types} from "mongoose";
import {TypeProduct} from "@/types/(shop)/product";

export type MongoId = Types.ObjectId | string;
export type LeanProduct = Omit<TypeProduct, "_id"> & {_id: MongoId};

export const normalizeProduct = (doc: LeanProduct): TypeProduct => {
  return {
    ...doc,
    _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
  };
};
