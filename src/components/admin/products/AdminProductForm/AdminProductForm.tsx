"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {
  AdminProductFormInitial,
  CollectionDTO,
  ColorRow,
  ImgInput,
  SectionInput,
  Size,
} from "../../../../types/admin/productForm";
import {
  genderUpperToLower,
  toSlugFromTitle,
} from "../../../../lib/utils/admin/products/formText";
import {ProductCategory, ProductGender} from "../../../../types/product";
import {
  emptyColorRow,
  emptyImg,
  emptySection,
} from "../../../../lib/utils/admin/products/formDefaults";
import {
  sectionsToInputs,
  variantsToColorRows,
} from "../../../../lib/utils/admin/products/formTransform";
import {uploadProductImage} from "../../../../lib/services/admin/image.service";
import {saveAdminProduct} from "../../../../lib/services/admin/productsForm.service";

import {BadgesSection} from "./sections/BadgesSection";
import {ImagesSection} from "./sections/ImagesSection";
import {VariantsSection} from "./sections/VariantsSection";
import {SectionsEditor} from "./sections/SectionsEditor";
import {DeliveryReturnsEditor} from "./sections/DeliveryReturnsEditor";
import { ProductBasicSection } from "./sections/ProductBasicSection";

export function AdminProductForm({
  mode,
  initialProduct,
}: {
  mode: "create" | "edit";
  initialProduct: AdminProductFormInitial;
}) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // BASIC
  const [title, setTitle] = useState(initialProduct.title);
  const slug = useMemo(() => toSlugFromTitle(title), [title]);

  const [price, setPrice] = useState<string>(String(initialProduct.price));

  // TAGS
  const initTags = initialProduct.tags ?? [];
  const [tagNew, setTagNew] = useState(initTags.includes("new"));
  const [tagSale, setTagSale] = useState(initTags.includes("sale"));
  const [tagBestseller, setTagBestseller] = useState(
    initTags.includes("bestseller")
  );

  const [oldPrice, setOldPrice] = useState<string>(
    initialProduct.oldPrice != null ? String(initialProduct.oldPrice) : ""
  );

  const [gender, setGender] = useState<ProductGender>(initialProduct.gender);
  const [category, setCategory] = useState<ProductCategory>(
    initialProduct.category
  );

  // COLLECTION SELECT
  const [collections, setCollections] = useState<CollectionDTO[]>([]);
  const [collectionSlug, setCollectionSlug] = useState(
    initialProduct.collectionSlug ?? ""
  );

  // IMAGES: 5 slots
  const [images, setImages] = useState<ImgInput[]>(() => {
    const slots = Array.from({length: 5}, () => emptyImg());
    initialProduct.images.slice(0, 5).forEach((img, idx) => {
      slots[idx] = {src: (img?.src ?? "").trim()};
    });
    return slots;
  });

  // VARIANTS
  const [colorRows, setColorRows] = useState<ColorRow[]>(
    mode === "edit"
      ? variantsToColorRows(initialProduct.variants, category)
      : [emptyColorRow()]
  );

  // DESCRIPTION
  const [summary, setSummary] = useState(initialProduct.summary ?? "");
  const [styleCode, setStyleCode] = useState(initialProduct.styleCode ?? "");
  const [sections, setSections] = useState<SectionInput[]>(
    sectionsToInputs(initialProduct.sections)
  );

  const [deliveryTitle, setDeliveryTitle] = useState(
    initialProduct.deliveryReturns?.title ?? "Delivery & Returns"
  );
  const [deliveryContent, setDeliveryContent] = useState(
    initialProduct.deliveryReturns?.content ?? ""
  );

  // load collections
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

  // images handlers
  function updateImage(idx: number, patch: Partial<ImgInput>) {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? {...img, ...patch} : img))
    );
  }

  async function onUploadImage(idx: number, file: File | null) {
    if (!file) return;
    setError(null);
    updateImage(idx, {uploading: true});

    try {
      const url = await uploadProductImage(file);
      updateImage(idx, {src: url, uploading: false});
    } catch (e) {
      console.error(e);
      updateImage(idx, {uploading: false});
      setError("Image upload failed.");
    }
  }

  // variants handlers
  function onChangeRow(i: number, patch: Partial<ColorRow>) {
    setColorRows((prev) =>
      prev.map((r, idx) => (idx === i ? {...r, ...patch} : r))
    );
  }
  function onChangeStock(i: number, size: Size, value: string) {
    setColorRows((prev) =>
      prev.map((r, idx) =>
        idx !== i ? r : {...r, stockBySize: {...r.stockBySize, [size]: value}}
      )
    );
  }
  function onAddColor() {
    setColorRows((prev) => [...prev, emptyColorRow()]);
  }
  function onRemoveColor(i: number) {
    setColorRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const result = await saveAdminProduct({
      mode,
      productId: initialProduct._id,
      state: {
        title,
        price,
        oldPrice,
        gender,
        category,
        collectionSlug,
        tagNew,
        tagSale,
        tagBestseller,
        images,
        colorRows,
        summary,
        styleCode,
        sections,
        deliveryTitle,
        deliveryContent,
      },
    });

    if (!result.ok) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
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

      <ProductBasicSection
        title={title}
        setTitle={setTitle}
        slug={slug}
        price={price}
        setPrice={setPrice}
        category={category}
        setCategory={setCategory}
        gender={gender}
        setGender={setGender}
        collectionSlug={collectionSlug}
        setCollectionSlug={setCollectionSlug}
        collectionsForGender={collectionsForGender}
      />

      <BadgesSection
        tagNew={tagNew}
        setTagNew={setTagNew}
        tagSale={tagSale}
        setTagSale={setTagSale}
        tagBestseller={tagBestseller}
        setTagBestseller={setTagBestseller}
        oldPrice={oldPrice}
        setOldPrice={setOldPrice}
      />

      <ImagesSection
        title={title}
        images={images}
        onUpload={onUploadImage}
        onRemove={(idx) => updateImage(idx, {src: ""})}
      />

      <VariantsSection
        category={category}
        colorRows={colorRows}
        onAdd={onAddColor}
        onRemove={onRemoveColor}
        onChangeRow={onChangeRow}
        onChangeStock={onChangeStock}
      />

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

        <SectionsEditor
          sections={sections}
          setSections={setSections}
          onAdd={() => setSections((prev) => [...prev, emptySection()])}
          canRemove={sections.length > 1}
        />

        <DeliveryReturnsEditor
          deliveryTitle={deliveryTitle}
          setDeliveryTitle={setDeliveryTitle}
          deliveryContent={deliveryContent}
          setDeliveryContent={setDeliveryContent}
        />
      </div>

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
          {isSaving
            ? "Saving…"
            : mode === "edit"
            ? "Save changes"
            : "Create product"}
        </button>
      </div>
    </form>
  );
}
