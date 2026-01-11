// api/admin/orders/[id]/route.ts
import {NextResponse} from "next/server";
import mongoose from "mongoose";

import {requireAdmin} from "../../../../../lib/utils/requireAdmin";
import {connectToDatabase} from "../../../../../lib/services/db/mongodb";
import Order from "../../../../../models/Order";
import { FulfillmentStatus, PaymentStatus } from "../../../../../types/(shop)/account/orders";


type PatchBody = Partial<{
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber: string | null;
}>;

type Params = {id: string};

export async function PATCH(req: Request, ctx: {params: Promise<Params>}) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const {id} = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({error: "Invalid id"}, {status: 400});
  }

  const body = (await req.json()) as PatchBody;

  const update: PatchBody = {};
  if (body.paymentStatus) update.paymentStatus = body.paymentStatus;
  if (body.fulfillmentStatus) update.fulfillmentStatus = body.fulfillmentStatus;
  if ("trackingNumber" in body)
    update.trackingNumber = body.trackingNumber ?? null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({error: "Nothing to update"}, {status: 400});
  }

  await connectToDatabase();

  const updated = await Order.findByIdAndUpdate(id, {$set: update}, {new: true})
    .select({_id: 1})
    .lean<{_id: unknown} | null>();

  if (!updated) return NextResponse.json({error: "Not found"}, {status: 404});

  return NextResponse.json({ok: true});
}
