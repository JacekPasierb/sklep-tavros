import { Schema, model, models, type InferSchemaType } from "mongoose";

const CollectionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    gender: {
      type: String,
      enum: ["MENS", "WOMENS", "KIDS", "UNISEX"],
      required: true,
      index: true,
    },
    heroImage: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CollectionDoc = InferSchemaType<typeof CollectionSchema>;

const Collection =
  models.Collection || model("Collection", CollectionSchema);

export default Collection;
