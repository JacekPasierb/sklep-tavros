// components/product/ProductGallery/useGallery.ts
"use client";

import { useCallback, useState } from "react";

export function useGallery(length: number) {
  const [index, setIndex] = useState(0);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(length - 1, i)),
    [length]
  );

  return {
    index,
    setIndex: (i: number) => setIndex(clamp(i)),
    next: () => setIndex((i) => clamp(i + 1)),
    prev: () => setIndex((i) => clamp(i - 1)),
  };
}
