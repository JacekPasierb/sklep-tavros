// app/api/cart/route.ts
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {connectToDatabase} from "../../../lib/mongodb";
import {authOptions} from "../auth/[...nextauth]/route";
import User from "../../../models/User";
import {CartEntry} from "../../../types/cart";

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({cart: []}); // user niezalogowany
  }

  const user = await User.findOne({email: session.user.email})
    .populate("cart.product")
    .lean();

  return NextResponse.json({cart: user?.cart ?? []});
}

export async function POST(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({error: "Unauthorized"}, {status: 401});

  const {productId, size, color, qty = 1} = await req.json();

  const user = await User.findOne({email: session.user.email});

  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }
  // znajdź wariant w koszyku
  const existing = user.cart.find(
    (item: CartEntry) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (existing) {
    existing.qty += qty;
  } else {
    user.cart.push({
      product: productId,
      qty,
      size,
      color,
    });
  }

  await user.save();

  return NextResponse.json({ok: true});
}

export async function PATCH(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({error: "Unauthorized"}, {status: 401});

  const {productId, size, color, qty} = await req.json();

  const user = await User.findOne({email: session.user.email});
  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }
  const item = user.cart.find(
    (i: CartEntry) =>
      i.product.toString() === productId && i.size === size && i.color === color
  );

  if (!item) {
    return NextResponse.json({error: "Item not found"}, {status: 404});
  }

  item.qty = qty;
  await user.save();

  return NextResponse.json({ok: true});
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({error: "Unauthorized"}, {status: 401});

  const {productId, size, color, clearAll} = await req.json();

  const user = await User.findOne({email: session.user.email});
  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  // 🔹 wariant 1: czyścimy cały koszyk
  if (clearAll) {
    user.cart = [];
    await user.save();
    return NextResponse.json({ok: true});
  }

  // 🔹 wariant 2: usuwamy tylko konkretną pozycję (dotychczasowa logika)
  const itemsToRemove = user.cart.filter(
    (i: CartEntry) =>
      i.product.toString() === productId &&
      i.size === size &&
      i.color === color
  );

  itemsToRemove.forEach((item) => {
    user.cart.pull(item._id);
  });

  await user.save();

  return NextResponse.json({ok: true});
}
