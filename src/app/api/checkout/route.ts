import {NextResponse} from "next/server";
import {stripe} from "../../../lib/stripe";

import Order from "../../../models/Order";
import {getServerSession} from "next-auth";
import {connectToDatabase} from "../../../lib/mongodb";
import {authOptions} from "../auth/[...nextauth]/route";
import {calculateShippingCost, ShippingMethod} from "../../../lib/shipping";

type AuthSession = {
  user?: {
    id?: string;
    email?: string;
  } | null;
} | null;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      items,
      customer,
      shipping,
    }: {
      items: Array<{
        productId?: string;
        slug?: string;
        title: string;
        price: number;
        qty: number;
        size?: string;
        color?: string;
      }>;
      customer?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: {
          street?: string;
          city?: string;
          postalCode?: string;
          country?: string;
        };
      };
      shipping?: {
        method: "standard" | "express";
        cost: number;
      };
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({error: "Invalid cart"}, {status: 400});
    }

    // kto zamawia (opcjonalnie)
    const session = (await getServerSession(authOptions)) as AuthSession;
    const userId = session?.user?.id ?? null;
    const email = session?.user?.email ?? customer?.email ?? null;

    if (!email) {
      return NextResponse.json(
        {error: "Email is required to place an order."},
        {status: 400}
      );
    }

    await connectToDatabase();

    // --- kwoty ---
    const amountSubtotal = items.reduce(
      (sum: number, item) => sum + item.price * item.qty,
      0
    );

    const method: ShippingMethod =
      shipping?.method === "express" ? "express" : "standard";

    const shippingCost = calculateShippingCost(amountSubtotal, method);
    const amountTotal = amountSubtotal + shippingCost;

    // -----------------------------
    //  ZAPIS ZAMÓWIENIA W MONGO
    // -----------------------------
    const order = await Order.create({
      userId,
      email,
      items: items.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        title: item.title,
        price: item.price,
        qty: item.qty,
        size: item.size,
        color: item.color,
      })),
      amountSubtotal,
      amountTotal,
      currency: "gbp",
      status: "pending",
      customer: {
        firstName: customer?.firstName ?? null,
        lastName: customer?.lastName ?? null,
        email: email ?? customer?.email ?? null,
        phone: customer?.phone ?? null,
        address: {
          street: customer?.address?.street ?? null,
          city: customer?.address?.city ?? null,
          postalCode: customer?.address?.postalCode ?? null,
          country: customer?.address?.country ?? null,
        },
      },

      shippingMethod: method,
      shippingCost,
    });

    // -----------------------------
    //  LINE ITEMS DLA STRIPE
    // -----------------------------
    const line_items = items.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100), // pensy
      },
      quantity: item.qty,
    }));

    // dostawa jako osobny produkt, jeśli > 0
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name:
              method === "express" ? "Express delivery" : "Standard delivery",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      // lepiej wrócić na checkout niż na cart:
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
      customer_email: email ?? undefined,
      metadata: {
        orderId: String(order._id),
        userId: userId ?? "",
        shippingMethod: shipping?.method ?? "",
        shippingCost: shippingCost.toString(),
      },
    });

    // zapisujemy id sesji w zamówieniu (przyda się w webhooku)
    order.stripeSessionId = sessionStripe.id;
    await order.save();

    // 🔑 TERAZ ZWRACAMY sessionId, bo front woła redirectToCheckout(sessionId)
    return NextResponse.json({url: sessionStripe.url}, {status: 200});
  } catch (error: unknown) {
    console.error("Stripe error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({error: message}, {status: 500});
  }
}
