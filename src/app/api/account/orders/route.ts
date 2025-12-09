import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDatabase } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const orders = await Order.find({ userId: session.user.id })
  .sort({ createdAt: -1 })
  .populate("items.productId", "images slug title price currency") // 👈 OBRAZKI
  .lean();

  return NextResponse.json({ ok: true, orders });
}
