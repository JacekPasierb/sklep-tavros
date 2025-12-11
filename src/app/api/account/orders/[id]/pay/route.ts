// app/api/account/orders/[id]/pay/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { connectToDatabase } from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";
import { stripe } from "../../../../../../lib/stripe";


type RouteParams = {
  params: { id: string };
};

export async function POST(_req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const orderId = params.id;

    await connectToDatabase();

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // tylko dla nieopłaconych
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

    // pobierz sesję ze Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      order.stripeSessionId
    );

    // jeśli już zapłacone, nie ma sensu wracać do checkout
    if (checkoutSession.payment_status === "paid") {
      return NextResponse.json(
        { error: "Order is already paid" },
        { status: 400 }
      );
    }

    // jeśli sesja wygasła – na razie prosty komunikat
    if (checkoutSession.status === "expired") {
      return NextResponse.json(
        {
          error:
            "This payment link has expired. Please place a new order in the store.",
        },
        { status: 400 }
      );
    }

    // jeśli sesja jest nadal „open” → można użyć jej ponownie
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
