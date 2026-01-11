// app/api/user/favorites/route.ts
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {Types} from "mongoose";
import {connectToDatabase} from "../../../lib/services/db/mongodb";

import User from "../../../models/User";
import Product from "../../../models/Product";
import { authOptions } from "../../../lib/services/auth/authOptions";

// 👈 ważne: 2x ".."

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        {ok: false, error: "Unauthorized"},
        {status: 401}
      );
    }

    const user = await User.findOne(
      {email: session.user.email},
      {favorites: 1}
    ).lean<{favorites: Types.ObjectId[]}>();

    if (!user) {
      return NextResponse.json(
        {ok: false, error: "User not found"},
        {status: 404}
      );
    }

    const products = await Product.find(
      {_id: {$in: user.favorites}},
      {
        title: 1,
        slug: 1,
        price: 1,
        currency: 1,
        images: 1,
        collectionSlug: 1,
      }
    )
      .sort({createdAt: -1})
      .lean();

    return NextResponse.json({
      ok: true,
      data: products,
      count: products.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {ok: false, error: "Failed to fetch favorites"},
      {status: 500}
    );
  }
}

export async function POST(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ok: false}, {status: 401});
  }

  const {productId} = await req.json();

  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ok: false, error: "Invalid id"}, {status: 400});
  }

  await User.updateOne(
    {email: session.user.email},
    {$addToSet: {favorites: new Types.ObjectId(productId)}} // brak duplikatów
  );

  return NextResponse.json({ok: true});
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ok: false}, {status: 401});
  }

  const {productId} = await req.json();

  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ok: false, error: "Invalid id"}, {status: 400});
  }

  await User.updateOne(
    {email: session.user.email},
    {$pull: {favorites: new Types.ObjectId(productId)}}
  );

  return NextResponse.json({ok: true});
}
