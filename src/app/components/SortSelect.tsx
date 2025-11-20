"use client";

import {useRouter, useSearchParams} from "next/navigation";

export default function SortSelect({currentSort}: {currentSort: string}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (k: string, v?: string | null) => {
    const usp = new URLSearchParams(searchParams.toString());
    if (!v) usp.delete(k);
    else usp.set(k, v);
    router.replace(`?${usp.toString()}`, {scroll: false});
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-neutral-500">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="title_asc">A-Z</option>
      </select>
    </div>
  );
}
