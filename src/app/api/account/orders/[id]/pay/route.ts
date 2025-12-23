// app/api/account/orders/[id]/pay/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import { connectToDatabase } from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";
import { stripe } from "../../../../../../lib/stripe";
import { authOptions } from "../../../../../../lib/authOptions";


// USUŃ swój typ RouteParams

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } // dopasowujemy się do typu z błędu
) {
  try {
    const { id: orderId } = await context.params; // params jest typowane jako Promise

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectToDatabase();

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 }
      );
    }

    if (order.paymentStatus === "canceled") {
      return NextResponse.json(
        { error: "Order has been canceled. Please place a new one." },
        { status: 400 }
      );
    }

    if (!order.stripeSessionId) {
      return NextResponse.json(
        { error: "No Stripe session attached to this order" },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(
      order.stripeSessionId
    );

    if (checkoutSession.payment_status === "paid") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 }
      );
    }

    if (checkoutSession.status === "expired") {
      return NextResponse.json(
        {
          error:
            "This payment link has expired. Please place a new order in the store.",
        },
        { status: 400 }
      );
    }

    if (checkoutSession.url) {
      return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Unable to continue payment. Please create a new order." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[orders/pay] error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
