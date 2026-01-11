import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "../../../lib/services/db/mongodb";
import Product from "../../../models/Product";
import {Types} from "mongoose";
import {generateStyleCode} from "../../../lib/utils/generateStyleCode";
import {getServerSession} from "next-auth";


import {
  parseCategory,
  parseGender,
  parseStatus,
} from "@/lib/utils/shared/parsers/product";
import { authOptions } from "@/lib/services/auth/authOptions";
import { ProductStatus, ShopGender } from "@/types/(shop)/product";

type Where = {
  status?: ProductStatus;
  gender?: ShopGender;
  collectionSlug?: string;
  isBestseller?: boolean;
  tags?: {$in: string[]};
  variants?: {
    $elemMatch: {
      size?: {$in: string[]};
      color?: {$in: string[]};
      stock?: {$gt: number};
    };
  };
};

type VariantMatch = NonNullable<NonNullable<Where["variants"]>["$elemMatch"]>;

type IncomingImage = string | {src: string; alt?: string; primary?: boolean};

type IncomingVariant = {
  sku?: unknown;
  size?: unknown;
  color?: unknown;
  stock?: unknown;
};

type IncomingSection = {
  title?: unknown;
  items?: unknown;
};

type IncomingDeliveryReturns = {
  title?: unknown;
  content?: unknown;
};

type CreateProductBody = {
  title?: unknown;
  slug?: unknown;
  price?: unknown;
  oldPrice?: unknown;
  currency?: unknown;

  images?: unknown;
  variants?: unknown;
  category?: unknown;
  status?: unknown;
  gender?: unknown;
  collectionSlug?: unknown;
  tags?: unknown;

  isBestseller?: unknown;
  popularity?: unknown;

  summary?: unknown;
  sections?: unknown;
  styleCode?: unknown;
  deliveryReturns?: unknown;
};

type SortKey = "newest" | "price_asc" | "price_desc" | "popular" | "title_asc";

function csvParam(sp: URLSearchParams, key: string) {
  const raw = sp.get(key);
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // WYCIĄGAMY ZAPISANE IDS - CZYLI ID ZAPISANYCH PRODUKTOW Z ZUSTAND (LOCALSTORE)
    const sp = req.nextUrl.searchParams;
    console.log("sp", sp);

    const idsParam = sp.get("ids");
    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((id) => Types.ObjectId.isValid(id));

      if (!ids.length) return NextResponse.json({ok: true, data: []});
      // POBIERAMY WSZYSTKIE PRODUKTY Z ZAPISANYMI IDS CZYLI  ID
      const products = await Product.find(
        {_id: {$in: ids}, status: "ACTIVE"},
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

      return NextResponse.json({ok: true, data: products});
    }

    // ✅ 2) standardowy listing z filtrami

    const gender = parseGender(sp.get("gender"));
    console.log("gender", gender);

    const collection = sp.get("collection") || undefined;

    const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
    const limit = Math.min(
      24,
      Math.max(1, parseInt(sp.get("limit") || "12", 10))
    );
    const skip = (page - 1) * limit;

    const sortKey = (sp.get("sort") as SortKey) || "newest";

    // ✅ OBSŁUGA OBU FORMATÓW:
    // - FiltersBar: size=S&size=M + color=black
    // - CSV: sizes=S,M + colors=black,white
    const sizes = [...sp.getAll("size"), ...csvParam(sp, "sizes")].filter(
      Boolean
    );

    const colors = [...sp.getAll("color"), ...csvParam(sp, "colors")].filter(
      Boolean
    );

    const inStock = sp.get("inStock") === "true";
    const bestseller = sp.get("bestseller") === "true";

    const sortMap: Record<SortKey, Record<string, 1 | -1>> = {
      newest: {createdAt: -1},
      price_asc: {price: 1},
      price_desc: {price: -1},
      popular: {popularity: -1, createdAt: -1},
      title_asc: {title: 1},
    };

    const where: Where = {};
    where.status = "ACTIVE";
    if (gender) where.gender = gender;
    if (collection) where.collectionSlug = collection;
    if (bestseller) where.isBestseller = true;

    const variantMatch: VariantMatch = {};
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

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      ok: true,
      data: items,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ok: false, error: "fetch error"}, {status: 500});
  }
}

// ✅ CREATE PRODUCT (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const role = (session?.user as {role?: "user" | "admin"} | undefined)?.role;
    if (!session || role !== "admin") {
      return NextResponse.json(
        {ok: false, error: "Unauthorized"},
        {status: 401}
      );
    }

    const body = (await req.json()) as CreateProductBody;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";

    if (!title || !slug) {
      return NextResponse.json(
        {ok: false, error: "title and slug are required"},
        {status: 400}
      );
    }

    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        {ok: false, error: "Invalid price"},
        {status: 400}
      );
    }

    const category = parseCategory(body.category);
    if (!category) {
      return NextResponse.json(
        {ok: false, error: "category is required (TSHIRT | HOODIE)"},
        {status: 400}
      );
    }

    const status = parseStatus(body.status) ?? "ACTIVE";

    await connectToDatabase();

    // slug unique
    const exists = await Product.findOne({slug}).select("_id").lean();
    if (exists) {
      return NextResponse.json(
        {ok: false, error: "Slug already exists"},
        {status: 409}
      );
    }

    // images: string[] lub [{src,alt,primary}]
    const imagesRaw = Array.isArray(body.images)
      ? (body.images as IncomingImage[])
      : [];

    const images = imagesRaw
      .map((img) => {
        if (typeof img === "string") return {src: img, alt: "", primary: false};
        if (img && typeof img === "object" && typeof img.src === "string") {
          return {
            src: img.src,
            alt: typeof img.alt === "string" ? img.alt : "",
            primary: Boolean(img.primary),
          };
        }
        return null;
      })
      .filter((x): x is {src: string; alt: string; primary: boolean} =>
        Boolean(x)
      );

    // variants
    const variantsRaw = Array.isArray(body.variants)
      ? (body.variants as IncomingVariant[])
      : [];

    const variants = variantsRaw
      .map((v) => {
        if (!v || typeof v !== "object") return null;

        const sku = typeof v.sku === "string" ? v.sku.trim() : "";
        const size =
          typeof v.size === "string" ? v.size.trim().toUpperCase() : "";
        const color =
          typeof v.color === "string" ? v.color.trim().toLowerCase() : "";

        const stockNum = Number(v.stock);

        return {
          sku,
          size,
          color,
          stock: Number.isFinite(stockNum) ? Math.max(0, stockNum) : 0,
        };
      })
      .filter(
        (x): x is {sku: string; size: string; color: string; stock: number} =>
          Boolean(x)
      );

    // sections
    const sectionsRaw = Array.isArray(body.sections)
      ? (body.sections as IncomingSection[])
      : [];

    const sections = sectionsRaw
      .map((s) => {
        if (!s || typeof s !== "object") return null;

        const title = typeof s.title === "string" ? s.title.trim() : "";
        if (!title) return null;

        const items = Array.isArray(s.items)
          ? s.items.filter((x): x is string => typeof x === "string")
          : [];

        return {title, items};
      })
      .filter((x): x is {title: string; items: string[]} => Boolean(x));

    // deliveryReturns
    const dr = body.deliveryReturns as IncomingDeliveryReturns | undefined;

    const deliveryReturns =
      dr && typeof dr === "object"
        ? {
            title: typeof dr.title === "string" ? dr.title : "",
            content: typeof dr.content === "string" ? dr.content : "",
          }
        : undefined;
    const tags = Array.isArray(body.tags)
      ? (body.tags as unknown[]).filter(
          (t): t is string => typeof t === "string"
        )
      : [];

    const gender = parseGender(body.gender);

    const collectionSlug =
      typeof body.collectionSlug === "string" ? body.collectionSlug : undefined;

    // ✅ styleCode: jeśli nie podasz — generujemy raz
    const styleCode =
      typeof body.styleCode === "string" && body.styleCode.trim()
        ? body.styleCode.trim()
        : generateStyleCode({
            title,
            slug,
            gender,
            collectionSlug,
            tags,
          });

    const doc = await Product.create({
      title,
      slug,

      price,
      oldPrice: body.oldPrice ?? undefined,
      currency: typeof body.currency === "string" ? body.currency : "GBP",

      images,

      gender,
      category,
      status,
      collectionSlug,
      tags,

      variants,

      isBestseller: Boolean(body.isBestseller),
      popularity: Number.isFinite(Number(body.popularity))
        ? Number(body.popularity)
        : 0,

      summary: typeof body.summary === "string" ? body.summary : "",
      sections,
      styleCode,
      deliveryReturns,
    });

    return NextResponse.json({ok: true, data: doc}, {status: 201});
  } catch (e: unknown) {
    console.error(e);

    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as {code?: number}).code === 11000
    ) {
      return NextResponse.json(
        {ok: false, error: "Duplicate key"},
        {status: 409}
      );
    }

    return NextResponse.json({ok: false, error: "create error"}, {status: 500});
  }
}
