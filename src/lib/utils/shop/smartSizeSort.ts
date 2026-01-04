// src/lib/utils/shop/smartSizeSort.ts

type SizeKind = "alpha" | "numeric" | "other";

function normalizeSize(s: string) {
  return s.trim().toUpperCase();
}

// ile jest X w "XXL" -> 2
function countLeadingX(s: string) {
  const m = s.match(/^X+/);
  return m ? m[0].length : 0;
}

/**
 * Zamienia rozmiar na klucz sortowania:
 * - alpha: XS, S, M, L, XL, XXL, XXXL...
 * - numeric: 36, 36.5, 40
 * - other: ONE SIZE, OS, UNI itp.
 */
function getSizeSortKey(raw: string): {
  kind: SizeKind;
  // im mniejsza liczba, tym wcześniej
  weight: number;
  // do stabilnego sortowania przy "other"
  label: string;
} {
  const s = normalizeSize(raw);

  // 1) Numeric (np. 36, 36.5)
  const num = Number(s.replace(",", "."));
  if (Number.isFinite(num) && s.match(/^\d+([.,]\d+)?$/)) {
    return { kind: "numeric", weight: num, label: s };
  }

  // 2) Alpha sizes: XS/S/M/L/XL/XXL...
  // Wykrywamy:
  // - dokładnie: XS, S, M, L
  // - lub: X+S, X+L (np. XL, XXL, XXXL, XXS, XXXS)
  const baseMap: Record<string, number> = {
    XXXS: -3,
    XXS: -2,
    XS: -1,
    S: 0,
    M: 1,
    L: 2,
  };

  if (baseMap[s] !== undefined) {
    return { kind: "alpha", weight: baseMap[s], label: s };
  }

  // X...L (XL, XXL, XXXL...)
  if (/^X+L$/.test(s)) {
    const x = countLeadingX(s); // XL=1 => 3, XXL=2 => 4, ...
    return { kind: "alpha", weight: 2 + x, label: s };
  }

  // X...S (XXS, XXXS...) - jeśli nie złapane wyżej
  if (/^X+S$/.test(s)) {
    const x = countLeadingX(s); // XS=1 => -1, XXS=2 => -2 ...
    return { kind: "alpha", weight: -x, label: s };
  }

  // 3) Other
  return { kind: "other", weight: 9999, label: s };
}

export function smartSortSizes(input: string[]) {
  return [...input].sort((a, b) => {
    const A = getSizeSortKey(a);
    const B = getSizeSortKey(b);

    const kindOrder: Record<SizeKind, number> = {
      alpha: 0,
      numeric: 1,
      other: 2,
    };

    const ka = kindOrder[A.kind];
    const kb = kindOrder[B.kind];

    if (ka !== kb) return ka - kb;
    if (A.weight !== B.weight) return A.weight - B.weight;
    return A.label.localeCompare(B.label);
  });
}
