import { CollectionDTO } from "../../../../../types/admin/productForm";
import { ProductCategory, ProductGender } from "../../../../../types/product";



type Props = {
  title: string;
  setTitle: (v: string) => void;
  slug: string;

  price: string;
  setPrice: (v: string) => void;

  category: ProductCategory;
  setCategory: (v: ProductCategory) => void;

  gender: ProductGender;
  setGender: (v: ProductGender) => void;

  collectionSlug: string;
  setCollectionSlug: (v: string) => void;

  collectionsForGender: CollectionDTO[];
};

export function ProductBasicSection({
  title,
  setTitle,
  slug,
  price,
  setPrice,
  category,
  setCategory,
  gender,
  setGender,
  collectionSlug,
  setCollectionSlug,
  collectionsForGender,
}: Props) {
  return (
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
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
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
            setGender(e.target.value as ProductGender);
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
  );
}
