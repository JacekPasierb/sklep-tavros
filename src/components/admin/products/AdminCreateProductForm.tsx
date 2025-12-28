// src/components/admin/products/AdminCreateProductForm.tsx
"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {uploadImage} from "../../../lib/uploadImage";

type Gender = "MENS" | "WOMENS" | "KIDS";
type CollectionGender = "mens" | "womens" | "kids";

type ImgInput = {
  src: string; // final URL (cloudinary)
  uploading?: boolean;
};

type SectionInput = {
  title: string;
  itemsText: string; // one per line
};

type CollectionDTO = {
  slug: string;
  name: string;
  gender: CollectionGender[];
};

// ✅ NARZUCONE ROZMIARY (zmień raz i masz spójnie w całym sklepie)
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
type Size = (typeof SIZES)[number];

// ✅ Kolor -> stany per size
type ColorRow = {
  color: string; // np. "black"
  skuPrefix?: string; // opcjonalnie
  stockBySize: Record<Size, string>; // input string
};

type Category = "TSHIRT" | "HOODIE";

const emptyImg = (): ImgInput => ({src: ""});

const emptySection = (): SectionInput => ({
  title: "",
  itemsText: "",
});

const emptyColorRow = (): ColorRow => ({
  color: "",
  skuPrefix: "",
  stockBySize: SIZES.reduce((acc, s) => {
    acc[s] = "0";
    return acc;
  }, {} as Record<Size, string>),
});

function toSlugFromTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function genderUpperToLower(g: Gender): CollectionGender {
  if (g === "MENS") return "mens";
  if (g === "WOMENS") return "womens";
  return "kids";
}

function normalizeColor(value: string) {
  return value.trim().toLowerCase();
}

function safeIntStock(v: string) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function buildAutoAlt(title: string, idx: number) {
  const t = title.trim();
  if (!t) return idx === 0 ? "Main product image" : "Product image";
  return idx === 0 ? `${t} – main image` : `${t} – image #${idx + 1}`;
}

export function AdminCreateProductForm() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // BASIC
  const [title, setTitle] = useState("");
  const slug = useMemo(() => toSlugFromTitle(title), [title]);

  const [price, setPrice] = useState<string>("0");

  // ✅ TAGS JAKO CHECKBOXY
  const [tagNew, setTagNew] = useState(false);
  const [tagSale, setTagSale] = useState(false);
  const [tagBestseller, setTagBestseller] = useState(false);

  // ✅ oldPrice tylko gdy sale = true (UI w sekcji checkboxów)
  const [oldPrice, setOldPrice] = useState<string>("");

  const [gender, setGender] = useState<Gender>("MENS");
  const [category, setCategory] = useState<Category>("TSHIRT");

  // COLLECTION SELECT
  const [collections, setCollections] = useState<CollectionDTO[]>([]);
  const [collectionSlug, setCollectionSlug] = useState("");

  // IMAGES: 5 slots, [0] main
  const [images, setImages] = useState<ImgInput[]>(
    Array.from({length: 5}, () => emptyImg())
  );

  // ✅ COLORS -> STOCKS PER SIZE
  const [colorRows, setColorRows] = useState<ColorRow[]>([emptyColorRow()]);

  // DESCRIPTION
  const [summary, setSummary] = useState("");
  const [styleCode, setStyleCode] = useState("");
  const [sections, setSections] = useState<SectionInput[]>([
    {title: "Details", itemsText: ""},
  ]);
  const [deliveryTitle, setDeliveryTitle] = useState("Delivery & Returns");
  const [deliveryContent, setDeliveryContent] = useState("");

  // --- load collections ---
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/collections", {cache: "no-store"});
        if (!res.ok) return;
        const data = await res.json();
        const list = (data?.collections ?? []) as CollectionDTO[];
        if (alive) setCollections(Array.isArray(list) ? list : []);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const collectionsForGender = useMemo(() => {
    const g = genderUpperToLower(gender);
    return collections.filter((c) =>
      c.gender?.length ? c.gender.includes(g) : true
    );
  }, [collections, gender]);

  function updateImage(idx: number, patch: Partial<ImgInput>) {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? {...img, ...patch} : img))
    );
  }

  async function onPickFile(idx: number, file: File | null) {
    if (!file) return;
    setError(null);
    updateImage(idx, {uploading: true});

    try {
      const uploaded = await uploadImage(file);
      updateImage(idx, {src: uploaded.url, uploading: false});
    } catch (e) {
      console.error(e);
      updateImage(idx, {uploading: false});
      setError(
        "Image upload failed. Check /api/admin/upload and Cloudinary envs."
      );
    }
  }

  // ---- COLORS helpers ----
  function updateColorRow(i: number, patch: Partial<ColorRow>) {
    setColorRows((prev) =>
      prev.map((r, idx) => (idx === i ? {...r, ...patch} : r))
    );
  }

  function updateStock(i: number, size: Size, value: string) {
    setColorRows((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        return {...r, stockBySize: {...r.stockBySize, [size]: value}};
      })
    );
  }

  function addColorRow() {
    setColorRows((prev) => [...prev, emptyColorRow()]);
  }

  function removeColorRow(i: number) {
    setColorRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function normalizeSections() {
    return sections
      .map((s) => ({
        title: s.title.trim(),
        items: s.itemsText
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
      }))
      .filter((s) => s.title && s.items.length > 0);
  }

  // ✅ Z colorRows robimy variants[] (wszystkie rozmiary z góry)
  function buildVariants() {
    const rows = colorRows
      .map((r) => ({
        color: normalizeColor(r.color),
        skuPrefix: (r.skuPrefix ?? "").trim(),
        stockBySize: r.stockBySize,
      }))
      .filter((r) => r.color.length > 0);

    // unikalne kolory
    const seen = new Set<string>();
    const uniqueRows = rows.filter((r) => {
      if (seen.has(r.color)) return false;
      seen.add(r.color);
      return true;
    });

    // nawet jak 0 — tworzymy wariant (UI pokaże “niedostępne”)
    return uniqueRows.flatMap((r) =>
      SIZES.map((size) => {
        const stock = safeIntStock(r.stockBySize[size]);
        const sku = r.skuPrefix ? `${r.skuPrefix}-${size}` : "";
        return {sku, size, color: r.color, stock};
      })
    );
  }

  function buildTags(): string[] {
    const tags: string[] = [];
    if (tagNew) tags.push("new");
    if (tagSale) tags.push("sale");
    if (tagBestseller) tags.push("bestseller");
    return tags;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const titleTrim = title.trim();
      if (!titleTrim) {
        setError("Title is required.");
        return;
      }

      const slugFinal = toSlugFromTitle(titleTrim);
      if (!slugFinal) {
        setError("Slug could not be generated. Check the title.");
        return;
      }

      const priceNumber = Number(price);
      if (!Number.isFinite(priceNumber) || priceNumber < 0) {
        setError("Price must be a valid number (>= 0).");
        return;
      }

      // oldPrice wymagamy tylko gdy sale zaznaczone
      let oldPriceNumber: number | undefined = undefined;
      if (tagSale) {
        const v = Number(oldPrice);
        if (!Number.isFinite(v) || v <= priceNumber) {
          setError("For SALE you must set old price > price.");
          return;
        }
        oldPriceNumber = v;
      }

      const mainSrc = images[0]?.src?.trim();
      if (!mainSrc) {
        setError("Main image (slot #1) is required.");
        return;
      }

      const imagesPayload = images
        .map((img, i) => ({
          src: img.src.trim(),
          alt: buildAutoAlt(titleTrim, i),
        }))
        .filter((img) => img.src.length > 0)
        .slice(0, 5);

      if (imagesPayload.length === 0) {
        setError("At least 1 image is required.");
        return;
      }

      const variantsPayload = buildVariants();
      if (variantsPayload.length === 0) {
        setError(
          "Add at least one color (variants are generated for all sizes)."
        );
        return;
      }

      const body = {
        title: titleTrim,
        slug: slugFinal,
        price: priceNumber,
        oldPrice: oldPriceNumber, // tylko gdy sale
        gender,
        category,
        collectionSlug: collectionSlug || undefined,
        tags: buildTags(),

        images: imagesPayload, // [0] = main
        variants: variantsPayload,

        summary: summary.trim(),
        sections: normalizeSections(),
        styleCode: styleCode.trim(),
        deliveryReturns: {
          title: deliveryTitle.trim(),
          content: deliveryContent.trim(),
        },
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Create failed");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Create failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-6"
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* BASIC */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-black"
            placeholder="Tavros Classic T-Shirt"
            required
          />
          <p className="mt-2 text-xs text-zinc-500">
            Slug will be generated automatically:{" "}
            <span className="font-semibold text-black">{slug || "—"}</span>
          </p>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Price
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-black"
            placeholder="e.g. 29.99"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
          >
            <option value="TSHIRT">TSHIRT</option>
            <option value="HOODIE">HOODIE</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value as Gender);
              setCollectionSlug("");
            }}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
          >
            <option value="MENS">MENS</option>
            <option value="WOMENS">WOMENS</option>
            <option value="KIDS">KIDS</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Collection
          </label>
          <select
            value={collectionSlug}
            onChange={(e) => setCollectionSlug(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
          >
            <option value="">— none —</option>
            {collectionsForGender.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ TAGS: CHECKBOXY + oldPrice tylko dla SALE */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Badges
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={tagNew}
              onChange={(e) => setTagNew(e.target.checked)}
              className="h-4 w-4"
            />
            <div>
              <p className="text-sm font-semibold text-zinc-900">New</p>
              <p className="text-xs text-zinc-500">Show “NEW” badge</p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={tagSale}
              onChange={(e) => {
                const checked = e.target.checked;
                setTagSale(checked);
                if (!checked) setOldPrice("");
              }}
              className="h-4 w-4"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-900">Sale</p>
              <p className="text-xs text-zinc-500">Enable old price</p>

              {/* oldPrice w środku checkboxa */}
              <div className="mt-2">
                <input
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  inputMode="decimal"
                  disabled={!tagSale}
                  className={[
                    "w-full rounded-2xl border px-4 py-2 text-sm outline-none",
                    tagSale
                      ? "border-zinc-200 bg-white focus:border-black"
                      : "border-zinc-200 bg-zinc-100 text-zinc-500 cursor-not-allowed",
                  ].join(" ")}
                  placeholder={
                    tagSale ? "Old price (e.g. 49.99)" : "Enable Sale to edit"
                  }
                />
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={tagBestseller}
              onChange={(e) => setTagBestseller(e.target.checked)}
              className="h-4 w-4"
            />
            <div>
              <p className="text-sm font-semibold text-zinc-900">Bestseller</p>
              <p className="text-xs text-zinc-500">Boost visibility</p>
            </div>
          </label>
        </div>
      </div>

      {/* IMAGES */}
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5 space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Images (5 slots) — slot #1 is MAIN
          </p>
          <p className="text-sm text-zinc-600">
            Admin tylko wrzuca pliki. ALT generuje się automatycznie.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 bg-white p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-zinc-700">
                  {idx === 0 ? "Main image" : `Image #${idx + 1}`}
                  {idx === 0 && (
                    <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
                      REQUIRED
                    </span>
                  )}
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      onPickFile(idx, e.target.files?.[0] ?? null)
                    }
                  />
                  {img.uploading ? "Uploading…" : "Upload"}
                </label>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <div className="relative h-24 w-full overflow-hidden rounded-xl bg-zinc-100 border">
                    {img.src ? (
                      <Image
                        src={img.src}
                        alt={buildAutoAlt(title, idx)}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-xs text-zinc-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-8">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    URL
                  </p>
                  <p className="mt-2 text-xs text-zinc-600 break-all">
                    {img.src ? img.src : "URL will appear here after upload"}
                  </p>

                  {/* szybkie czyszczenie slotu */}
                  {img.src && (
                    <button
                      type="button"
                      onClick={() => updateImage(idx, {src: ""})}
                      className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VARIANTS (COLORS x SIZES) */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Stock by color (sizes are fixed)
            </p>
            <p className="text-sm text-zinc-600">
              Dodajesz kolor, a potem wpisujesz stock dla:{" "}
              <span className="font-semibold text-black">
                {SIZES.join(", ")}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={addColorRow}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50"
          >
            + Add color
          </button>
        </div>

        <div className="space-y-3">
          {colorRows.map((row, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 space-y-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
                <div className="sm:col-span-5">
                  <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Color
                  </label>
                  <input
                    value={row.color}
                    onChange={(e) => updateColorRow(i, {color: e.target.value})}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
                    placeholder="black"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    SKU prefix (optional)
                  </label>
                  <input
                    value={row.skuPrefix ?? ""}
                    onChange={(e) =>
                      updateColorRow(i, {skuPrefix: e.target.value})
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
                    placeholder={`TVR-${category}-BLK`}
                  />
                </div>

                <div className="sm:col-span-2 flex sm:justify-end">
                  <button
                    type="button"
                    onClick={() => removeColorRow(i)}
                    disabled={colorRows.length <= 1}
                    className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                {SIZES.map((size) => (
                  <div key={size}>
                    <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      {size}
                    </label>
                    <input
                      value={row.stockBySize[size]}
                      onChange={(e) => updateStock(i, size, e.target.value)}
                      inputMode="numeric"
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Description
          </p>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-2 w-full min-h-[110px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Style code
          </label>
          <input
            value={styleCode}
            onChange={(e) => setStyleCode(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 space-y-3">
          <p className="text-xs font-semibold text-zinc-700">
            Sections (bullets)
          </p>

          {sections.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-white p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-zinc-700">
                  Section #{i + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setSections((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  disabled={sections.length <= 1}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>

              <input
                value={s.title}
                onChange={(e) =>
                  setSections((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? {...x, title: e.target.value} : x
                    )
                  )
                }
                className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-black"
                placeholder="e.g. Materials"
              />

              <textarea
                value={s.itemsText}
                onChange={(e) =>
                  setSections((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? {...x, itemsText: e.target.value} : x
                    )
                  )
                }
                className="w-full min-h-[90px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder={"One bullet per line\n100% cotton\nMade in EU"}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setSections((prev) => [...prev, emptySection()])}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50"
          >
            + Add section
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 space-y-2">
          <p className="text-xs font-semibold text-zinc-700">
            Delivery & Returns
          </p>

          <input
            value={deliveryTitle}
            onChange={(e) => setDeliveryTitle(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-black"
          />

          <textarea
            value={deliveryContent}
            onChange={(e) => setDeliveryContent(e.target.value)}
            className="w-full min-h-[90px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Create product"}
        </button>
      </div>
    </form>
  );
}
