import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import type {Session} from "next-auth";
import { authOptions } from "@/lib/services/auth/authOptions";



export async function requireAdmin(): Promise<
  | {ok: true; session: Session}
  | {ok: false; response: NextResponse}
> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return {ok: false, response: NextResponse.json({error: "Forbidden"}, {status: 403})};
  }

  return {ok: true, session};
}
