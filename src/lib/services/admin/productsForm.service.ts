import {
  ColorRow,
  ImgInput,
  SectionInput,
} from "../../../types/admin/productForm";
import {ProductCategory, ProductGender} from "../../../types/product";
import {
  buildAutoAlt,
  toSlugFromTitle,
} from "../../utils/admin/products/formText";
import {
  buildTags,
  buildVariants,
  normalizeSections,
} from "../../utils/admin/products/formTransform";

type SaveResult = {ok: true} | {ok: false; error: string};

type SaveMode = "create" | "edit";

export async function saveAdminProduct(input: {
  mode: SaveMode;
  productId?: string;
  state: {
    title: string;
    price: string;
    oldPrice: string;
    gender: ProductGender;
    category: ProductCategory;
    collectionSlug: string;
    tagNew: boolean;
    tagSale: boolean;
    tagBestseller: boolean;
    images: ImgInput[];
    colorRows: ColorRow[];
    summary: string;
    styleCode: string;
    sections: SectionInput[];
    deliveryTitle: string;
    deliveryContent: string;
  };
}): Promise<SaveResult> {
  const s = input.state;

  const titleTrim = s.title.trim();
  if (!titleTrim) return {ok: false, error: "Title is required." as const};

  const slugFinal = toSlugFromTitle(titleTrim);
  if (!slugFinal)
    return {ok: false, error: "Slug could not be generated." as const};

  const priceNumber = Number(s.price);
  if (!Number.isFinite(priceNumber) || priceNumber < 0)
    return {ok: false, error: "Price must be a valid number (>= 0)." as const};

  let oldPriceNumber: number | undefined = undefined;
  if (s.tagSale) {
    const v = Number(s.oldPrice);
    if (!Number.isFinite(v) || v <= priceNumber)
      return {
        ok: false,
        error: "For SALE you must set old price > price." as const,
      };
    oldPriceNumber = v;
  }

  const mainSrc = s.images[0]?.src?.trim();
  if (!mainSrc)
    return {ok: false, error: "Main image (slot #1) is required." as const};

  const imagesPayload = s.images
    .map((img, i) => ({src: img.src.trim(), alt: buildAutoAlt(titleTrim, i)}))
    .filter((img) => img.src.length > 0)
    .slice(0, 5);

  const variantsPayload = buildVariants(s.colorRows);
  if (variantsPayload.length === 0)
    return {ok: false, error: "Add at least one color." as const};

  const body = {
    title: titleTrim,
    slug: slugFinal,
    price: priceNumber,
    oldPrice: oldPriceNumber,
    gender: s.gender,
    category: s.category,
    collectionSlug: s.collectionSlug || undefined,
    tags: buildTags({
      isNew: s.tagNew,
      isSale: s.tagSale,
      isBestseller: s.tagBestseller,
    }),
    images: imagesPayload,
    variants: variantsPayload,
    summary: s.summary.trim(),
    sections: normalizeSections(s.sections),
    styleCode: s.styleCode.trim(),
    deliveryReturns: {
      title: s.deliveryTitle.trim(),
      content: s.deliveryContent.trim(),
    },
  };

  const url =
    input.mode === "edit"
      ? `/api/admin/products/${input.productId}`
      : "/api/products";
  const method = input.mode === "edit" ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: {"content-type": "application/json"},
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return {ok: false, error: data?.error ?? "Save failed"};
  }

  return {ok: true};
}
