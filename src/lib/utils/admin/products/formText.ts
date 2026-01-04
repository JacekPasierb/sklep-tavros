


export const toSlugFromTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");



export const normalizeColor = (value: string) => value.trim().toLowerCase();

export const safeIntStock = (v: string) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
};

export const buildAutoAlt = (title: string, idx: number) => {
  const t = title.trim();
  if (!t) return idx === 0 ? "Main product image" : "Product image";
  return idx === 0 ? `${t} – main image` : `${t} – image #${idx + 1}`;
};
