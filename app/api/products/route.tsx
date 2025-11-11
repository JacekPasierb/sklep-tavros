import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "../../lib/mongodb";
import Product from "../../models/Product";

type SortKey = "newest" | "price_asc" | "price_desc" | "popular" | "title_asc";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
console.log("req", req);
    const sp = req.nextUrl.searchParams;
    const gender = sp.get("gender") || undefined;
    const collection = sp.get("collection") || undefined;
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
    const limit = Math.min(
      24,
      Math.max(1, parseInt(sp.get("limit") || "12", 10))
    );
    const skip = (page - 1) * limit;

    const sortKey = (sp.get("sort") as SortKey) || "newest";

    // whitelist — tylko dozwolone sorty
    const sortMap: Record<SortKey, Record<string, 1 | -1>> = {
        newest:     { createdAt: -1 },
        price_asc:  { price: 1 },
        price_desc: { price: -1 },
        popular:    { popularity: -1, createdAt: -1 }, // tie-break
        title_asc:  { title: 1 },
      };

    const where: any = {};
    if (gender) where.gender = gender.toUpperCase();
    if (collection) where.collectionSlug = collection;

    const [items, total] = await Promise.all([
      Product.find(where)
        .sort(sortMap[sortKey] ?? sortMap.newest)
        .skip(skip)
        .limit(limit)
        .select("title slug price images")
        .lean(),
      Product.countDocuments(where),
    ]);

    return NextResponse.json({ok: true, data: items, total, page, limit});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ok: false, error: "fetch error"}, {status: 500});
  }
}
