import {Types} from "mongoose";
import {ProductGender, TypeProduct} from "../../../types/product";
import {SortOption} from "../../../types/filters";
import {GetProductsOptions, ProductsResult} from "../../../types/shop/products";
import {connectToDatabase} from "../../mongodb";
import Product from "../../../models/Product";

type MongoId = Types.ObjectId | string;
type LeanProduct = Omit<TypeProduct, "_id"> & {_id: MongoId};

function normalizeProduct(doc: LeanProduct): TypeProduct {
  return {
    ...doc,
    _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
  };
}

function parsePaging(page = 1, limit = 12) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
  return {safePage, safeLimit, skip: (safePage - 1) * safeLimit};
}

function buildSort(sort?: SortOption): Record<string, 1 | -1> {
  if (sort === "price_asc") return {price: 1};
  if (sort === "price_desc") return {price: -1};
  return {createdAt: -1};
}

function buildProductsWhere(opts: GetProductsOptions): Record<string, unknown> {
  const {gender, mode = "all", collectionSlug, sizes, colors} = opts;

  const where: Record<string, unknown> = {status: "ACTIVE"};

  if (gender) where.gender = gender;

  if (mode === "bestseller") where.tags = {$in: ["bestseller"]};
  if (mode === "sale") where.tags = {$in: ["sale"]};
  if (mode === "new") where.tags = {$in: ["new"]};

  if (mode === "collection" && collectionSlug)
    where.collectionSlug = collectionSlug;

  if ((sizes && sizes.length) || (colors && colors.length)) {
    const variantMatch: Record<string, unknown> = {stock: {$gt: 0}};

    if (sizes?.length)
      variantMatch.size = {$in: sizes.map((s) => s.toUpperCase())};
    if (colors?.length) variantMatch.color = {$in: colors};

    where.variants = {$elemMatch: variantMatch};
  }

  return where;
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductsResult<TypeProduct>> {
  await connectToDatabase();

  const {page, limit, sort} = options;


  const where = buildProductsWhere(options);
  const sortQuery = buildSort(sort);


  const {safePage, safeLimit, skip} = parsePaging(page, limit);

  const total = await Product.countDocuments(where);

  const docs = await Product.find(where)
    .sort(sortQuery)
    .skip(skip)
    .limit(safeLimit)
    .lean<LeanProduct[]>();

  const items = docs.map(normalizeProduct);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {items, total, page: safePage, limit: safeLimit, totalPages};
}

export async function getProductBySlug(
  slug: string
): Promise<TypeProduct | null> {
  await connectToDatabase();

  const doc = await Product.findOne({slug, status: "ACTIVE"})
    .select(
      [
        "title",
        "slug",
        "price",
        "oldPrice",
        "currency",
        "images",
        "gender",
        "collectionSlug",
        "tags",
        "variants",
        "summary",
        "sections",
        "styleCode",
        "deliveryReturns",
      ].join(" ")
    )
    .lean<LeanProduct>();

  if (!doc) return null;
  return normalizeProduct(doc);
}

export async function getRelatedProducts(opts: {
  gender: ProductGender;
  collectionSlug?: string;
  excludeId?: string;
  limit?: number;
}): Promise<TypeProduct[]> {
  const {gender, collectionSlug, excludeId, limit = 4} = opts;

  await connectToDatabase();

  const where: Record<string, unknown> = {gender, status: "ACTIVE"};
  if (collectionSlug) where.collectionSlug = collectionSlug;
  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    where._id = {$ne: new Types.ObjectId(excludeId)};
  }

  const docs = await Product.find(where)
    .sort({createdAt: -1})
    .limit(limit)
    .select(
      "title price images slug gender collectionSlug currency tags oldPrice"
    )
    .lean<LeanProduct[]>();

  return docs.map(normalizeProduct);
}
