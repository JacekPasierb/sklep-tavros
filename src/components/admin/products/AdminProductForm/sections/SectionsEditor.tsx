import { SectionInput } from "../../../../../types/admin/productForm";



type Props = {
  sections: SectionInput[];
  setSections: React.Dispatch<React.SetStateAction<SectionInput[]>>;
  onAdd: () => void;
  canRemove: boolean;
};

export function SectionsEditor({ sections, setSections, onAdd, canRemove }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 space-y-3">
      <p className="text-xs font-semibold text-zinc-700">Sections (bullets)</p>

      {sections.map((s, i) => (
        <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-700">Section #{i + 1}</p>

            <button
              type="button"
              onClick={() => setSections((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={!canRemove}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          <input
            value={s.title}
            onChange={(e) =>
              setSections((prev) =>
                prev.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x))
              )
            }
            className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-black"
            placeholder="e.g. Materials"
          />

          <textarea
            value={s.itemsText}
            onChange={(e) =>
              setSections((prev) =>
                prev.map((x, idx) => (idx === i ? { ...x, itemsText: e.target.value } : x))
              )
            }
            className="w-full min-h-[90px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black"
            placeholder={"One bullet per line\n100% cotton\nMade in EU"}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50"
      >
        + Add section
      </button>
    </div>
  );
}
