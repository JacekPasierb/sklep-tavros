// src/lib/services/(shop)/orders/payNow.service.ts
import {stripe} from "@/lib/stripe";
import {connectToDatabase} from "@/lib/services/db/mongodb";
import Order from "@/models/Order";

export type PayNowResult = {url: string};

export type PayNowErrorCode =
  | "ORDER_NOT_FOUND"
  | "ORDER_ALREADY_PAID"
  | "ORDER_CANCELED"
  | "NO_STRIPE_SESSION"
  | "STRIPE_ALREADY_PAID"
  | "STRIPE_EXPIRED"
  | "MISSING_URL";

export class PayNowError extends Error {
  code: PayNowErrorCode;
  status: number;

  constructor(code: PayNowErrorCode, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function getCheckoutUrlForOrder(params: {
  orderId: string;
  userId: string;
}): Promise<PayNowResult> {
  const {orderId, userId} = params;

  await connectToDatabase();

  const order = await Order.findOne({_id: orderId, userId}).lean<{
    paymentStatus?: string;
    stripeSessionId?: string | null;
  }>();

  if (!order) {
    throw new PayNowError("ORDER_NOT_FOUND", "Order not found", 404);
  } 

  if (order.paymentStatus === "paid") {
    throw new PayNowError("ORDER_ALREADY_PAID", "Order is already paid", 400);
  }

  if (order.paymentStatus === "canceled") {
    throw new PayNowError(
      "ORDER_CANCELED",
      "Order has been canceled. Please place a new one.",
      400
    );
  }

  if (!order.stripeSessionId) {
    throw new PayNowError(
      "NO_STRIPE_SESSION",
      "No Stripe session attached to this order",
      400
    );
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    order.stripeSessionId
  );

  if (checkoutSession.payment_status === "paid") {
    throw new PayNowError("STRIPE_ALREADY_PAID", "Order is already paid", 400);
  }

  if (checkoutSession.status === "expired") {
    throw new PayNowError(
      "STRIPE_EXPIRED",
      "This payment link has expired. Please place a new order in the store.",
      400
    );
  }

  if (!checkoutSession.url) {
    throw new PayNowError(
      "MISSING_URL",
      "Unable to continue payment. Please create a new order.",
      400
    );
  }

  return {url: checkoutSession.url};
}
