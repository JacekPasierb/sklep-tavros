import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";

import {connectToDatabase} from "../../../../../../lib/services/db/mongodb";
import Product from "../../../../../../models/Product";
import { authOptions } from "../../../../../../lib/services/auth/authOptions";

export async function PATCH(
  req: Request,
  {params}: {params: Promise<{id: string}>}
) {
  const {id} = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as {role?: "admin"} | undefined)?.role;

  if (!session || role !== "admin") {
    return NextResponse.json({ok: false}, {status: 401});
  }

  const body = await req.json().catch(() => ({}));
  const status =
    typeof body.status === "string" ? body.status.toUpperCase() : "";

  if (status !== "ACTIVE" && status !== "HIDDEN") {
    return NextResponse.json(
      {ok: false, error: "Invalid status"},
      {status: 400}
    );
  }

  await connectToDatabase();
  await Product.updateOne({_id: id}, {$set: {status}});

  return NextResponse.json({ok: true});
}
