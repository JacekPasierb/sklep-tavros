// models/User.ts
import mongoose, {Schema, type InferSchemaType, models, model} from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true},
    password: {type: String, required: true}, // bcrypt hash
    role: {type: String, enum: ["user", "admin"], default: "user"},
    marketingOptIn: {type: Boolean, default: false},
    favorites: [{type: Schema.Types.ObjectId, ref: "Product"}],
    cart: [
      {
        product: {type: Schema.Types.ObjectId, ref: "Product"},
        qty: {type: Number, default: 1},
      },
    ],
  },
  {timestamps: true}
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

export default (models.User as mongoose.Model<UserDoc>) ||
  model<UserDoc>("User", UserSchema);
