import {NextResponse} from "next/server";
import {requireAdmin} from "../../../../lib/auth/requireAdmin";
import {connectToDatabase} from "../../../../lib/services/db/mongodb";
import User from "../../../../models/User";

type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

type UsersResponse = {
  users: PublicUser[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

function parseIntSafe(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);

  const page = parseIntSafe(url.searchParams.get("page"), 1);
  const limitRaw = parseIntSafe(url.searchParams.get("limit"), 20);
  const limit = Math.min(limitRaw, 100); // hard cap

  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

  await connectToDatabase();

  const filter: Record<string, unknown> = {role: "user"};
  if (q) {
    // proste wyszukiwanie po email / imieniu / nazwisku
    filter.$or = [
      {email: {$regex: q, $options: "i"}},
      {firstName: {$regex: q, $options: "i"}},
      {lastName: {$regex: q, $options: "i"}},
    ];
  }

  const total = await User.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);

  const rows = await User.find(filter)
    .sort({createdAt: -1})
    .skip((safePage - 1) * limit)
    .limit(limit)
    .select({email: 1, firstName: 1, lastName: 1, createdAt: 1})
    .lean<
      Array<{
        _id: unknown;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
      }>
    >();

  const users: PublicUser[] = rows.map((u) => ({
    id: String(u._id),
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    createdAt: u.createdAt.toISOString(),
  }));

  const payload: UsersResponse = {
    users,
    page: safePage,
    limit,
    total,
    pages,
  };

  return NextResponse.json(payload);
}
