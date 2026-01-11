export const normalizeSizes = (
  value: string | string[] | undefined
): string[] | undefined => {
  const arr = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? [value]
    : [];
  const normalized = arr.map((x) => x.trim().toUpperCase()).filter(Boolean);

  return normalized.length ? Array.from(new Set(normalized)) : undefined;
};
