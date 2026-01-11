// app/api/cart/route.ts
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";

import {connectToDatabase} from "../../../lib/services/db/mongodb";


import User from "../../../models/User";
import Product from "../../../models/Product"; // ✅ rejestruje model "Product" dla populate
import type {CartEntry} from "../../../types/shop/cart";
import { authOptions } from "../../../lib/services/auth/authOptions";

void Product; // ✅ ucisza "unused import" i gwarantuje rejestrację

type CartBody = {
  productId: string;
  size?: string | null;
  color?: string | null;
  qty?: number;
};

type DeleteBody =
  | {clearAll: true}
  | {clearAll?: false; productId: string; size?: string | null; color?: string | null};

function normalizeOpt(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

function normalizeQty(v: unknown, fallback = 1): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * GET /api/cart
 * - Zwraca koszyk usera (z populate cart.product)
 * - Dla gościa: { cart: [] }
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({cart: []});
  }

  await connectToDatabase();

  const user = await User.findOne({email: session.user.email})
    .populate("cart.product")
    .lean();

  return NextResponse.json({cart: user?.cart ?? []});
}

/**
 * POST /api/cart
 * - Dodaje do koszyka (variant: productId + size + color)
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = (await req.json()) as Partial<CartBody>;

  if (!isNonEmptyString(body.productId)) {
    return NextResponse.json({error: "Invalid productId"}, {status: 400});
  }

  const size = normalizeOpt(body.size);
  const color = normalizeOpt(body.color);
  const qty = normalizeQty(body.qty, 1);

  await connectToDatabase();

  const user = await User.findOne({email: session.user.email});
  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  const existing = user.cart.find(
    (item: CartEntry) =>
      item.product.toString() === body.productId &&
      (item.size ?? null) === size &&
      (item.color ?? null) === color
  );

  if (existing) {
    existing.qty = normalizeQty(existing.qty + qty, 1);
  } else {
    user.cart.push({
      product: body.productId,
      qty,
      size,
      color,
    });
  }

  await user.save();
  return NextResponse.json({ok: true});
}

/**
 * PATCH /api/cart
 * - Aktualizuje qty (variant: productId + size + color)
 */
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = (await req.json()) as Partial<CartBody>;

  if (!isNonEmptyString(body.productId)) {
    return NextResponse.json({error: "Invalid productId"}, {status: 400});
  }

  const size = normalizeOpt(body.size);
  const color = normalizeOpt(body.color);

  if (typeof body.qty === "undefined") {
    return NextResponse.json({error: "Missing qty"}, {status: 400});
  }
  const qty = normalizeQty(body.qty, 1);

  await connectToDatabase();

  const user = await User.findOne({email: session.user.email});
  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  const item = user.cart.find(
    (i: CartEntry) =>
      i.product.toString() === body.productId &&
      (i.size ?? null) === size &&
      (i.color ?? null) === color
  );

  if (!item) {
    return NextResponse.json({error: "Item not found"}, {status: 404});
  }

  item.qty = qty;
  await user.save();

  return NextResponse.json({ok: true});
}

/**
 * DELETE /api/cart
 * - clearAll: true -> czyści cały koszyk
 * - inaczej: usuwa konkretny variant (productId + size + color)
 */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = (await req.json()) as DeleteBody;

  await connectToDatabase();

  const user = await User.findOne({email: session.user.email});
  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  if ("clearAll" in body && body.clearAll) {
    user.cart.splice(0, user.cart.length);
    await user.save();
    return NextResponse.json({ok: true});
  }

  if (!("productId" in body) || !isNonEmptyString(body.productId)) {
    return NextResponse.json({error: "Invalid productId"}, {status: 400});
  }

  const size = normalizeOpt(body.size);
  const color = normalizeOpt(body.color);

  const itemsToRemove = user.cart.filter(
    (i: CartEntry) =>
      i.product.toString() === body.productId &&
      (i.size ?? null) === size &&
      (i.color ?? null) === color
  );

  itemsToRemove.forEach((item) => {
    user.cart.pull(item._id);
  });

  await user.save();
  return NextResponse.json({ok: true});
}
