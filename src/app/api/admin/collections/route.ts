import {NextResponse} from "next/server";
import {requireAdmin} from "../../../../lib/utils/requireAdmin";
import {getCollections} from "../../../../lib/collections";
import {ShopGender} from "../../../../types/shop/productsList";

const ALLOWED_GENDERS: ShopGender[] = ["mens", "womens", "kids"];

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const genderParam = url.searchParams.get("gender") as ShopGender | null;

  const gender =
    genderParam && ALLOWED_GENDERS.includes(genderParam)
      ? genderParam
      : undefined;

  const collections = await getCollections({gender});

  const payload = collections.map((c) => ({
    slug: c.slug,
    name: c.name,
    gender: c.gender,
  }));

  return NextResponse.json({collections: payload});
}
