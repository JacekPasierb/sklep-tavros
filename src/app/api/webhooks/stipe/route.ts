import {NextResponse} from "next/server";
import type Stripe from "stripe";
import {stripe} from "../../../../lib/stripe";
import {connectToDatabase} from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export const dynamic = "force-dynamic"; // webhook nie może być cache'owany

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing stripe-signature header");
    return NextResponse.json(
      {error: "Missing stripe-signature header"},
      {status: 400}
    );
  }

  // Stripe wymaga RAW body, więc używamy text(), nie json()
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("❌ Webhook signature error:", message);
    return NextResponse.json({error: message}, {status: 400});
  }

  // tu mamy poprawnie zweryfikowane eventy ze Stripe
  try {
    await connectToDatabase();

    switch (event.type) {
      // 💰 Płatność zakończona sukcesem
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Najpierw próbujemy po metadata.orderId (tak jest najwygodniej)
        const orderId = session.metadata?.orderId;
        let order;

        if (orderId) {
          order = await Order.findById(orderId);
        } else {
          // fallback: po stripeSessionId
          order = await Order.findOne({stripeSessionId: session.id});
        }

        if (!order) {
          console.error("⚠️ Order not found for session:", session.id);
          break;
        }

        order.status = "paid";

        if (typeof session.amount_total === "number") {
          order.amountTotal = session.amount_total / 100; // z groszy/pensów na GBP
        }
        let paymentIntentId: string | undefined;
        if (typeof session.payment_intent === "string") {
          paymentIntentId = session.payment_intent;
        } else if (
          session.payment_intent &&
          typeof session.payment_intent === "object"
        ) {
          const pi = session.payment_intent as Stripe.PaymentIntent;
          paymentIntentId = pi.id;
        }

        if (paymentIntentId) {
          order.stripePaymentIntentId = paymentIntentId;
        }

        await order.save();
        console.log("✅ Order marked as PAID:", order._id);
        break;
      }

      // ⛔ Płatność nieudana / porzucona (opcjonalnie)
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const order = await Order.findOne({stripeSessionId: session.id});
        if (order) {
          order.status = "canceled";
          await order.save();
          console.log("⚠️ Order marked as CANCELED (expired):", order._id);
        }
        break;
      }

      default:
        // na przyszłość możesz logować inne typy
        console.log("ℹ️ Unhandled Stripe event type:", event.type);
    }
  } catch (err) {
    console.error("❌ Error handling Stripe webhook:", err);
    // Zwykle i tak zwracamy 200, żeby Stripe nie spamował retry.
    return NextResponse.json({received: true}, {status: 200});
  }

  return NextResponse.json({received: true}, {status: 200});
}
