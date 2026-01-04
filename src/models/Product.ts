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

const ProductSectionSchema = new Schema(
  {
    title: {type: String, required: true, trim: true},
    items: {type: [String], default: []},
  },
  {_id: false}
);

const ProductTextBlockSchema = new Schema(
  {
    title: {type: String, default: ""},
    content: {type: String, default: ""},
  },
  {_id: false}
);

const ProductSchema = new Schema(
  {
    title: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true, index: true, trim: true},

    price: {type: Number, required: true, min: 0}, // u Ciebie: grosze lub normalnie — jak masz w UI
    oldPrice: {type: Number, min: 0},
    currency: {type: String, default: "GBP"},

    images: {type: [ImageSchema], default: []},

    gender: {
      type: String,
      enum: ["mens", "womens", "kids"],
      index: true,
    },

    category: {
      type: String,
      enum: ["TSHIRT", "HOODIE"],
      required: true,
      index: true,
    },

    // ✅ NOWE: ukrywanie bez usuwania
    status: {
      type: String,
      enum: ["ACTIVE", "HIDDEN"],
      default: "ACTIVE",
      index: true,
    },

    collectionSlug: {type: String, index: true},
    tags: {type: [String], default: [], index: true},

    variants: {type: [VariantSchema], default: []},

    popularity: {type: Number, default: 0, index: true},

    // --- CONTENT / DESCRIPTION ---
    summary: {type: String, default: ""}, // akapity, np. "...\n\n..."
    sections: {type: [ProductSectionSchema], default: []}, // listy bullet
    styleCode: {type: String, trim: true, default: ""}, // kod/sku marketingowy
    deliveryReturns: {type: ProductTextBlockSchema, default: () => ({})},
  },
  {timestamps: true}
);

export default models.Product || model("Product", ProductSchema);
