export const toStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const arr = value.filter((x): x is string => typeof x === "string");
    return arr.length ? arr : undefined;
  }
  if (typeof value === "string") return value.trim() ? [value] : undefined;
  return undefined;
};
