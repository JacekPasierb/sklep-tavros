import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/utils/requireAdmin";
import { getCollections } from "../../../../lib/collections";
import type { Gender } from "../../../../types/collection"; // "mens" | "womens" | "kids" | "unisex"

const ALLOWED_GENDERS: Gender[] = ["mens", "womens", "kids"];

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const genderParam = url.searchParams.get("gender") as Gender | null;

  const gender =
    genderParam && ALLOWED_GENDERS.includes(genderParam) ? genderParam : undefined;

  const collections = await getCollections({ gender });

  // ✅ dane pod SELECT w adminie
  const payload = collections.map((c) => ({
    slug: c.slug,
    name: c.name,
    gender: c.gender, // tablica
  }));

  return NextResponse.json({ collections: payload });
}
