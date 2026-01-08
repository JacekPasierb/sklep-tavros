import {NextRequest, NextResponse} from "next/server";
import { getCollections } from "../../../lib/collections";
import { ShopGender } from "../../../types/shop/productsList";


const ALLOWED_GENDERS: ShopGender[] = ["mens", "womens", "kids"];

export async function GET(req: NextRequest) {
  try {
    const {searchParams} = req.nextUrl;

    const genderParam = searchParams.get("gender");
    const limitParam = searchParams.get("limit");

    const gender =
      genderParam && ALLOWED_GENDERS.includes(genderParam as ShopGender)
        ? (genderParam as ShopGender)
        : undefined;

    const limit = limitParam ? Number(limitParam) || undefined : undefined;

    // 🔹 pobieramy z lib/collections
    const collections = await getCollections({gender, limit});

    // 🔹 mapujemy na prostą strukturę dla menu
    const items = collections.map((col) => {
      // bierzemy "główny" gender kolekcji – jeśli nie ma, fallback do paramu,
      // a jak dalej brak, to "mens"
      const mainGender: ShopGender =
        gender ?? col.gender[0] ?? "mens";

      return {
        label: col.name,
        href: `/${mainGender}/collection/${col.slug}`,
        img: col.heroImage,
      };
    });

    return NextResponse.json({items});
  } catch (err) {
    console.error("[GET /api/collections]", err);
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}
