// components/products/Pagination.tsx
"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

export const Pagination = ({currentPage, totalPages}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
  };

  const pagesToShow = getPagesToShow(currentPage, totalPages);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40"
      >
        Prev
      </button>

      {pagesToShow.map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="px-2 text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page as number)}
            className={
              "px-3 py-1 text-sm border rounded " +
              (page === currentPage
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black")
            }
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

const getPagesToShow = (current: number, total: number): (number | "...")[] => {
  const pages: (number | "...")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 4) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
};
