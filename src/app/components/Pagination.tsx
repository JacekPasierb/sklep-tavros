import Link from "next/link";

type PaginationProps = {
  basePath: string; // np. "/mens/all" albo `/${gender}/all`
  page: number; // aktualna strona (>=1)
  totalPages: number; // łączna liczba stron (>=1)
  query?: Record<string, string | undefined>; // np. { sort: "price_asc" }
  className?: string;
};

function buildHref(
  basePath: string,
  page: number,
  query?: PaginationProps["query"]
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") params.set(k, v);
    }
  }
  return `${basePath}?${params.toString()}`;
}

export default function Pagination({
  basePath,
  page,
  totalPages,
  query,
  className,
}: PaginationProps) {
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const prevHref = buildHref(basePath, prevPage, query);
  const nextHref = buildHref(basePath, nextPage, query);

  const isPrevDisabled = page === 1;
  const isNextDisabled = page >= totalPages;

  return (
    <nav
      className={`mt-8 flex items-center justify-center gap-3 text-sm ${
        className ?? ""
      }`}
    >
      <Link
        href={prevHref}
        aria-disabled={isPrevDisabled}
        className={`rounded border px-3 py-1 ${
          isPrevDisabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        ← Prev
      </Link>

      <span>
        Page {page} / {totalPages}
      </span>

      <Link
        href={nextHref}
        aria-disabled={isNextDisabled}
        className={`rounded border px-3 py-1 ${
          isNextDisabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}
