// models/Product.ts
import {Schema, model, models} from "mongoose";
const VariantSchema = new Schema(
  {
    sku: {type: String, trim: true},
    size: {type: String, trim: true},
    color: {type: String, trim: true, index: true},
    stock: {type: Number, default: 0, min: 0},
  },
  {_id: false}
);
const ImageSchema = new Schema(
  {src: {type: String, required: true}, alt: String, primary: Boolean},
  {_id: false}
);
const ProductSchema = new Schema(
  {
    title: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true, index: true, trim: true},
    price: {type: Number, required: true, min: 0}, // grosze
    oldPrice: {type: Number, min: 0}, 
    currency: {type: String, default: "GBP"},
    images: {type: [ImageSchema], default: []},
    gender: {
      type: String,
      enum: ["MENS", "WOMENS", "KIDS", "UNISEX"],
      index: true,
    },
    collectionSlug: {type: String, index: true},
    tags: {type: [String], default: [], index: true},
    variants: {type: [VariantSchema], default: []},
    isBestseller: {type: Boolean, default: false, index: true},
    popularity: {type: Number, default: 0, index: true},
  },
  {timestamps: true}
);
export default models.Product || model("Product", ProductSchema);
