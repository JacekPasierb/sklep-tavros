import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/services/auth/authOptions";
import { getAccountOrders } from "@/lib/services/(shop)/orders/orders.service";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getAccountOrders(session.user.id);

  return NextResponse.json({ ok: true, orders });
}
