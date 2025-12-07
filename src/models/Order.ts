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
    items: { type: [orderItemSchema], required: true },
    amountSubtotal: Number,
    amountTotal: Number,
    currency: { type: String, default: "gbp" },
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
