import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "../../../../../lib/authOptions"; // <- dopasuj ścieżkę
import {connectToDatabase} from "../../../../../lib/mongodb";
import Product from "../../../../../models/Product";
import { parseCategory, parseGender } from "../../../../../lib/utils/shared/parsers/product";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function toNumber(v: unknown): number | undefined {
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function normalizeImages(v: unknown) {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => ({
      src: typeof x?.src === "string" ? x.src.trim() : "",
      alt: typeof x?.alt === "string" ? x.alt.trim() : "",
      primary: Boolean(x?.primary),
    }))
    .filter((x) => x.src.length > 0)
    .slice(0, 5);
}

function normalizeVariants(v: unknown) {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => ({
      sku: typeof x?.sku === "string" ? x.sku.trim() : "",
      size: typeof x?.size === "string" ? x.size.trim().toUpperCase() : "",
      color: typeof x?.color === "string" ? x.color.trim().toLowerCase() : "",
      stock: Number.isFinite(Number(x?.stock))
        ? Math.max(0, Math.floor(Number(x.stock)))
        : 0,
    }))
    .filter((x) => x.size && x.color);
}

function normalizeSections(v: unknown) {
  if (!Array.isArray(v)) return [];
  return v
    .map((s) => ({
      title: typeof s?.title === "string" ? s.title.trim() : "",
      items: Array.isArray(s?.items)
        ? s.items
            .map((it: unknown) => (typeof it === "string" ? it.trim() : ""))
            .filter(Boolean)
        : [],
    }))
    .filter((s) => s.title && s.items.length > 0);
}

export async function PATCH(
  req: Request,
  {params}: {params: Promise<{id: string}>}
) {
  const {id} = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as {role?: "admin"} | undefined)?.role;

  if (!session || role !== "admin") {
    return NextResponse.json({ok: false, error: "Unauthorized"}, {status: 401});
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ok: false, error: "Invalid JSON"}, {status: 400});
  }

  // ---- required/basic ----
  const title = isNonEmptyString(body.title) ? body.title.trim() : "";
  const slug = isNonEmptyString(body.slug) ? body.slug.trim() : "";

  const price = toNumber(body.price);
  if (!title || !slug || price == null || price < 0) {
    return NextResponse.json(
      {ok: false, error: "Invalid title/slug/price"},
      {status: 400}
    );
  }

  const gender = parseGender(body.gender);
  if (!gender) {
    return NextResponse.json(
      {ok: false, error: "Invalid gender"},
      {status: 400}
    );
  }

  const category = parseCategory(body.category);
  if (!category) {
    return NextResponse.json(
      {ok: false, error: "Invalid category"},
      {status: 400}
    );
  }

  // oldPrice optional (ale jeśli jest, to >= 0)
  const oldPrice = body.oldPrice == null ? undefined : toNumber(body.oldPrice);
  if (oldPrice != null && oldPrice < 0) {
    return NextResponse.json(
      {ok: false, error: "Invalid oldPrice"},
      {status: 400}
    );
  }

  const collectionSlug =
    typeof body.collectionSlug === "string" && body.collectionSlug.trim()
      ? body.collectionSlug.trim()
      : undefined;

  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((t: unknown) => typeof t === "string")
        .map((t: string) => t.trim())
    : [];

  const images = normalizeImages(body.images);
  if (images.length === 0) {
    return NextResponse.json(
      {ok: false, error: "At least 1 image is required"},
      {status: 400}
    );
  }

  const variants = normalizeVariants(body.variants);
  if (variants.length === 0) {
    return NextResponse.json(
      {ok: false, error: "Variants are required"},
      {status: 400}
    );
  }

  const summary = typeof body.summary === "string" ? body.summary : "";
  const styleCode =
    typeof body.styleCode === "string" ? body.styleCode.trim() : "";

  const sections = normalizeSections(body.sections);

  const deliveryReturns =
    body.deliveryReturns && typeof body.deliveryReturns === "object"
      ? {
          title:
            typeof body.deliveryReturns.title === "string"
              ? body.deliveryReturns.title.trim()
              : "Delivery & Returns",
          content:
            typeof body.deliveryReturns.content === "string"
              ? body.deliveryReturns.content.trim()
              : "",
        }
      : {title: "Delivery & Returns", content: ""};

  await connectToDatabase();

  // dodatkowa ochrona: slug unikalny (jeśli zmieniasz slug na taki co już istnieje)
  const existing = await Product.findOne({slug, _id: {$ne: id}})
    .select({_id: 1})
    .lean();
  if (existing) {
    return NextResponse.json(
      {ok: false, error: "Slug already exists"},
      {status: 409}
    );
  }

  await Product.updateOne(
    {_id: id},
    {
      $set: {
        title,
        slug,
        price,
        oldPrice,
        gender,
        category,
        collectionSlug,
        tags,
        images,
        variants,
        summary,
        sections,
        styleCode,
        deliveryReturns,
      },
    }
  );

  return NextResponse.json({ok: true});
}
