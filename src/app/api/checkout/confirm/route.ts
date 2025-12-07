// app/api/checkout/confirm/route.ts
import {NextResponse} from "next/server";
import {connectToDatabase} from "../../../../lib/mongodb";
import {stripe} from "../../../../lib/stripe";
import Order from "../../../../models/Order";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    const {sessionId} = await req.json();

    if (!sessionId) {
      return NextResponse.json({error: "Missing sessionId"}, {status: 400});
    }

    await connectToDatabase();

    // 🔹 Pobieramy sesję Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({error: "Payment not completed"}, {status: 400});
    }

    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    if (!orderId) {
      return NextResponse.json(
        {error: "Missing orderId in metadata"},
        {status: 400}
      );
    }

    // 🔹 Oznaczamy zamówienie jako opłacone
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({error: "Order not found"}, {status: 404});
    }

    order.status = "paid";
    await order.save();

    // 🔹 Czyścimy koszyk zalogowanego użytkownika (jeśli trzymasz w User.cart)
    if (userId) {
      await User.updateOne(
        {_id: userId},
        {
          $set: {
            cart: [], // dopasuj do swojej struktury
          },
        }
      );
    }

    return NextResponse.json({success: true}, {status: 200});
  } catch (error: unknown) {
    console.error("Confirm checkout error:", error);

    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({error: message}, {status: 500});
  }
}
