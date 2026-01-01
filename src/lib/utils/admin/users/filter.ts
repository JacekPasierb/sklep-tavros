import { AdminUsersQuery } from "../../../../types/admin/users";


export function buildUsersFilter(query: AdminUsersQuery): Record<string, unknown> {
  const filter: Record<string, unknown> = { role: "user" };

  if (query.q) {
    filter.$or = [
      { email: { $regex: query.q, $options: "i" } },
      { firstName: { $regex: query.q, $options: "i" } },
      { lastName: { $regex: query.q, $options: "i" } },
    ];
  }

  return filter;
}
