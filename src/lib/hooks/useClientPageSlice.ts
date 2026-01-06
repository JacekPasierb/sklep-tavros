"use client";

import {useEffect, useMemo} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {parsePositiveInt} from "../utils/shared/number";

type Options<T> = {
  items: T[];
  pageSize: number;
  basePath: string; // "/account/orders"
};

export function useClientPageSlice<T>({items, pageSize, basePath}: Options<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(() => {
    return parsePositiveInt(searchParams.get("page"), 1);
  }, [searchParams]);

  const totalItems = items.length;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  // guard: jak ktoś ma ?page=999
  useEffect(() => {
    if (totalItems === 0) return;
    if (currentPage <= totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    if (totalPages <= 1) params.delete("page");
    else params.set("page", String(totalPages));

    const url = params.toString() ? `${basePath}?${params}` : basePath;
    router.replace(url);
  }, [currentPage, totalPages, totalItems, router, searchParams, basePath]);

  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems);

  return {currentPage, totalPages, totalItems, pageItems, showingFrom, showingTo};
}
