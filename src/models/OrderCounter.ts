import mongoose, { Schema, models } from "mongoose";

const OrderCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export default models.OrderCounter ||
  mongoose.model("OrderCounter", OrderCounterSchema);
// Licznik zamówień do generowania unikalnych numerów zamówie w kolejności