export const parsePositiveInt = (
    value: string | null | undefined,
    fallback: number
  ) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
  };
  