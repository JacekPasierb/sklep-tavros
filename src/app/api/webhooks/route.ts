import {NextResponse} from "next/server";
import {stripe} from "../../../lib/stripe";
import {connectToDatabase} from "../../../lib/mongodb";
import Order from "../../../models/Order";
import type Stripe from "stripe";

export const dynamic = "force-dynamic"; // webhook musi działać bez cache

// STRIPE wymaga odczytu RAW BODY:
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  // wczytujemy "czysty" body do weryfikacji
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";

    console.error("❌ Webhook signature error:", err);
    return NextResponse.json({error: message}, {status: 400});
  }

  // -----------------------------------
  // EVENT: płatność zakończona sukcesem
  // -----------------------------------
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectToDatabase();

      // znajdź zamówienie po stripeSessionId
      const order = await Order.findOne({stripeSessionId: session.id});

      if (!order) {
        console.error("⚠️ Order not found for session:", session.id);
        return NextResponse.json({received: true});
      }
 
      order.status = "paid";
      if (session.amount_total != null) {
        order.amountTotal = session.amount_total / 100; // aktualizacja z Stripe
      }

      order.paymentIntent = session.payment_intent;
      await order.save();

      console.log("✅ Order marked as PAID:", order._id);
    } catch (err) {
      console.error("❌ Failed to update order:", err);
    }
  }

  return NextResponse.json({received: true});
}
