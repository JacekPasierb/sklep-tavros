// lib/products/generateStyleCode.ts
import crypto from "crypto";
import { ShopGender } from "../../types/(shop)/product";


type ProductForStyleCode = {
  title: string;
  slug: string;
  gender?:ShopGender;
  collectionSlug?: string;
  tags?: string[];
};

const BRAND_PREFIX = "TVR";

/**
 * Mapowanie "typ produktu" → 3-5 liter.
 * Możesz to dopasować do swoich kolekcji/tagów.
 */
function inferCategoryCode(p: ProductForStyleCode): string {
  const s = `${p.slug} ${p.title} ${p.collectionSlug ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();

  // przykłady
  if (s.includes("hood") || s.includes("hoodie")) return "HOOD";
  if (s.includes("sweat") || s.includes("crew")) return "CREW";
  if (s.includes("tshirt") || s.includes("t-shirt") || s.includes("tee")) return "TEE";
  if (s.includes("jogger") || s.includes("pants") || s.includes("trouser")) return "PANT";
  if (s.includes("short")) return "SHRT";
  if (s.includes("jacket")) return "JACK";
  if (s.includes("cap")) return "CAP";

  return "ITEM"; // fallback
}

function inferGenderCode(g?: ProductForStyleCode["gender"]): string {
  switch (g) {
    case "mens":
      return "M";
    case "womens":
      return "W";
    case "kids":
      return "K";
    default:
      return "U";
  }
}

/**
 * Stabilny styleCode (deterministyczny):
 * TVR-<CAT>-<G>-<HASH>
 *
 * HASH jest robiony z danych produktu (w tym slug), więc nie musisz slug'a zmieniać.
 * Jeśli zmienisz title/collectionSlug/tags, styleCode się zmieni → to plus/minus.
 * Jeśli chcesz, żeby styleCode nigdy się nie zmieniał po stworzeniu, to po prostu:
 * - generuj go raz przy CREATE
 * - i nie przeliczaj przy UPDATE
 */
export function generateStyleCode(product: ProductForStyleCode): string {
  const cat = inferCategoryCode(product);
  const g = inferGenderCode(product.gender);

  const payload = JSON.stringify({
    slug: product.slug,
    title: product.title,
    gender: product.gender ?? null,
    collectionSlug: product.collectionSlug ?? null,
    tags: (product.tags ?? []).slice().sort(),
  });

  // 5-6 znaków wystarczy (base32-ish z hex)
  const hash = crypto.createHash("sha256").update(payload).digest("hex").slice(0, 6).toUpperCase();

  return `${BRAND_PREFIX}-${cat}-${g}-${hash}`;
}
