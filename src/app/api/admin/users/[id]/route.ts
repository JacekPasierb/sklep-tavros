import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import mongoose from "mongoose";
import { connectToDatabase } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { authOptions } from "../../../../../lib/authOptions";



type Params = {id: string};

export async function DELETE(
  _req: Request,
  ctx: {params: Promise<Params>}
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }

  const {id} = await ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({error: "Invalid id"}, {status: 400});
  }

  // blokada: nie usuń samego siebie
  if (id === session.user.id) {
    return NextResponse.json({error: "You cannot delete your own account"}, {status: 400});
  }

  await connectToDatabase();

  const target = await User.findById(id).select({role: 1}).lean<{role: "user" | "admin"} | null>();
  if (!target) {
    return NextResponse.json({error: "Not found"}, {status: 404});
  }

  // blokada: nie usuwamy adminów (na start)
  if (target.role === "admin") {
    return NextResponse.json({error: "Cannot delete admin accounts"}, {status: 400});
  }

  await User.deleteOne({_id: id});

  return NextResponse.json({ok: true});
}
