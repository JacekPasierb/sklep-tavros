type Props = {
    tagNew: boolean;
    setTagNew: (v: boolean) => void;
  
    tagSale: boolean;
    setTagSale: (v: boolean) => void;
  
    tagBestseller: boolean;
    setTagBestseller: (v: boolean) => void;
  
    oldPrice: string;
    setOldPrice: (v: string) => void;
  };
  
  export function BadgesSection({
    tagNew,
    setTagNew,
    tagSale,
    setTagSale,
    tagBestseller,
    setTagBestseller,
    oldPrice,
    setOldPrice,
  }: Props) {
    return (
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
                  placeholder={tagSale ? "Old price (e.g. 49.99)" : "Enable Sale to edit"}
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
    );
  }
  