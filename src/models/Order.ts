import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    slug: String,
    title: String,
    price: Number,
    qty: Number,
    size: String,
    color: String,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    email: { type: String, required: true },
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    customer: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },      
      phone: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
    },

    items: { type: [orderItemSchema], required: true },

    amountSubtotal: Number,
    amountTotal: Number,
    currency: { type: String, default: "gbp" },

    shippingMethod: { type: String, enum: ["standard", "express"], default: "standard" },
    shippingCost: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "paid", "canceled"],
      default: "pending",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

export default models.Order || model("Order", orderSchema);
