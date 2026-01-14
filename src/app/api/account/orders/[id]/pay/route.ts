// app/api/account/orders/[id]/pay/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/services/auth/authOptions";
import { payNowService, PayNowError } from "@/lib/services/(shop)/orders/payNow.service";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await payNowService({
      orderId,
      userId: session.user.id,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof PayNowError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[orders/pay] error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
