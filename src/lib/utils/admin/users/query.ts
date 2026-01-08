import { AdminUsersQuery, AdminUsersSearchParams } from "../../../../types/admin/users";
import { parsePositiveInt } from "../../shared/number";


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
