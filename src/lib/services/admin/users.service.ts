import User from "../../../models/User";
import { AdminUsersQuery, AdminUsersResult, PublicUser } from "../../../types/admin/users";
import { connectToDatabase } from "../../mongodb";
import { buildUsersFilter } from "../../utils/admin/users/filter";


export default async function getAdminUsers(
  query: AdminUsersQuery
): Promise<AdminUsersResult> {
  await connectToDatabase();

  const filter = buildUsersFilter(query);

  const total = await User.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / query.limit));
  const page = Math.min(query.page, pages);

  const rows = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * query.limit)
    .limit(query.limit)
    .select({ email: 1, firstName: 1, lastName: 1, createdAt: 1 })
    .lean<
      Array<{
        _id: unknown;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
      }>
    >();

  const users: PublicUser[] = rows.map((u) => ({
    id: String(u._id),
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    createdAt: u.createdAt.toISOString(),
  }));

  return { users, total, page, pages, limit: query.limit };
}
