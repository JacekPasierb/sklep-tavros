import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/services/db/mongodb";

export async function getAccountOrders(userId: string) {
  await connectToDatabase();

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .populate("items.productId", "images slug title price currency")
    .lean();

  return orders;
}
