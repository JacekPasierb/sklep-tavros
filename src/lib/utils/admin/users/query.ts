import { AdminUsersQuery, AdminUsersSearchParams } from "../../../../types/admin/users";


function parsePositiveInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeText(value: string | undefined) {
  return (value ?? "").trim();
}

export function normalizeAdminUsersQuery(
  sp: AdminUsersSearchParams,
  options?: { limit?: number }
): AdminUsersQuery {
  const limit = options?.limit ?? 20;

  return {
    page: parsePositiveInt(sp.page, 1),
    limit,
    q: normalizeText(sp.q),
  };
}
