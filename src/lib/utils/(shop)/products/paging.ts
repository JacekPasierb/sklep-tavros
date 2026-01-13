export const parsePaging = (page = 1, limit = 12) => {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;

  return {safePage, safeLimit, skip: (safePage - 1) * safeLimit};
};
