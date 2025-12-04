import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "../../../lib/mongodb";
import Product from "../../../models/Product";
import { Types } from "mongoose";          // ✅ DODANE

type SortKey = "newest" | "price_asc" | "price_desc" | "popular" | "title_asc";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const sp = req.nextUrl.searchParams;

    // ✅ 1. tryb „po ID” – używany przez wishlist dla gościa
    const idsParam = sp.get("ids");
    if (idsParam) {
      const ids = idsParam
        .split(",")
        .filter(Boolean)
        .filter((id) => Types.ObjectId.isValid(id));

      if (!ids.length) {
        return NextResponse.json({ ok: true, data: [] });
      }

      const products = await Product.find(
        { _id: { $in: ids } },
        {
          title: 1,
          slug: 1,
          price: 1,
          currency: 1,
          images: 1,
          tags: 1,
          oldPrice: 1,
          variants: 1,
        }
      ).lean();

      return NextResponse.json({ ok: true, data: products });
    }

    // ✅ 2. standardowy listing z filtrami (to, co już miałeś)
    const gender = sp.get("gender") || undefined;
    const collection = sp.get("collection") || undefined;
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
    const limit = Math.min(
      24,
      Math.max(1, parseInt(sp.get("limit") || "12", 10))
    );
    const skip = (page - 1) * limit;

    const sortKey = (sp.get("sort") as SortKey) || "newest";

    const sizes = (sp.get("sizes") || "").split(",").filter(Boolean);
    const colors = (sp.get("colors") || "").split(",").filter(Boolean);
    const inStock = sp.get("inStock") === "true";
    const bestseller = sp.get("bestseller") === "true";

    const sortMap: Record<SortKey, Record<string, 1 | -1>> = {
      newest: {createdAt: -1},
      price_asc: {price: 1},
      price_desc: {price: -1},
      popular: {popularity: -1, createdAt: -1},
      title_asc: {title: 1},
    };

    const where: any = {};
    if (gender) where.gender = gender.toUpperCase();
    if (collection) where.collectionSlug = collection;
    if (bestseller) where.isBestseller = true;

    const variantMatch: any = {};
    if (sizes.length) variantMatch.size = {$in: sizes};
    if (colors.length) variantMatch.color = {$in: colors};
    if (inStock) variantMatch.stock = {$gt: 0};

    if (Object.keys(variantMatch).length > 0) {
      where.variants = {$elemMatch: variantMatch};
    }

    const [items, total] = await Promise.all([
      Product.find(where)
        .sort(sortMap[sortKey] ?? sortMap.newest)
        .skip(skip)
        .limit(limit)
        .select("title slug price images variants tags oldPrice currency")
        .lean(),
      Product.countDocuments(where),
    ]);

    return NextResponse.json({ok: true, data: items, total, page, limit});
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {ok: false, error: "fetch error"},
      {status: 500}
    );
  }
}
